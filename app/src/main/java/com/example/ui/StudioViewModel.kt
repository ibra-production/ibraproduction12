package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.barcode.Code128Encoder
import com.example.data.local.StudioDatabase
import com.example.data.model.BookingEntity
import com.example.data.model.ClientEntity
import com.example.data.model.NotificationEntity
import com.example.data.model.TeamMemberEntity
import com.example.data.model.TransactionEntity
import com.example.data.model.UsbDeliveryEntity
import com.example.i18n.AppLanguage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class StudioTab(val iconName: String) {
    DASHBOARD("dashboard"),
    BOOKINGS("bookings"),
    CRM("crm"),
    BARCODES("barcodes"),
    USB("usb"),
    FINANCE("finance"),
    CALENDAR("calendar"),
    TEAM("team"),
    DOCUMENTS("documents"),
    MEDIA("media"),
    AI_ASSISTANT("ai_assistant"),
    NOTIFICATIONS("notifications"),
    SETTINGS("settings"),
    AUTH("auth"),
    CLIENT_PORTAL("client_portal")
}

enum class AppMode {
    CLIENT_PORTAL,   // Dedicated Client & Groom Portal (Order tracking, packages, timeline)
    ADMIN_STUDIO     // Executive Management Studio (Secured by Biometrics)
}

enum class UserRole {
    STUDIO_OWNER,
    CREW_MEMBER,
    GROOM_CLIENT
}

data class AuthUser(
    val name: String = "إبراهيم (Studio Director)",
    val email: String = "contact@ibraprod.online",
    val phone: String = "0779000833",
    val role: UserRole = UserRole.STUDIO_OWNER,
    val clientCode: String? = null
)

data class DashboardMetrics(
    val totalClients: Int = 0,
    val totalGrooms: Int = 0,
    val newBookings: Int = 0,
    val confirmedBookings: Int = 0,
    val upcomingWeddings: Int = 0,
    val completedProjects: Int = 0,
    val totalRevenue: Double = 0.0,
    val totalReceived: Double = 0.0,
    val totalOutstandingDebt: Double = 0.0,
    val totalExpenses: Double = 0.0,
    val netProfit: Double = 0.0
)

class StudioViewModel(application: Application) : AndroidViewModel(application) {
    private val database = StudioDatabase.getInstance(application)
    private val clientDao = database.clientDao()
    private val bookingDao = database.bookingDao()
    private val transactionDao = database.transactionDao()
    private val usbDao = database.usbDeliveryDao()
    private val teamDao = database.teamDao()
    private val notificationDao = database.notificationDao()

    // Authentication State
    private val _isAuthenticated = MutableStateFlow(true)
    val isAuthenticated: StateFlow<Boolean> = _isAuthenticated.asStateFlow()

    private val _currentUser = MutableStateFlow<AuthUser?>(AuthUser())
    val currentUser: StateFlow<AuthUser?> = _currentUser.asStateFlow()

    // Dual App Mode & Biometric Security
    private val _appMode = MutableStateFlow(AppMode.CLIENT_PORTAL)
    val appMode: StateFlow<AppMode> = _appMode.asStateFlow()

    private val _isAdminBiometricUnlocked = MutableStateFlow(false)
    val isAdminBiometricUnlocked: StateFlow<Boolean> = _isAdminBiometricUnlocked.asStateFlow()

    private val _showBiometricPrompt = MutableStateFlow(false)
    val showBiometricPrompt: StateFlow<Boolean> = _showBiometricPrompt.asStateFlow()

    // Real-Time Wedding Order Tracking state
    private val _trackedOrderCode = MutableStateFlow("IBR-2026-0001")
    val trackedOrderCode: StateFlow<String> = _trackedOrderCode.asStateFlow()

    private val _trackedClient = MutableStateFlow<ClientEntity?>(null)
    val trackedClient: StateFlow<ClientEntity?> = _trackedClient.asStateFlow()

