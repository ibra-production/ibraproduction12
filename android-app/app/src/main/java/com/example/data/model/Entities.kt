package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "clients")
data class ClientEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val clientCode: String, // e.g. "IBR-2026-0001"
    val groomName: String,
    val brideName: String,
    val phone: String,
    val email: String = "",
    val wilayaNumber: Int = 16,
    val wilayaName: String = "الجزائر (Alger)",
    val address: String = "",
    val eventDate: String, // YYYY-MM-DD
    val eventDatesJson: String = "", // Additional days e.g. Henna, Shooting
    val serviceType: String = "تصوير حفل زفاف متكامل (Photo & Cinema)",
    val packageName: String = "VIP Royal 4K",
    val contractNumber: String = "",
    val totalPrice: Double,
    val paidAmount: Double,
    val remainingBalance: Double,
    val notes: String = "",
    val projectStatus: String = "CONFIRMED", // PENDING, CONFIRMED, IN_PRODUCTION, EDITING, DELIVERED, CANCELLED
    val usbSerial: String = "",
    val deliveryStatus: String = "PREPARING", // PREPARING, VERIFIED, DELIVERED
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "bookings")
data class BookingEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val bookingNumber: String, // e.g. "BK-2026-0042"
    val groomName: String,
    val brideName: String,
    val phone: String,
    val wilaya: String,
    val eventDate: String, // YYYY-MM-DD
    val eventTime: String = "17:00",
    val serviceType: String,
    val packageType: String,
    val guestCount: Int = 300,
    val venueName: String = "",
    val status: String = "PENDING", // PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
    val depositAmount: Double = 0.0,
    val totalAmount: Double = 0.0,
    val notes: String = "",
    val leadPhotographer: String = "",
    val leadVideographer: String = ""
)

@Entity(tableName = "transactions")
data class TransactionEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val type: String, // "INCOME" or "EXPENSE"
    val category: String, // "DEPOSIT", "PARTIAL_PAYMENT", "FINAL_BALANCE", "CREW_PAYOUT", "EQUIPMENT", "STUDIO_EXPENSE", "ALBUMS"
    val amount: Double,
    val title: String,
    val description: String = "",
    val clientCode: String = "",
    val clientName: String = "",
    val date: String, // YYYY-MM-DD
    val receiptNumber: String = "",
    val recordedBy: String = "Ibrahim (Studio Owner)"
)

@Entity(tableName = "usb_deliveries")
data class UsbDeliveryEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val clientCode: String,
    val groomName: String,
    val usbCapacity: String = "128 GB",
    val serialNumber: String = "USB-SAN-3.2-0049",
    val deliveryStatus: String = "PREPARING", // PREPARING, FORMATTED, COPYING, VERIFIED, DELIVERED
    val copiedPhotosCount: Int = 0,
    val copiedVideosCount: Int = 0,
    val hasContract: Boolean = true,
    val hasInvoices: Boolean = true,
    val hasAlbum: Boolean = true,
    val hasReadme: Boolean = true,
    val deliveredDate: String = "",
    val verifiedBy: String = "Ibrahim",
    val notes: String = ""
)

@Entity(tableName = "team_members")
data class TeamMemberEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val dossierNumber: String = "DOS-2026-001",
    val name: String,
    val categoryKey: String = "PHOTO_MEN", // One of the 15 categories
    val categoryNameAr: String = "فوتوغراف رجال",
    val role: String,
    val phone: String,
    val email: String = "",
    val wilayaNumber: Int = 16,
    val wilayaName: String = "16 - الجزائر (Alger)",
    val address: String = "",
    val specialty: String = "",
    val equipmentDetails: String = "",
    val feePerEvent: Double = 35000.0,
    val totalEarned: Double = 0.0,
    val totalPaid: Double = 0.0,
    val remainingBalance: Double = 0.0,
    val assignedEventsCount: Int = 0,
    val assignedWeddingsJson: String = "",
    val status: String = "AVAILABLE", // AVAILABLE, ON_EVENT, OFF_DUTY
    val rating: Float = 4.9f,
    val isStrictPrivacy: Boolean = false,
    val notes: String = "",
    val nationalIdNumber: String = ""
)

@Entity(tableName = "notifications")
data class NotificationEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val message: String,
    val category: String, // "BOOKING", "PAYMENT", "DELIVERY", "WEDDING_ALERT"
    val timestamp: Long = System.currentTimeMillis(),
    val isRead: Boolean = false,
    val clientCode: String? = null
)
