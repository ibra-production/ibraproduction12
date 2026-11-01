package com.example.ui.screens

import android.content.Intent
import android.net.Uri
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Usb
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.barcode.Code128BarcodeView
import com.example.data.model.ClientEntity
import com.example.ui.StudioViewModel
import com.example.ui.components.ALGERIAN_WILAYAS
import com.example.ui.components.StatusBadge
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.DangerRed
import com.example.ui.theme.GoldSecondary
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

@Composable
fun CrmScreen(viewModel: StudioViewModel) {
    val clients by viewModel.clients.collectAsState()
    val context = LocalContext.current

    var searchQuery by remember { mutableStateOf("") }
    var showAddDialog by remember { mutableStateOf(false) }
    var selectedClientForProfile by remember { mutableStateOf<ClientEntity?>(null) }
    var clientForBarcodeLabel by remember { mutableStateOf<ClientEntity?>(null) }

    val filteredClients = remember(clients, searchQuery) {
        if (searchQuery.isBlank()) clients
        else {
            clients.filter { c ->
                c.groomName.contains(searchQuery, ignoreCase = true) ||
                        c.brideName.contains(searchQuery, ignoreCase = true) ||
                        c.phone.contains(searchQuery, ignoreCase = true) ||
                        c.clientCode.contains(searchQuery, ignoreCase = true) ||
                        c.wilayaName.contains(searchQuery, ignoreCase = true)
            }
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
                placeholder = { Text("بحث باسم العريس، الهاتف، أو كود IBR...", color = TextMuted, fontSize = 13.sp) },
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
                    .testTag("crm_search_input")
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Client count & statistics header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "سجل العرسان والزبائن (${filteredClients.size})",
                    color = TextPrimary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "باركود Code 128 مشفر تلقائياً",
                    color = PrimaryGold,
                    fontSize = 11.sp
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            if (filteredClients.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.Person, contentDescription = null, tint = TextMuted, modifier = Modifier.size(48.dp))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("لا يوجد زبائن مطابقين للبحث", color = TextSecondary, fontSize = 14.sp)
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(filteredClients) { client ->
                        ClientItemCard(
                            client = client,
                            onCardClick = { selectedClientForProfile = client },
                            onShowBarcode = { clientForBarcodeLabel = client },
                            onCall = {
                                val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${client.phone}"))
                                context.startActivity(intent)
                            }
                        )
                    }
                    item {
                        Spacer(modifier = Modifier.height(80.dp))
                    }
                }
            }
        }

        // Add New Client Floating Action Button
        FloatingActionButton(
            onClick = { showAddDialog = true },
            containerColor = PrimaryGold,
            contentColor = BackgroundDark,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(20.dp)
                .testTag("add_client_fab")
        ) {
            Icon(Icons.Default.Add, contentDescription = "Add Client")
        }
    }

    // Add Client Dialog
    if (showAddDialog) {
        AddClientDialog(
            onDismiss = { showAddDialog = false },
            onConfirm = { groom, bride, phone, wilayaNum, wilayaName, date, pkg, total, deposit, notes ->
                viewModel.createClient(
                    groomName = groom,
                    brideName = bride,
                    phone = phone,
                    wilayaNumber = wilayaNum,
                    wilayaName = wilayaName,
                    eventDate = date,
                    packageName = pkg,
                    totalPrice = total,
                    depositAmount = deposit,
                    notes = notes
                )
                showAddDialog = false
            }
        )
    }

    // Client Profile Detail Dialog
    if (selectedClientForProfile != null) {
        val c = selectedClientForProfile!!
        AlertDialog(
            onDismissRequest = { selectedClientForProfile = null },
            confirmButton = {
                Button(
                    onClick = { selectedClientForProfile = null },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold, contentColor = BackgroundDark)
                ) {
                    Text("إغلاق الملف")
                }
            },
            title = {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(c.groomName, color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        Text(c.clientCode, color = PrimaryGold, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    }
                    StatusBadge(c.projectStatus)
                }
            },
            text = {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    item {
                        Text("💍 العروس: ${c.brideName}", color = TextSecondary, fontSize = 13.sp)
                        Text("📞 الهاتف: ${c.phone}", color = TextSecondary, fontSize = 13.sp)
                        Text("📍 الولاية والعنوان: ${c.wilayaName} • ${c.address}", color = TextSecondary, fontSize = 13.sp)
                        Text("📅 تاريخ العرس: ${c.eventDate}", color = PrimaryGold, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        if (c.eventDatesJson.isNotBlank()) {
                            Text("🗓 مواعيد إضافية: ${c.eventDatesJson}", color = TextMuted, fontSize = 12.sp)
                        }
                    }

                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(SurfaceCard, RoundedCornerShape(10.dp))
                                .border(1.dp, SurfaceBorder, RoundedCornerShape(10.dp))
                                .padding(10.dp)
                        ) {
                            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text("📄 رقم العقد: ${c.contractNumber}", color = TextPrimary, fontSize = 12.sp)
                                Text("🎁 الباقة: ${c.packageName}", color = LightGold, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Text("💾 فلاشة USB: ${c.usbSerial} (${c.deliveryStatus})", color = TextSecondary, fontSize = 12.sp)
                            }
                        }
                    }

                    item {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("المبلغ الإجمالي: ${c.totalPrice.toInt()} د.ج", color = TextSecondary, fontSize = 12.sp)
                                Text("المدفوع: ${c.paidAmount.toInt()} د.ج", color = SuccessGreen, fontSize = 12.sp)
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            val progress = if (c.totalPrice > 0) (c.paidAmount / c.totalPrice).toFloat().coerceIn(0f, 1f) else 0f
                            LinearProgressIndicator(
                                progress = { progress },
                                color = PrimaryGold,
                                trackColor = SurfaceBorder,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(6.dp)
                                    .clip(RoundedCornerShape(3.dp))
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                if (c.remainingBalance <= 0) "خالص بالكامل (0 د.ج)" else "المتبقي للدفع: ${c.remainingBalance.toInt()} د.ج",
                                color = if (c.remainingBalance <= 0) SuccessGreen else DangerRed,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    if (c.notes.isNotBlank()) {
                        item {
                            Text("ملاحظات: ${c.notes}", color = TextMuted, fontSize = 12.sp)
                        }
                    }

                    item {
                        Button(
                            onClick = {
                                clientForBarcodeLabel = c
                                selectedClientForProfile = null
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = SurfaceCard, contentColor = PrimaryGold),
                            border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(PrimaryGold)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.QrCode, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("عرض وطباعة ملصق الباركود Code 128")
                        }
                    }
                }
            },
            containerColor = SurfaceElevated
        )
    }

    // Barcode Label Viewer Dialog
    if (clientForBarcodeLabel != null) {
        val c = clientForBarcodeLabel!!
        AlertDialog(
            onDismissRequest = { clientForBarcodeLabel = null },
            confirmButton = {
                Button(
                    onClick = { clientForBarcodeLabel = null },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold, contentColor = BackgroundDark)
                ) {
                    Text("تم")
                }
            },
            title = {
                Text("ملصق الباركود الرسمي للعريس", color = PrimaryGold, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            },
            text = {
                Code128BarcodeView(
                    barcodeText = c.clientCode,
                    groomName = c.groomName,
                    wilaya = c.wilayaName,
                    showActions = true
                )
            },
            containerColor = SurfaceElevated
        )
    }
}

