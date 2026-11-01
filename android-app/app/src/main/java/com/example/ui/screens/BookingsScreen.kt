package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.ui.platform.LocalContext
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.BookingEntity
import com.example.ui.StudioViewModel
import com.example.ui.components.ALGERIAN_WILAYAS
import com.example.ui.components.StatusBadge
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.BackgroundSecondary
import com.example.ui.theme.DangerRed
import com.example.ui.theme.LightGold
import com.example.ui.theme.PrimaryGold
import com.example.ui.theme.SuccessGreen
import com.example.ui.theme.SurfaceBorder
import com.example.ui.theme.SurfaceCard
import com.example.ui.theme.SurfaceElevated
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import com.example.ui.theme.WarningOrange

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookingsScreen(viewModel: StudioViewModel) {
    val bookings by viewModel.bookings.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedStatusFilter by remember { mutableStateOf("ALL") }
    var selectedWilayaFilter by remember { mutableStateOf("ALL") }
    var showNewBookingDialog by remember { mutableStateOf(false) }
    var selectedBookingForDetails by remember { mutableStateOf<BookingEntity?>(null) }

    // Conflict detection: detect any eventDate that appears more than once among confirmed bookings
    val conflictingDates = remember(bookings) {
        bookings.filter { it.status == "CONFIRMED" }
            .groupBy { it.eventDate }
            .filter { it.value.size > 1 }
            .keys
    }

    val filteredBookings = remember(bookings, searchQuery, selectedStatusFilter, selectedWilayaFilter) {
        bookings.filter { b ->
            val matchQuery = searchQuery.isBlank() ||
                    b.groomName.contains(searchQuery, ignoreCase = true) ||
                    b.brideName.contains(searchQuery, ignoreCase = true) ||
                    b.phone.contains(searchQuery, ignoreCase = true) ||
                    b.bookingNumber.contains(searchQuery, ignoreCase = true)

            val matchStatus = selectedStatusFilter == "ALL" || b.status == selectedStatusFilter
            val matchWilaya = selectedWilayaFilter == "ALL" || b.wilaya.contains(selectedWilayaFilter)

            matchQuery && matchStatus && matchWilaya
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(10.dp))

            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("بحث برقم الحجز، اسم العريس، أو الهاتف...", color = TextMuted, fontSize = 13.sp) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = PrimaryGold) },
                trailingIcon = {
                    if (searchQuery.isNotBlank()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(Icons.Default.Close, contentDescription = "Clear", tint = TextSecondary)
                        }
                    }
                },
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary,
                    focusedBorderColor = PrimaryGold,
                    unfocusedBorderColor = SurfaceBorder,
                    focusedContainerColor = SurfaceCard,
                    unfocusedContainerColor = SurfaceCard
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("booking_search_input")
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Status Filter Tabs
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                val filters = listOf(
                    "ALL" to "الكل (${bookings.size})",
                    "CONFIRMED" to "المؤكدة (${bookings.count { it.status == "CONFIRMED" }})",
                    "PENDING" to "قيد الانتظار (${bookings.count { it.status == "PENDING" }})",
                    "COMPLETED" to "المكتملة (${bookings.count { it.status == "COMPLETED" }})",
                    "CANCELLED" to "الملغاة (${bookings.count { it.status == "CANCELLED" }})"
                )
                items(filters) { (statusKey, label) ->
                    val isSelected = selectedStatusFilter == statusKey
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isSelected) PrimaryGold else SurfaceCard)
                            .border(1.dp, if (isSelected) PrimaryGold else SurfaceBorder, RoundedCornerShape(20.dp))
                            .clickable { selectedStatusFilter = statusKey }
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = label,
                            color = if (isSelected) BackgroundDark else TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    }
                }
            }

            // Conflict Warning Alert
            if (conflictingDates.isNotEmpty()) {
                Spacer(modifier = Modifier.height(10.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(WarningOrange.copy(alpha = 0.15f))
                        .border(1.dp, WarningOrange, RoundedCornerShape(12.dp))
                        .padding(10.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Warning, contentDescription = null, tint = WarningOrange, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "تنبيه تعارض في المواعيد (Conflict Detected)!",
                                color = WarningOrange,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "يوجد أكثر من حفل مؤكد في نفس التاريخ: ${conflictingDates.joinToString(", ")}. يرجى توزيع فرق العمل.",
                                color = TextPrimary,
                                fontSize = 11.sp
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Bookings List
            if (filteredBookings.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.CalendarMonth, contentDescription = null, tint = TextMuted, modifier = Modifier.size(48.dp))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("لا توجد حجوزات مطابقة للبحث", color = TextSecondary, fontSize = 14.sp)
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(filteredBookings) { booking ->
                        BookingItemCard(
                            booking = booking,
                            hasConflict = conflictingDates.contains(booking.eventDate),
                            onCardClick = { selectedBookingForDetails = booking },
                            onConfirm = { viewModel.updateBookingStatus(booking, "CONFIRMED") },
                            onCancel = { viewModel.updateBookingStatus(booking, "CANCELLED") }
                        )
                    }
                    item {
                        Spacer(modifier = Modifier.height(80.dp))
                    }
                }
            }
        }

        // Floating Action Button to Add Booking
        FloatingActionButton(
            onClick = { showNewBookingDialog = true },
            containerColor = PrimaryGold,
            contentColor = BackgroundDark,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(20.dp)
                .testTag("add_booking_fab")
        ) {
            Icon(Icons.Default.Add, contentDescription = "Add Booking")
        }
    }

    // New Booking Dialog
    if (showNewBookingDialog) {
        NewBookingDialog(
            onDismiss = { showNewBookingDialog = false },
            onConfirm = { groom, bride, phone, wilaya, date, time, service, pkg, guests, venue, total, deposit, notes ->
                viewModel.createBooking(
                    groomName = groom,
                    brideName = bride,
                    phone = phone,
                    wilaya = wilaya,
                    eventDate = date,
                    eventTime = time,
                    serviceType = service,
                    packageType = pkg,
                    guestCount = guests,
                    venueName = venue,
                    totalAmount = total,
                    depositAmount = deposit,
                    notes = notes
                )
                showNewBookingDialog = false
            }
        )
    }

    // Booking Details Sheet
    if (selectedBookingForDetails != null) {
        val b = selectedBookingForDetails!!
        AlertDialog(
            onDismissRequest = { selectedBookingForDetails = null },
            confirmButton = {
                Button(
                    onClick = { selectedBookingForDetails = null },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold, contentColor = BackgroundDark)
                ) {
                    Text("إغلاق")
                }
            },
            title = {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(b.bookingNumber, color = PrimaryGold, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    StatusBadge(b.status)
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("العريس: ${b.groomName}", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Text("العروس: ${b.brideName}", color = TextSecondary, fontSize = 13.sp)
                    Text("الهاتف: ${b.phone}", color = TextSecondary, fontSize = 13.sp)
                    Text("التاريخ والتوقيت: ${b.eventDate} الساعة ${b.eventTime}", color = TextPrimary, fontSize = 13.sp)
                    Text("القاعة والموقع: ${b.venueName} (${b.wilaya})", color = TextSecondary, fontSize = 13.sp)
                    Text("الباقة: ${b.packageType}", color = PrimaryGold, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    Text("السعر الإجمالي: ${b.totalAmount.toInt()} د.ج (التسبيق: ${b.depositAmount.toInt()} د.ج)", color = TextPrimary, fontSize = 13.sp)
                    if (b.notes.isNotBlank()) {
                        Text("ملاحظات: ${b.notes}", color = TextMuted, fontSize = 12.sp)
                    }
                }
            },
            containerColor = SurfaceElevated
        )
    }
}