    private val _trackedUsb = MutableStateFlow<UsbDeliveryEntity?>(null)
    val trackedUsb: StateFlow<UsbDeliveryEntity?> = _trackedUsb.asStateFlow()

    // Navigation and UI state
    private val _currentTab = MutableStateFlow(StudioTab.CLIENT_PORTAL)
    val currentTab: StateFlow<StudioTab> = _currentTab.asStateFlow()

    private val _currentLanguage = MutableStateFlow(AppLanguage.ARABIC)
    val currentLanguage: StateFlow<AppLanguage> = _currentLanguage.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedClient = MutableStateFlow<ClientEntity?>(null)
    val selectedClient: StateFlow<ClientEntity?> = _selectedClient.asStateFlow()

    private val _showScannerSheet = MutableStateFlow(false)
    val showScannerSheet: StateFlow<Boolean> = _showScannerSheet.asStateFlow()

    private val _scannedBarcode = MutableStateFlow("")
    val scannedBarcode: StateFlow<String> = _scannedBarcode.asStateFlow()

    private val _matchedClient = MutableStateFlow<ClientEntity?>(null)
    val matchedClient: StateFlow<ClientEntity?> = _matchedClient.asStateFlow()

    private val _selectedMemberDossier = MutableStateFlow<TeamMemberEntity?>(null)
    val selectedMemberDossier: StateFlow<TeamMemberEntity?> = _selectedMemberDossier.asStateFlow()

    private val _selectedCategoryFilter = MutableStateFlow<String>("ALL")
    val selectedCategoryFilter: StateFlow<String> = _selectedCategoryFilter.asStateFlow()

    // Database reactive streams
    val clients: StateFlow<List<ClientEntity>> = clientDao.getAllClients()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val bookings: StateFlow<List<BookingEntity>> = bookingDao.getAllBookings()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val transactions: StateFlow<List<TransactionEntity>> = transactionDao.getAllTransactions()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val usbDeliveries: StateFlow<List<UsbDeliveryEntity>> = usbDao.getAllUsbDeliveries()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val teamMembers: StateFlow<List<TeamMemberEntity>> = teamDao.getAllTeamMembers()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val notifications: StateFlow<List<NotificationEntity>> = notificationDao.getAllNotifications()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val unreadNotificationsCount: StateFlow<Int> = notificationDao.getUnreadCount()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    // Calculated Dashboard Metrics from real database data
    val dashboardMetrics: StateFlow<DashboardMetrics> = combine(
        clients, bookings, transactions
    ) { clientList, bookingList, txList ->
        var totalRev = 0.0
        var totalDebt = 0.0
        clientList.forEach { client ->
            totalRev += client.totalPrice
            totalDebt += client.remainingBalance
        }

        var totalInc = 0.0
        var totalExp = 0.0
        txList.forEach { tx ->
            if (tx.type == "INCOME") totalInc += tx.amount
            else if (tx.type == "EXPENSE") totalExp += tx.amount
        }

        val confirmedCount = bookingList.count { it.status == "CONFIRMED" }
        val newCount = bookingList.count { it.status == "PENDING" }
        val completedCount = clientList.count { it.projectStatus == "DELIVERED" }

        DashboardMetrics(
            totalClients = clientList.size,
            totalGrooms = clientList.size,
            newBookings = newCount,
            confirmedBookings = confirmedCount,
            upcomingWeddings = confirmedCount,
            completedProjects = completedCount,
            totalRevenue = totalRev,
            totalReceived = totalInc,
            totalOutstandingDebt = totalDebt,
            totalExpenses = totalExp,
            netProfit = (totalInc - totalExp)
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), DashboardMetrics())

    init {
        viewModelScope.launch(Dispatchers.IO) {
            val defaultClient = clientDao.getClientByCode("IBR-2026-0001")
            if (defaultClient != null) {
                _trackedClient.value = defaultClient
                _trackedUsb.value = usbDao.getByClientCode("IBR-2026-0001")
            }
        }
    }