@Composable
private fun ClientItemCard(
    client: ClientEntity,
    onCardClick: () -> Unit,
    onShowBarcode: () -> Unit,
    onCall: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onCardClick() }
            .border(1.dp, SurfaceBorder, RoundedCornerShape(14.dp)),
        colors = CardDefaults.cardColors(containerColor = SurfaceCard)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .background(PrimaryGold.copy(alpha = 0.15f), RoundedCornerShape(6.dp))
                            .border(0.5.dp, PrimaryGold.copy(alpha = 0.4f), RoundedCornerShape(6.dp))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = client.clientCode,
                            color = PrimaryGold,
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = client.wilayaName.substringBefore(" ("),
                        color = TextSecondary,
                        fontSize = 11.sp
                    )
                }
                StatusBadge(client.projectStatus)
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "${client.groomName} & ${client.brideName}",
                color = TextPrimary,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "باقة: ${client.packageName} • موعد العرس: ${client.eventDate}",
                color = TextSecondary,
                fontSize = 12.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Payment progress bar
            val progress = if (client.totalPrice > 0) (client.paidAmount / client.totalPrice).toFloat().coerceIn(0f, 1f) else 0f
            LinearProgressIndicator(
                progress = { progress },
                color = if (client.remainingBalance <= 0) SuccessGreen else PrimaryGold,
                trackColor = SurfaceBorder,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .clip(RoundedCornerShape(2.dp))
            )

            Spacer(modifier = Modifier.height(6.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (client.remainingBalance <= 0) "خالص بالكامل" else "متبقي: ${client.remainingBalance.toInt()} د.ج",
                    color = if (client.remainingBalance <= 0) SuccessGreen else DangerRed,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(onClick = onShowBarcode, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.QrCode, contentDescription = "Barcode", tint = PrimaryGold, modifier = Modifier.size(18.dp))
                    }
                    IconButton(onClick = onCall, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Call, contentDescription = "Call", tint = SuccessGreen, modifier = Modifier.size(18.dp))
                    }
                }
            }
        }
    }
}

