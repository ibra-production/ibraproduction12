package com.example.data.firebase

import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

/**
 * Native Customer Data Models matching the live website Firestore collections
 */
data class CustomerBooking(
    val id: String = "",
    val groomName: String = "",
    val brideName: String = "",
    val phone: String = "",
    val email: String? = null,
    val eventDate: String = "",
    val eventDates: List<String> = emptyList(),
    val eventTime: String = "14:00",
    val venue: String = "",
    val wilaya: String = "الجزائر",
    val eventType: String = "حفل زفاف فاخر",
    val serviceId: String? = null,
    val packageId: String? = null,
    val notes: String = "",
    val status: String = "new", // "new", "confirmed", "processing", "completed", "cancelled"
    val clientId: String? = null,
    val clientCode: String? = null,
    val source: String = "android",
    val createdAtMillis: Long = System.currentTimeMillis()
) {
    val statusLabelAr: String
        get() = when (status) {
            "new" -> "طلب حجز جديد قيد المراجعة"
            "confirmed" -> "حجز مؤكد ومعتمد رسمياً"
            "processing" -> "قيد المعالجة والتصوير السينمائي"
            "completed" -> "تم التسليم بنجاح"
            "cancelled" -> "حجز ملغى"
            else -> "حالة الحجز: $status"
        }
}

data class StudioService(
    val id: String = "",
    val nameAr: String = "",
    val descriptionAr: String = "",
    val price: Double = 0.0,
    val image: String = "",
    val active: Boolean = true,
    val order: Int = 0
)

data class StudioPackage(
    val id: String = "",
    val nameAr: String = "",
    val descriptionAr: String = "",
    val price: Double = 0.0,
    val badgeAr: String = "",
    val featuresAr: List<String> = emptyList(),
    val popular: Boolean = false,
    val active: Boolean = true,
    val order: Int = 0
)

data class StudioOffer(
    val id: String = "",
    val titleAr: String = "",
    val descriptionAr: String = "",
    val originalPrice: Double = 0.0,
    val discountPrice: Double = 0.0,
    val discountPercent: Int = 0,
    val badgeAr: String = "",
    val image: String = "",
    val active: Boolean = true
)

data class StudioPortfolioItem(
    val id: String = "",
    val titleAr: String = "",
    val category: String = "wedding",
    val image: String = "",
    val images: List<String> = emptyList(),
    val descriptionAr: String = "",
    val order: Int = 0
)