@Composable
private fun BookingItemCard(
    booking: BookingEntity,
    hasConflict: Boolean,
    onCardClick: () -> Unit,
    onConfirm: () -> Unit,
    onCancel: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onCardClick() }
            .border(
                1.dp,
                if (hasConflict) WarningOrange else SurfaceBorder,
                RoundedCornerShape(14.dp)
            ),
        colors = CardDefaults.cardColors(containerColor = SurfaceCard)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = booking.bookingNumber,
                        color = PrimaryGold,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "• ${booking.wilaya}",
                        color = TextMuted,
                        fontSize = 11.sp
                    )
                }
                StatusBadge(booking.status)
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "${booking.groomName} & ${booking.brideName}",
                color = TextPrimary,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(4.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "📅 ${booking.eventDate} (${booking.eventTime})",
                    color = PrimaryGold,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "📍 ${booking.venueName}",
                    color = TextSecondary,
                    fontSize = 12.sp
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "الباقة: ${booking.packageType}",
                    color = TextSecondary,
                    fontSize = 12.sp
                )
                Text(
                    text = "${booking.totalAmount.toInt()} د.ج",
                    color = LightGold,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            val context = LocalContext.current

            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = {
                        val cleanPhone = booking.phone.replace(" ", "").replace("+", "")
                        val text = Uri.encode("السلام عليكم أخي ${booking.groomName}، معك استوديو إبرا برودكشن بخصوص حجز زفافكم بتاريخ ${booking.eventDate}.")
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://wa.me/$cleanPhone?text=$text"))
                        context.startActivity(intent)
                    },
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = SuccessGreen),
                    border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(SuccessGreen.copy(alpha = 0.6f))),
                    modifier = Modifier.weight(1f)
                ) {
                    Text("واتساب العريس", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }

                OutlinedButton(
                    onClick = {
                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${booking.phone}"))
                        context.startActivity(intent)
                    },
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PrimaryGold),
                    border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(PrimaryGold.copy(alpha = 0.6f))),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Call, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("اتصال", fontSize = 11.sp)
                }
            }

            if (booking.status == "PENDING") {
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onConfirm,
                        colors = ButtonDefaults.buttonColors(containerColor = SuccessGreen, contentColor = Color.White),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("تأكيد الحجز", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                    OutlinedButton(
                        onClick = onCancel,
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = DangerRed),
                        border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(DangerRed.copy(alpha = 0.5f))),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("إلغاء", fontSize = 11.sp)
                    }
                }
            }
        }
    }
}