    fun selectTab(tab: StudioTab) {
        _currentTab.value = tab
    }

    fun setLanguage(lang: AppLanguage) {
        _currentLanguage.value = lang
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setSelectedClient(client: ClientEntity?) {
        _selectedClient.value = client
    }

    fun openScanner() {
        _showScannerSheet.value = true
        _scannedBarcode.value = ""
        _matchedClient.value = null
    }

    fun closeScanner() {
        _showScannerSheet.value = false
    }

    fun onBarcodeDetected(code: String) {
        _scannedBarcode.value = code
        viewModelScope.launch(Dispatchers.IO) {
            val client = clientDao.getClientByCode(code.trim().uppercase())
            _matchedClient.value = client
        }
    }

    // Client Actions
    fun createClient(
        groomName: String,
        brideName: String,
        phone: String,
        wilayaNumber: Int,
        wilayaName: String,
        eventDate: String,
        packageName: String,
        totalPrice: Double,
        depositAmount: Double,
        notes: String
    ) {
        viewModelScope.launch(Dispatchers.IO) {
            val count = clientDao.getCount()
            val newBarcode = Code128Encoder.generateNextBarcode(count)
            val remaining = (totalPrice - depositAmount).coerceAtLeast(0.0)

            val newClient = ClientEntity(
                clientCode = newBarcode,
                groomName = groomName,
                brideName = brideName,
                phone = phone,
                wilayaNumber = wilayaNumber,
                wilayaName = wilayaName,
                eventDate = eventDate,
                packageName = packageName,
                contractNumber = "CNT-2026-${String.format("%03d", count + 10)}",
                totalPrice = totalPrice,
                paidAmount = depositAmount,
                remainingBalance = remaining,
                notes = notes,
                projectStatus = "CONFIRMED",
                usbSerial = "USB-SAN-128-${String.format("%02d", count + 1)}",
                deliveryStatus = "PREPARING"
            )
            clientDao.insertClient(newClient)

            // Register corresponding USB Delivery record
            usbDao.insertUsbDelivery(
                UsbDeliveryEntity(
                    clientCode = newBarcode,
                    groomName = groomName,
                    usbCapacity = "128 GB",
                    serialNumber = newClient.usbSerial,
                    deliveryStatus = "PREPARING",
                    notes = "تم إنشاء سجل فلاشة العريس عند فتح الملف"
                )
            )

            // Record initial deposit transaction if paid
            if (depositAmount > 0) {
                transactionDao.insertTransaction(
                    TransactionEntity(
                        type = "INCOME",
                        category = "DEPOSIT",
                        amount = depositAmount,
                        title = "تسبيق حجز عرس - $groomName",
                        description = "دفعة أولى عند فتح ملف العريس $newBarcode",
                        clientCode = newBarcode,
                        clientName = groomName,
                        date = eventDate
                    )
                )
            }

            // Notification
            notificationDao.insertNotification(
                NotificationEntity(
                    title = "تم إضافة عريس جديد: $groomName",
                    message = "تم تسجيل ملف العريس $newBarcode بنجاح مع إصدار باركود Code 128 وحزمة $packageName.",
                    category = "BOOKING",
                    clientCode = newBarcode
                )
            )
        }
    }

    // Booking Actions
    fun createBooking(
        groomName: String,
        brideName: String,
        phone: String,
        wilaya: String,
        eventDate: String,
        eventTime: String,
        serviceType: String,
        packageType: String,
        guestCount: Int,
        venueName: String,
        totalAmount: Double,
        depositAmount: Double,
        notes: String
    ) {
        viewModelScope.launch(Dispatchers.IO) {
            val count = bookingDao.getCount()
            val booking = BookingEntity(
                bookingNumber = "BK-2026-${String.format("%04d", count + 50)}",
                groomName = groomName,
                brideName = brideName,
                phone = phone,
                wilaya = wilaya,
                eventDate = eventDate,
                eventTime = eventTime,
                serviceType = serviceType,
                packageType = packageType,
                guestCount = guestCount,
                venueName = venueName,
                status = "CONFIRMED",
                depositAmount = depositAmount,
                totalAmount = totalAmount,
                notes = notes
            )
            bookingDao.insertBooking(booking)

            notificationDao.insertNotification(
                NotificationEntity(
                    title = "حجز عرس جديد مؤكد",
                    message = "حجز العريس $groomName بتاريخ $eventDate في $venueName ($wilaya).",
                    category = "BOOKING"
                )
            )
        }
    }

    fun updateBookingStatus(booking: BookingEntity, newStatus: String) {
        viewModelScope.launch(Dispatchers.IO) {
            bookingDao.updateBooking(booking.copy(status = newStatus))
        }
    }

    // Transaction Actions
    fun addTransaction(
        type: String,
        category: String,
        amount: Double,
        title: String,
        description: String,
        clientCode: String,
        clientName: String,
        date: String
    ) {
        viewModelScope.launch(Dispatchers.IO) {
            transactionDao.insertTransaction(
                TransactionEntity(
                    type = type,
                    category = category,
                    amount = amount,
                    title = title,
                    description = description,
                    clientCode = clientCode,
                    clientName = clientName,
                    date = date
                )
            )

            // If income associated with a client, update client paid amount and remaining debt
            if (type == "INCOME" && clientCode.isNotBlank()) {
                val client = clientDao.getClientByCode(clientCode)
                if (client != null) {
                    val newPaid = client.paidAmount + amount
                    val newRemaining = (client.totalPrice - newPaid).coerceAtLeast(0.0)
                    clientDao.updateClient(
                        client.copy(
                            paidAmount = newPaid,
                            remainingBalance = newRemaining
                        )
                    )
                }
            }
        }
    }

    // USB Delivery Actions
    fun updateUsbChecklist(
        usb: UsbDeliveryEntity,
        hasPhotos: Boolean,
        hasVideos: Boolean,
        hasContract: Boolean,
        hasInvoices: Boolean,
        hasAlbum: Boolean,
        hasReadme: Boolean
    ) {
        viewModelScope.launch(Dispatchers.IO) {
            val allChecked = hasPhotos && hasVideos && hasContract && hasInvoices && hasAlbum && hasReadme
            val newStatus = if (allChecked) "VERIFIED" else "COPYING"
            usbDao.updateUsbDelivery(
                usb.copy(
                    hasContract = hasContract,
                    hasInvoices = hasInvoices,
                    hasAlbum = hasAlbum,
                    hasReadme = hasReadme,
                    deliveryStatus = newStatus
                )
            )
        }
    }

    fun markUsbDelivered(usb: UsbDeliveryEntity) {
        viewModelScope.launch(Dispatchers.IO) {
            val updated = usb.copy(
                deliveryStatus = "DELIVERED",
                deliveredDate = "2026-10-31"
            )
            usbDao.updateUsbDelivery(updated)

            // Update client delivery status
            val client = clientDao.getClientByCode(usb.clientCode)
            if (client != null) {
                clientDao.updateClient(
                    client.copy(
                        deliveryStatus = "DELIVERED",
                        projectStatus = "DELIVERED"
                    )
                )
            }

            notificationDao.insertNotification(
                NotificationEntity(
                    title = "تم تسليم الفلاشة للعريس بنجاح",
                    message = "تم تسليم فلاشة USB للعريس ${usb.groomName} (${usb.clientCode}) بنجاح.",
                    category = "DELIVERY",
                    clientCode = usb.clientCode
                )
            )
        }
    }

    fun markNotificationAsRead(id: Long) {
        viewModelScope.launch(Dispatchers.IO) {
            notificationDao.markAsRead(id)
        }
    }

    fun markAllNotificationsRead() {
        viewModelScope.launch(Dispatchers.IO) {
            notificationDao.markAllAsRead()
        }
    }

    // Team & Craftsmen Dossier Management
    fun selectMemberDossier(member: TeamMemberEntity?) {
        _selectedMemberDossier.value = member
    }

    fun setCategoryFilter(categoryKey: String) {
        _selectedCategoryFilter.value = categoryKey
    }

    fun addTeamMember(member: TeamMemberEntity) {
        viewModelScope.launch(Dispatchers.IO) {
            teamDao.insertTeamMember(member)
            notificationDao.insertNotification(
                NotificationEntity(
                    title = "إضافة ملف مهني جديد",
                    message = "تم إنشاء ملف جديد لـ ${member.name} (${member.categoryNameAr}) برقم ${member.dossierNumber}.",
                    category = "CREW_ALERT"
                )
            )
        }
    }

    fun updateTeamMember(member: TeamMemberEntity) {
        viewModelScope.launch(Dispatchers.IO) {
            teamDao.updateTeamMember(member)
            if (_selectedMemberDossier.value?.id == member.id) {
                _selectedMemberDossier.value = member
            }
        }
    }

    fun deleteTeamMember(member: TeamMemberEntity) {
        viewModelScope.launch(Dispatchers.IO) {
            teamDao.deleteTeamMember(member)
            if (_selectedMemberDossier.value?.id == member.id) {
                _selectedMemberDossier.value = null
            }
        }
    }

    fun recordTeamPayout(member: TeamMemberEntity, amount: Double, note: String) {
        viewModelScope.launch(Dispatchers.IO) {
            val newPaid = member.totalPaid + amount
            val newBalance = (member.totalEarned - newPaid).coerceAtLeast(0.0)
            val updated = member.copy(totalPaid = newPaid, remainingBalance = newBalance)
            teamDao.updateTeamMember(updated)
            if (_selectedMemberDossier.value?.id == member.id) {
                _selectedMemberDossier.value = updated
            }

            // Also record in financial transactions as CREW_PAYOUT
            transactionDao.insertTransaction(
                TransactionEntity(
                    type = "EXPENSE",
                    category = "CREW_PAYOUT",
                    amount = amount,
                    title = "تسديد مستحقات: ${member.name}",
                    description = "${member.categoryNameAr} - $note",
                    clientName = member.name,
                    date = "2026-10-31"
                )
            )
        }
    }

    fun assignMemberToWedding(member: TeamMemberEntity, weddingLabel: String) {
        viewModelScope.launch(Dispatchers.IO) {
            val existing = member.assignedWeddingsJson
            val updatedWeddings = if (existing.isBlank()) weddingLabel else "$existing | $weddingLabel"
            val newCount = member.assignedEventsCount + 1
            val newEarned = member.totalEarned + member.feePerEvent
            val newBalance = (newEarned - member.totalPaid).coerceAtLeast(0.0)
            val updated = member.copy(
                assignedEventsCount = newCount,
                assignedWeddingsJson = updatedWeddings,
                totalEarned = newEarned,
                remainingBalance = newBalance
            )
            teamDao.updateTeamMember(updated)
            if (_selectedMemberDossier.value?.id == member.id) {
                _selectedMemberDossier.value = updated
            }
        }
    }

    // Authentication Actions
    fun signInWithGoogle(email: String, displayName: String) {
        _currentUser.value = AuthUser(
            name = displayName.ifBlank { "إبراهيم (Studio Director)" },
            email = email.ifBlank { "contact@ibraprod.online" },
            role = UserRole.STUDIO_OWNER
        )
        _isAuthenticated.value = true
        _currentTab.value = StudioTab.DASHBOARD
    }

    fun signInWithPin(pin: String): Boolean {
        if (pin.length >= 4) {
            _currentUser.value = AuthUser(
                name = "إبراهيم (Studio Director)",
                email = "contact@ibraprod.online",
                phone = "0779000833",
                role = UserRole.STUDIO_OWNER
            )
            _isAuthenticated.value = true
            _currentTab.value = StudioTab.DASHBOARD
            return true
        }
        return false
    }

    fun signInAsGroom(barcode: String, phone: String, onResult: (Boolean, String?) -> Unit) {
        viewModelScope.launch(Dispatchers.IO) {
            val client = clientDao.getClientByCode(barcode.trim().uppercase())
            if (client != null) {
                _currentUser.value = AuthUser(
                    name = client.groomName,
                    email = client.email.ifBlank { "groom@ibraprod.online" },
                    phone = client.phone,
                    role = UserRole.GROOM_CLIENT,
                    clientCode = client.clientCode
                )
                _isAuthenticated.value = true
                _selectedClient.value = client
                _currentTab.value = StudioTab.CRM
                onResult(true, null)
            } else {
                onResult(false, "لم يتم العثور على عريس بهذا الرمز ($barcode)")
            }
        }
    }

    fun signOut() {
        _currentUser.value = null
        _isAuthenticated.value = false
        _currentTab.value = StudioTab.AUTH
    }

    fun enterAsGuestOrDemo() {
        _currentUser.value = AuthUser(
            name = "مدير الاستوديو (Studio Owner)",
            email = "contact@ibraprod.online",
            role = UserRole.STUDIO_OWNER
        )
        _isAuthenticated.value = true
        _isAdminBiometricUnlocked.value = true
        _appMode.value = AppMode.ADMIN_STUDIO
        _currentTab.value = StudioTab.DASHBOARD
    }

    // App Mode & Biometric Controls
    fun switchToClientPortal() {
        _appMode.value = AppMode.CLIENT_PORTAL
        _currentTab.value = StudioTab.CLIENT_PORTAL
    }

    fun requestAdminAccess() {
        if (_isAdminBiometricUnlocked.value) {
            _appMode.value = AppMode.ADMIN_STUDIO
            _currentTab.value = StudioTab.DASHBOARD
        } else {
            _showBiometricPrompt.value = true
        }
    }

    fun dismissBiometricPrompt() {
        _showBiometricPrompt.value = false
    }

    fun unlockAdminViaBiometric() {
        _isAdminBiometricUnlocked.value = true
        _showBiometricPrompt.value = false
        _appMode.value = AppMode.ADMIN_STUDIO
        _currentTab.value = StudioTab.DASHBOARD
        _currentUser.value = AuthUser(
            name = "إبراهيم (Studio Director)",
            email = "contact@ibraprod.online",
            role = UserRole.STUDIO_OWNER
        )
    }

    fun lockAdmin() {
        _isAdminBiometricUnlocked.value = false
        _appMode.value = AppMode.CLIENT_PORTAL
        _currentTab.value = StudioTab.CLIENT_PORTAL
    }

    fun searchAndTrackOrder(query: String) {
        val clean = query.trim().uppercase()
        _trackedOrderCode.value = clean
        viewModelScope.launch(Dispatchers.IO) {
            val client = clientDao.getClientByCode(clean)
            if (client != null) {
                _trackedClient.value = client
                _trackedUsb.value = usbDao.getByClientCode(client.clientCode)
            } else {
                val found = clients.value.firstOrNull {
                    it.phone.contains(clean) || it.groomName.contains(clean, ignoreCase = true) || it.clientCode.contains(clean, ignoreCase = true)
                }
                if (found != null) {
                    _trackedClient.value = found
                    _trackedUsb.value = usbDao.getByClientCode(found.clientCode)
                }
            }
        }
    }

    fun selectTrackedClient(client: ClientEntity) {
        _trackedClient.value = client
        _trackedOrderCode.value = client.clientCode
        viewModelScope.launch(Dispatchers.IO) {
            _trackedUsb.value = usbDao.getByClientCode(client.clientCode)
        }
    }
}