class IbraFirebaseRepository(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance(),
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
) {
    companion object {
        private const val TAG = "IbraFirebaseRepo"
        const val COLLECTION_BOOKINGS = "bookings"
        const val COLLECTION_SERVICES = "services"
        const val COLLECTION_PACKAGES = "packages"
        const val COLLECTION_OFFERS = "offers"
        const val COLLECTION_PORTFOLIO = "portfolio"
        const val COLLECTION_CLIENTS = "clients"
    }

    /**
     * Submit a customer booking natively into the shared Firestore 'bookings' collection.
     * Synchronizes instantly with the website executive CMS.
     */
    suspend fun submitBooking(booking: CustomerBooking): Result<String> {
        return try {
            val cleanPhone = booking.phone.trim().replace(Regex("[^0-9]"), "")
            val bookingMap = hashMapOf<String, Any?>(
                "groomName" to booking.groomName.trim(),
                "brideName" to booking.brideName.trim(),
                "phone" to cleanPhone,
                "email" to (booking.email?.trim() ?: ""),
                "eventDate" to booking.eventDate.trim(),
                "eventDates" to (if (booking.eventDates.isNotEmpty()) booking.eventDates else listOf(booking.eventDate.trim())),
                "eventTime" to booking.eventTime.trim(),
                "venue" to booking.venue.trim(),
                "wilaya" to booking.wilaya.trim(),
                "eventType" to booking.eventType.trim(),
                "serviceId" to booking.serviceId,
                "packageId" to booking.packageId,
                "notes" to booking.notes.trim(),
                "status" to "new",
                "source" to "android",
                "createdAt" to FieldValue.serverTimestamp()
            )

            val docRef = firestore.collection(COLLECTION_BOOKINGS).add(bookingMap).await()
            val bookingId = docRef.id

            // Generate client code reference
            val clientCode = "IBRA-A-${bookingId.takeLast(8).uppercase()}"
            try {
                firestore.collection(COLLECTION_BOOKINGS).document(bookingId).update(
                    mapOf(
                        "clientCode" to clientCode,
                        "clientId" to "client_$cleanPhone"
                    )
                ).await()
            } catch (e: Exception) {
                Log.w(TAG, "Notice attaching clientCode: ${e.message}")
            }

            Log.d(TAG, "Booking submitted successfully from Android with ID: $bookingId")
            Result.success(bookingId)
        } catch (e: Exception) {
            Log.e(TAG, "Error submitting booking from Android", e)
            Result.failure(e)
        }
    }

    /**
     * Real-time flow of customer bookings matching a phone number.
     * Reflects website status changes ("new" -> "confirmed" -> "processing" -> "completed") in real time.
     */
    fun observeCustomerBookings(phone: String): Flow<List<CustomerBooking>> = callbackFlow {
        val cleanPhone = phone.trim().replace(Regex("[^0-9]"), "")
        val query = if (cleanPhone.isNotEmpty()) {
            firestore.collection(COLLECTION_BOOKINGS).whereEqualTo("phone", cleanPhone)
        } else {
            firestore.collection(COLLECTION_BOOKINGS).limit(20)
        }

        val listener = query.addSnapshotListener { snapshot, error ->
            if (error != null) {
                Log.w(TAG, "observeCustomerBookings error: ${error.message}")
                trySend(emptyList())
                return@addSnapshotListener
            }

            val list = snapshot?.documents?.mapNotNull { doc ->
                mapToCustomerBooking(doc)
            } ?: emptyList()

            trySend(list)
        }

        awaitClose { listener.remove() }
    }

    /**
     * Update permitted client fields (notes, special requests) from Android.
     * Note: Status cannot be updated by non-admin according to Firestore rules.
     */
    suspend fun updateCustomerNotes(bookingId: String, notes: String): Result<Unit> {
        return try {
            firestore.collection(COLLECTION_BOOKINGS).document(bookingId).update("notes", notes).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e(TAG, "Error updating customer notes", e)
            Result.failure(e)
        }
    }

    /**
     * Real-time flow of active services from Firestore
     */
    fun observeServices(): Flow<List<StudioService>> = callbackFlow {
        val listener = firestore.collection(COLLECTION_SERVICES).addSnapshotListener { snapshot, error ->
            if (error != null) {
                trySend(emptyList())
                return@addSnapshotListener
            }
            val list = snapshot?.documents?.mapNotNull { doc ->
                val nameAr = doc.getString("nameAr") ?: doc.getString("name") ?: ""
                val desc = doc.getString("descriptionAr") ?: doc.getString("description") ?: ""
                val price = (doc.get("price") as? Number)?.toDouble() ?: 0.0
                val img = doc.getString("image") ?: ""
                val active = doc.getBoolean("active") ?: true
                val order = (doc.get("order") as? Number)?.toInt() ?: 0
                StudioService(
                    id = doc.id,
                    nameAr = nameAr,
                    descriptionAr = desc,
                    price = price,
                    image = img,
                    active = active,
                    order = order
                )
            }?.filter { it.active }?.sortedBy { it.order } ?: emptyList()

            trySend(list)
        }
        awaitClose { listener.remove() }
    }

    /**
     * Real-time flow of packages from Firestore
     */
    fun observePackages(): Flow<List<StudioPackage>> = callbackFlow {
        val listener = firestore.collection(COLLECTION_PACKAGES).addSnapshotListener { snapshot, error ->
            if (error != null) {
                trySend(emptyList())
                return@addSnapshotListener
            }
            val list = snapshot?.documents?.mapNotNull { doc ->
                val nameAr = doc.getString("nameAr") ?: doc.getString("name") ?: ""
                val desc = doc.getString("descriptionAr") ?: doc.getString("description") ?: ""
                val price = (doc.get("price") as? Number)?.toDouble() ?: 0.0
                val badge = doc.getString("badgeAr") ?: doc.getString("badge") ?: ""
                @Suppress("UNCHECKED_CAST")
                val features = (doc.get("featuresAr") as? List<String>)
                    ?: (doc.get("features") as? List<String>)
                    ?: emptyList()
                val popular = doc.getBoolean("popular") ?: false
                val active = doc.getBoolean("active") ?: true
                val order = (doc.get("order") as? Number)?.toInt() ?: 0
                StudioPackage(
                    id = doc.id,
                    nameAr = nameAr,
                    descriptionAr = desc,
                    price = price,
                    badgeAr = badge,
                    featuresAr = features,
                    popular = popular,
                    active = active,
                    order = order
                )
            }?.filter { it.active }?.sortedBy { it.order } ?: emptyList()

            trySend(list)
        }
        awaitClose { listener.remove() }
    }

    /**
     * Real-time flow of active offers from Firestore
     */
    fun observeOffers(): Flow<List<StudioOffer>> = callbackFlow {
        val listener = firestore.collection(COLLECTION_OFFERS).addSnapshotListener { snapshot, error ->
            if (error != null) {
                trySend(emptyList())
                return@addSnapshotListener
            }
            val list = snapshot?.documents?.mapNotNull { doc ->
                val titleAr = doc.getString("titleAr") ?: doc.getString("title") ?: ""
                val desc = doc.getString("descriptionAr") ?: doc.getString("description") ?: ""
                val orig = (doc.get("originalPrice") as? Number)?.toDouble() ?: 0.0
                val disc = (doc.get("discountPrice") as? Number)?.toDouble() ?: 0.0
                val percent = (doc.get("discountPercent") as? Number)?.toInt() ?: 0
                val badge = doc.getString("badgeAr") ?: ""
                val img = doc.getString("image") ?: ""
                val active = doc.getBoolean("active") ?: true
                StudioOffer(
                    id = doc.id,
                    titleAr = titleAr,
                    descriptionAr = desc,
                    originalPrice = orig,
                    discountPrice = disc,
                    discountPercent = percent,
                    badgeAr = badge,
                    image = img,
                    active = active
                )
            }?.filter { it.active } ?: emptyList()

            trySend(list)
        }
        awaitClose { listener.remove() }
    }

    /**
     * Real-time flow of portfolio items from Firestore
     */
    fun observePortfolio(): Flow<List<StudioPortfolioItem>> = callbackFlow {
        val listener = firestore.collection(COLLECTION_PORTFOLIO).addSnapshotListener { snapshot, error ->
            if (error != null) {
                trySend(emptyList())
                return@addSnapshotListener
            }
            val list = snapshot?.documents?.mapNotNull { doc ->
                val titleAr = doc.getString("titleAr") ?: doc.getString("title") ?: ""
                val cat = doc.getString("category") ?: "wedding"
                val img = doc.getString("image") ?: ""
                @Suppress("UNCHECKED_CAST")
                val images = (doc.get("images") as? List<String>) ?: listOf(img)
                val desc = doc.getString("descriptionAr") ?: ""
                val order = (doc.get("order") as? Number)?.toInt() ?: 0
                StudioPortfolioItem(
                    id = doc.id,
                    titleAr = titleAr,
                    category = cat,
                    image = img,
                    images = images,
                    descriptionAr = desc,
                    order = order
                )
            }?.sortedBy { it.order } ?: emptyList()

            trySend(list)
        }
        awaitClose { listener.remove() }
    }

    private fun mapToCustomerBooking(doc: DocumentSnapshot): CustomerBooking? {
        val groomName = doc.getString("groomName") ?: return null
        val brideName = doc.getString("brideName") ?: ""
        val phone = doc.getString("phone") ?: ""
        val email = doc.getString("email")
        val eventDate = doc.getString("eventDate") ?: ""
        @Suppress("UNCHECKED_CAST")
        val eventDates = (doc.get("eventDates") as? List<String>) ?: listOf(eventDate)
        val eventTime = doc.getString("eventTime") ?: "14:00"
        val venue = doc.getString("venue") ?: ""
        val wilaya = doc.getString("wilaya") ?: "الجزائر"
        val eventType = doc.getString("eventType") ?: "حفل زفاف فاخر"
        val serviceId = doc.getString("serviceId")
        val packageId = doc.getString("packageId")
        val notes = doc.getString("notes") ?: ""
        val status = doc.getString("status") ?: "new"
        val clientId = doc.getString("clientId")
        val clientCode = doc.getString("clientCode")
        val source = doc.getString("source") ?: "website"

        return CustomerBooking(
            id = doc.id,
            groomName = groomName,
            brideName = brideName,
            phone = phone,
            email = email,
            eventDate = eventDate,
            eventDates = eventDates,
            eventTime = eventTime,
            venue = venue,
            wilaya = wilaya,
            eventType = eventType,
            serviceId = serviceId,
            packageId = packageId,
            notes = notes,
            status = status,
            clientId = clientId,
            clientCode = clientCode,
            source = source
        )
    }
}