@Composable
private fun NewBookingDialog(
    onDismiss: () -> Unit,
    onConfirm: (
        groom: String,
        bride: String,
        phone: String,
        wilaya: String,
        date: String,
        time: String,
        service: String,
        pkg: String,
        guests: Int,
        venue: String,
        total: Double,
        deposit: Double,
        notes: String
    ) -> Unit
) {
    var groomName by remember { mutableStateOf("") }
    var brideName by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("+213 ") }
    var wilaya by remember { mutableStateOf("16 - الجزائر (Alger)") }
    var date by remember { mutableStateOf("2026-11-28") }
    var time by remember { mutableStateOf("17:00") }
    var pkg by remember { mutableStateOf("Royal VIP Cinema 4K") }
    var venue by remember { mutableStateOf("") }
    var totalPrice by remember { mutableStateOf("180000") }
    var depositPrice by remember { mutableStateOf("50000") }
    var notes by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "حجز حفل زفاف جديد • Nouveau Mariage",
                color = PrimaryGold,
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                item {
                    OutlinedTextField(
                        value = groomName,
                        onValueChange = { groomName = it },
                        label = { Text("اسم العريس (Groom)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = brideName,
                        onValueChange = { brideName = it },
                        label = { Text("اسم العروس (Bride)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text("رقم الهاتف") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = wilaya,
                        onValueChange = { wilaya = it },
                        label = { Text("الولاية (Wilaya)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = date,
                            onValueChange = { date = it },
                            label = { Text("التاريخ (YYYY-MM-DD)") },
                            singleLine = true,
                            modifier = Modifier.weight(1.5f)
                        )
                        OutlinedTextField(
                            value = time,
                            onValueChange = { time = it },
                            label = { Text("التوقيت") },
                            singleLine = true,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
                item {
                    OutlinedTextField(
                        value = venue,
                        onValueChange = { venue = it },
                        label = { Text("قاعة الحفلات أو الفندق") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = pkg,
                        onValueChange = { pkg = it },
                        label = { Text("الباقة المختارة") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = totalPrice,
                            onValueChange = { totalPrice = it },
                            label = { Text("السعر الإجمالي (دج)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            singleLine = true,
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = depositPrice,
                            onValueChange = { depositPrice = it },
                            label = { Text("التسبيق المدفوع") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            singleLine = true,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
                item {
                    OutlinedTextField(
                        value = notes,
                        onValueChange = { notes = it },
                        label = { Text("ملاحظات خاصة ومطالب العريس") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (groomName.isNotBlank()) {
                        onConfirm(
                            groomName,
                            brideName,
                            phone,
                            wilaya,
                            date,
                            time,
                            "تصوير زفاف احترافي",
                            pkg,
                            300,
                            venue,
                            totalPrice.toDoubleOrNull() ?: 150000.0,
                            depositPrice.toDoubleOrNull() ?: 50000.0,
                            notes
                        )
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold, contentColor = BackgroundDark)
            ) {
                Text("تأكيد وحفظ الحجز", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            OutlinedButton(onClick = onDismiss) {
                Text("إلغاء")
            }
        },
        containerColor = SurfaceElevated
    )
}