@Composable
private fun AddClientDialog(
    onDismiss: () -> Unit,
    onConfirm: (
        groom: String,
        bride: String,
        phone: String,
        wilayaNum: Int,
        wilayaName: String,
        date: String,
        pkg: String,
        total: Double,
        deposit: Double,
        notes: String
    ) -> Unit
) {
    var groomName by remember { mutableStateOf("") }
    var brideName by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("+213 ") }
    var selectedWilaya by remember { mutableStateOf(ALGERIAN_WILAYAS[0]) }
    var eventDate by remember { mutableStateOf("2026-11-20") }
    var packageName by remember { mutableStateOf("Royal VIP Cinema 4K") }
    var totalPrice by remember { mutableStateOf("200000") }
    var depositAmount by remember { mutableStateOf("70000") }
    var notes by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text("إضافة عريس وملف زبون جديد", color = PrimaryGold, fontSize = 17.sp, fontWeight = FontWeight.Bold)
        },
        text = {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                item {
                    OutlinedTextField(
                        value = groomName,
                        onValueChange = { groomName = it },
                        label = { Text("اسم العريس الكامل") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = brideName,
                        onValueChange = { brideName = it },
                        label = { Text("اسم العروس") },
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
                        value = selectedWilaya,
                        onValueChange = { selectedWilaya = it },
                        label = { Text("الولاية") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = eventDate,
                        onValueChange = { eventDate = it },
                        label = { Text("تاريخ حفل الزفاف (YYYY-MM-DD)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                item {
                    OutlinedTextField(
                        value = packageName,
                        onValueChange = { packageName = it },
                        label = { Text("الباقة") },
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
                            value = depositAmount,
                            onValueChange = { depositAmount = it },
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
                        label = { Text("ملاحظات") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (groomName.isNotBlank()) {
                        val wilayaNum = selectedWilaya.take(2).toIntOrNull() ?: 16
                        onConfirm(
                            groomName,
                            brideName,
                            phone,
                            wilayaNum,
                            selectedWilaya,
                            eventDate,
                            packageName,
                            totalPrice.toDoubleOrNull() ?: 180000.0,
                            depositAmount.toDoubleOrNull() ?: 50000.0,
                            notes
                        )
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold, contentColor = BackgroundDark)
            ) {
                Text("إصدار الباركود وحفظ العريس", fontWeight = FontWeight.Bold)
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
