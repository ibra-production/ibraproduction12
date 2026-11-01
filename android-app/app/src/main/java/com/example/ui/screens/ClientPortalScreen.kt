package com.example.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
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
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.DirectionsCar
import androidx.compose.material.icons.filled.Flight
import androidx.compose.material.icons.filled.Fingerprint
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Movie
import androidx.compose.material.icons.filled.Paid
import androidx.compose.material.icons.filled.PhotoAlbum
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Usb
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.barcode.Code128Encoder
import com.example.data.model.ClientEntity
import com.example.data.model.UsbDeliveryEntity
import com.example.ui.StudioViewModel
import com.example.barcode.Code128BarcodeView
import com.example.ui.theme.AccentCyan
import com.example.ui.theme.AccentPurple
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.BackgroundSecondary
import com.example.ui.theme.BrandAmber
import com.example.ui.theme.BrandAmberDark
import com.example.ui.theme.DarkGold
import com.example.ui.theme.LightGold
import com.example.ui.theme.PrimaryGold
import com.example.ui.theme.SuccessGreen
import com.example.ui.theme.SuccessGreenContainer
import com.example.ui.theme.SurfaceBorder
import com.example.ui.theme.SurfaceCard
import com.example.ui.theme.SurfaceElevated
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import com.example.ui.theme.WarningOrange
import java.text.NumberFormat
import java.util.Locale

@Composable
fun ClientPortalScreen(
    viewModel: StudioViewModel,
    onRequestAdmin: () -> Unit
) {
    val context = LocalContext.current
    val trackedOrderCode by viewModel.trackedOrderCode.collectAsState()
    val trackedClient by viewModel.trackedClient.collectAsState()
    val trackedUsb by viewModel.trackedUsb.collectAsState()
    val allClients by viewModel.clients.collectAsState()

    var searchInput by remember { mutableStateOf(trackedOrderCode) }

    val currencyFormatter = remember {
        NumberFormat.getNumberInstance(Locale.FRANCE).apply {
            maximumFractionDigits = 0
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 14.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Luxury Top Brand Banner & Hidden Admin Access
        item {
            Spacer(modifier = Modifier.height(10.dp))
            ClientPortalHeader(
                onCallStudio = {
                    val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:0779000833"))
                    context.startActivity(intent)
                },
                onWhatsAppStudio = {
                    val intent = Intent(
                        Intent.ACTION_VIEW,
                        Uri.parse("https://wa.me/213779000833?text=${Uri.encode("مرحباً استوديو IBRA PRODUCTION، أرغب في الاستفسار عن تفاصيل طلبي")}")
                    )
                    context.startActivity(intent)
                },
                onRequestAdmin = onRequestAdmin
            )
        }

        // Search & Tracking Input Card
        item {
            OrderTrackingInputCard(
                orderInput = searchInput,
                onInputChange = { searchInput = it },
                onSearch = {
                    viewModel.searchAndTrackOrder(searchInput)
                },
                quickClients = allClients.take(5),
                selectedCode = trackedClient?.clientCode ?: trackedOrderCode,
                onSelectQuickClient = { client ->
                    searchInput = client.clientCode
                    viewModel.selectTrackedClient(client)
                }
            )
        }

        if (trackedClient != null) {
            val client = trackedClient!!

            // Hero Wedding Progress Card
            item {
                WeddingHeroProgressCard(
                    client = client,
                    currencyFormatter = currencyFormatter,
                    onWhatsAppGroom = {
                        val text = "تهانينا للعروسين ${client.groomName} & ${client.brideName}! نتابع تجهيز مشروع زفافكم الفاخر مع IBRA PRODUCTION."
                        val intent = Intent(
                            Intent.ACTION_VIEW,
                            Uri.parse("https://wa.me/213779000833?text=${Uri.encode(text)}")
                        )
                        context.startActivity(intent)
                    }
                )
            }

            // 7-Stage Live Production Pipeline
            item {
                WeddingProductionPipelineCard(client = client)
            }

            // Contracted Services & Package Breakdown
            item {
                ContractedPackageCard(client = client)
            }

            // Financial Transparency Card
            item {
                FinancialTransparencyCard(
                    client = client,
                    currencyFormatter = currencyFormatter
                )
            }

            // Delivery Package Checklist (USB, Italian Album, VIP Box)
            item {
                DeliveryBoxContentsCard(
                    client = client,
                    usbDelivery = trackedUsb
                )
            }

            // Assigned Creative Crew for this Wedding
            item {
                AssignedWeddingCrewCard(
                    client = client,
                    onContactCrew = { phone ->
                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone"))
                        context.startActivity(intent)
                    }
                )
            }

            // Digital Barcode Verification Card
            item {
                DigitalBarcodePickupCard(client = client)
            }

            // Direct Studio Concierge Assistance
            item {
                StudioConciergeSupportCard(
                    clientCode = client.clientCode,
                    onCall = {
                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:0779000833"))
                        context.startActivity(intent)
                    },
                    onWhatsApp = {
                        val msg = "مرحباً استوديو IBRA PRODUCTION، بخصوص طلبي رقم (${client.clientCode})، أود التواصل معكم."
                        val intent = Intent(
                            Intent.ACTION_VIEW,
                            Uri.parse("https://wa.me/213779000833?text=${Uri.encode(msg)}")
                        )
                        context.startActivity(intent)
                    }
                )
            }
        } else {
            // Empty / Order not found state
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = SurfaceCard),
                    shape = RoundedCornerShape(20.dp),
                    border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(SurfaceBorder, PrimaryGold.copy(alpha = 0.3f)))),
                    modifier = Modifier.fillMaxWidth().padding(vertical = 24.dp)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth().padding(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = null,
                            tint = PrimaryGold,
                            modifier = Modifier.size(54.dp)
                        )
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = "تتبع حفل زفافك مع IBRA PRODUCTION",
                            color = TextPrimary,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "يرجى إدخال رقم الطلب الخاص بك (مثل IBR-2026-0001) أو الضغط على أحد الأمثلة السريعة أعلاه لمتابعة المونتاج وموعد التسليم.",
                            color = TextSecondary,
                            fontSize = 13.sp,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}

@Composable
fun ClientPortalHeader(
    onCallStudio: () -> Unit,
    onWhatsAppStudio: () -> Unit,
    onRequestAdmin: () -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        shape = RoundedCornerShape(24.dp),
        border = CardDefaults.outlinedCardBorder().copy(
            brush = Brush.linearGradient(
                listOf(BrandAmber, PrimaryGold.copy(alpha = 0.4f), SurfaceBorder)
            )
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                // Official Brand Logo & Identity
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .size(52.dp)
                            .clip(CircleShape)
                            .background(BrandAmberDark)
                            .border(1.5.dp, PrimaryGold, CircleShape)
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.ibra_logo),
                            contentDescription = "IBRA Logo",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "IBRA PRODUCTION",
                            color = PrimaryGold,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.ExtraBold,
                            fontFamily = FontFamily.Serif
                        )
                        Text(
                            text = "بوابة العريس ومتابعة الحفل",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )
                    }
                }

                // Hidden Executive Admin Access (Biometric Protected)
                Button(
                    onClick = onRequestAdmin,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrimaryGold.copy(alpha = 0.15f)
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .border(1.dp, PrimaryGold.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                        .testTag("admin_access_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Fingerprint,
                        contentDescription = "دخول الإدارة",
                        tint = PrimaryGold,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "دخول الإدارة 🔒",
                        color = LightGold,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Studio Hotline & Instant Chat Action
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Button(
                    onClick = onWhatsAppStudio,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = SuccessGreen.copy(alpha = 0.2f)
                    ),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .weight(1f)
                        .border(1.dp, SuccessGreen.copy(alpha = 0.4f), RoundedCornerShape(10.dp))
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.Chat,
                        contentDescription = "WhatsApp",
                        tint = SuccessGreen,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "واتساب الاستوديو",
                        color = SuccessGreen,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Button(
                    onClick = onCallStudio,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrimaryGold.copy(alpha = 0.2f)
                    ),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .weight(1f)
                        .border(1.dp, PrimaryGold.copy(alpha = 0.4f), RoundedCornerShape(10.dp))
                ) {
                    Icon(
                        imageVector = Icons.Default.Call,
                        contentDescription = "اتصال",
                        tint = PrimaryGold,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "0779000833",
                        color = LightGold,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
fun OrderTrackingInputCard(
    orderInput: String,
    onInputChange: (String) -> Unit,
    onSearch: () -> Unit,
    quickClients: List<ClientEntity>,
    selectedCode: String,
    onSelectQuickClient: (ClientEntity) -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        shape = RoundedCornerShape(20.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(SurfaceBorder, PrimaryGold.copy(alpha = 0.2f)))),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
            Text(
                text = "متابعة الحفل برقم الطلب (Order Tracking)",
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "أدخل رقم العقد، كود الباركود، أو رقم هاتفك لمعاينة كل تفاصيل عرسك المباشرة",
                color = TextSecondary,
                fontSize = 11.sp,
                modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
            )

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                OutlinedTextField(
                    value = orderInput,
                    onValueChange = onInputChange,
                    placeholder = {
                        Text("مثال: IBR-2026-0001 أو 0550123456", color = TextMuted, fontSize = 12.sp)
                    },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                    keyboardActions = KeyboardActions(onSearch = { onSearch() }),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryGold,
                        unfocusedBorderColor = SurfaceBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f).testTag("order_search_input")
                )

                Button(
                    onClick = onSearch,
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.height(52.dp).testTag("order_search_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "بحث",
                        tint = BackgroundDark,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "متابعة",
                        color = BackgroundDark,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Quick Samples Chips
            Text(
                text = "أو اختر عينة للعرض الفوري:",
                color = TextMuted,
                fontSize = 11.sp,
                modifier = Modifier.padding(bottom = 6.dp)
            )

            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(quickClients) { client ->
                    val isSelected = client.clientCode == selectedCode
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) PrimaryGold.copy(alpha = 0.25f) else SurfaceElevated)
                            .border(1.dp, if (isSelected) PrimaryGold else SurfaceBorder, RoundedCornerShape(10.dp))
                            .clickable { onSelectQuickClient(client) }
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "💍 ${client.groomName.take(14)}...",
                            color = if (isSelected) LightGold else TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "(${client.clientCode})",
                            color = if (isSelected) PrimaryGold else TextMuted,
                            fontSize = 9.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun WeddingHeroProgressCard(
    client: ClientEntity,
    currencyFormatter: NumberFormat,
    onWhatsAppGroom: () -> Unit
) {
    val progress = when (client.projectStatus) {
        "PENDING" -> 0.15f
        "CONFIRMED" -> 0.30f
        "IN_PRODUCTION" -> 0.55f
        "EDITING" -> 0.75f
        "DELIVERED" -> 1.0f
        else -> 0.40f
    }

    val statusText = when (client.projectStatus) {
        "PENDING" -> "قيد مراجعة وتأكيد الحجز"
        "CONFIRMED" -> "الحجز مؤكد - قيد التجهيز الميداني"
        "IN_PRODUCTION" -> "تم تصوير الحفل - مرحلة فرز الميديا"
        "EDITING" -> "في مرحلة المونتاج السينمائي 4K وتصحيح الألوان"
        "DELIVERED" -> "مشروع الزفاف مكتمل وتم التسليم بنجاح"
        else -> client.projectStatus
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        shape = RoundedCornerShape(24.dp),
        border = CardDefaults.outlinedCardBorder().copy(
            brush = Brush.linearGradient(
                listOf(PrimaryGold.copy(alpha = 0.6f), BrandAmber, SurfaceBorder)
            )
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(18.dp)) {
            // Top Barcode Code & Status Pill
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(PrimaryGold.copy(alpha = 0.15f))
                        .border(1.dp, PrimaryGold.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.QrCode,
                        contentDescription = null,
                        tint = PrimaryGold,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = client.clientCode,
                        color = LightGold,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(SuccessGreen.copy(alpha = 0.15f))
                        .border(1.dp, SuccessGreen.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(SuccessGreen))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = client.packageName,
                        color = SuccessGreen,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Names Header
            Text(
                text = "حفل زفاف العروسين:",
                color = TextSecondary,
                fontSize = 12.sp
            )
            Text(
                text = "${client.groomName}  ❤️  ${client.brideName}",
                color = TextPrimary,
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold,
                modifier = Modifier.padding(vertical = 4.dp)
            )

            // Location and Date
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(top = 4.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.DateRange,
                    contentDescription = null,
                    tint = PrimaryGold,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "تاريخ الحفل: ${client.eventDate}",
                    color = LightGold,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }

            if (client.address.isNotBlank()) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(top = 4.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = null,
                        tint = TextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "${client.address} (${client.wilayaName})",
                        color = TextSecondary,
                        fontSize = 12.sp
                    )
                }
            }

            if (client.eventDatesJson.isNotBlank()) {
                Text(
                    text = "📅 ${client.eventDatesJson}",
                    color = AccentCyan,
                    fontSize = 11.sp,
                    modifier = Modifier.padding(top = 6.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Progress Bar & Percentage
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(SurfaceElevated)
                    .border(1.dp, SurfaceBorder, RoundedCornerShape(14.dp))
                    .padding(14.dp)
            ) {
                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Speed,
                            contentDescription = null,
                            tint = PrimaryGold,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "نسبة إنجاز المشروع وتجهيز الفلاشة:",
                            color = TextPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    Text(
                        text = "${(progress * 100).toInt()}%",
                        color = PrimaryGold,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                LinearProgressIndicator(
                    progress = { progress },
                    color = PrimaryGold,
                    trackColor = BackgroundDark,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "الحالة الحالية: $statusText",
                    color = AccentCyan,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

@Composable
fun WeddingProductionPipelineCard(client: ClientEntity) {
    val currentProgress = when (client.projectStatus) {
        "PENDING" -> 1
        "CONFIRMED" -> 2
        "IN_PRODUCTION" -> 3
        "EDITING" -> 5
        "DELIVERED" -> 7
        else -> 3
    }

    val stages = listOf(
        Triple("تأكيد الحجز وتوقيع العقد الرسمي", "تم استلام العربون وتثبيت الموعد في الأجندة", 1),
        Triple("تجهيز الطاقم وتخطيط لقطات الدرون", "اجتماع فريق التصوير وتوزيع كاميرات 4K", 2),
        Triple("تغطية يوم الحفل والموكب الحي", "تصوير القاعة، موكب السيارات، وجلسة الحديقة", 3),
        Triple("سحب وتأمين الميديا والنسخ الاحتياطي", "نسخ آمن مزدوج على أقراص SSD والسحابة", 4),
        Triple("المونتاج السينمائي وهندسة الصوت", "تقطيع اللقطات، المؤثرات، وتصحيح الألوان", 5),
        Triple("طباعة وتغليف الألبوم الإيطالي الفاخر", "ألبوم 30x60 سم جلد طبيعي إيطالي أصلي", 6),
        Triple("جاهز للتسليم في علبة VIP الكريستالية", "فلاشة USB 3.2 128GB + الألبوم جاهزة للاستلام", 7)
    )

    Card(
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        shape = RoundedCornerShape(20.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(SurfaceBorder, PrimaryGold.copy(alpha = 0.3f)))),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(18.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.Movie,
                    contentDescription = null,
                    tint = PrimaryGold,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "خارطة إنجاز حفل الزفاف (Live Pipeline)",
                    color = TextPrimary,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            stages.forEachIndexed { index, (title, subtitle, stageNum) ->
                val isCompleted = stageNum < currentProgress
                val isCurrent = stageNum == currentProgress
                val isUpcoming = stageNum > currentProgress

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.Top
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.width(32.dp)
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(26.dp)
                                .clip(CircleShape)
                                .background(
                                    when {
                                        isCompleted -> SuccessGreen
                                        isCurrent -> PrimaryGold
                                        else -> SurfaceElevated
                                    }
                                )
                                .border(
                                    1.dp,
                                    when {
                                        isCompleted -> SuccessGreen
                                        isCurrent -> LightGold
                                        else -> SurfaceBorder
                                    },
                                    CircleShape
                                )
                        ) {
                            if (isCompleted) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = null,
                                    tint = BackgroundDark,
                                    modifier = Modifier.size(16.dp)
                                )
                            } else {
                                Text(
                                    text = "$stageNum",
                                    color = if (isCurrent) BackgroundDark else TextMuted,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        if (index < stages.size - 1) {
                            Box(
                                modifier = Modifier
                                    .width(2.dp)
                                    .height(38.dp)
                                    .background(
                                        if (isCompleted) SuccessGreen.copy(alpha = 0.5f) else SurfaceBorder
                                    )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .padding(bottom = if (index < stages.size - 1) 14.dp else 0.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = title,
                                color = when {
                                    isCompleted -> TextPrimary
                                    isCurrent -> LightGold
                                    else -> TextSecondary
                                },
                                fontSize = 13.sp,
                                fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.SemiBold
                            )

                            if (isCurrent) {
                                Text(
                                    text = "جاري العمل الآن",
                                    color = PrimaryGold,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(PrimaryGold.copy(alpha = 0.15f))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            } else if (isCompleted) {
                                Text(
                                    text = "مكتمل ✓",
                                    color = SuccessGreen,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Text(
                            text = subtitle,
                            color = TextMuted,
                            fontSize = 11.sp,
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ContractedPackageCard(client: ClientEntity) {
    Card(
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        shape = RoundedCornerShape(20.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(SurfaceBorder, PrimaryGold.copy(alpha = 0.25f)))),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(18.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = null,
                    tint = PrimaryGold,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "تفاصيل باقة التصوير المتفق عليها",
                    color = TextPrimary,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            val servicesList = listOf(
                "🎥 مصوران سينمائيان بدقة 4K Cinema بكاميرات Sony FX3 الاحترافية",
                "🚁 تغطية جوية بطائرة درون DJI 4K مرخصة لجلسة الحديقة والموكب",
                "📸 مصور فوتوغرافي متخصص لالتقاط لقطات العروسين العفوية والرسمية",
                "📖 ألبوم إيطالي فاخر 30x60 سم جلد طبيعي أصلي بتصميم خاص",
                "💎 فلاشة كريستال USB 3.2 128GB في علبة خشبية فاخرة محفورة بالاسم",
                "🎬 فيلم زفاف كامل مدة ساعتين بجودة سينمائية وهندسة صوتية استوديو",
                "📱 فيديو ريلز 60 ثانية ممنتج خصيصاً لمشاركته على إنستغرام وتيك توك",
                "👥 ألبومان مصغران إضافيان إهداء خاص لأولياء العروسين"
            )

            servicesList.forEach { item ->
                Row(
                    modifier = Modifier.padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = PrimaryGold,
                        modifier = Modifier.size(15.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = item,
                        color = TextSecondary,
                        fontSize = 12.sp
                    )
                }
            }
        }
    }
}

@Composable
fun FinancialTransparencyCard(
    client: ClientEntity,
    currencyFormatter: NumberFormat
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        shape = RoundedCornerShape(20.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(SurfaceBorder, SuccessGreen.copy(alpha = 0.3f)))),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(18.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Paid,
                        contentDescription = null,
                        tint = SuccessGreen,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "الوضعية المالية للمشروع (Financial Transparency)",
                        color = TextPrimary,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Text(
                    text = if (client.remainingBalance <= 0) "خالص بالكامل ✓" else "متبقي دفعة",
                    color = if (client.remainingBalance <= 0) SuccessGreen else WarningOrange,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(
                            if (client.remainingBalance <= 0) SuccessGreen.copy(alpha = 0.15f)
                            else WarningOrange.copy(alpha = 0.15f)
                        )
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(SurfaceElevated)
                        .padding(10.dp)
                ) {
                    Text("السعر الإجمالي للعقد", color = TextMuted, fontSize = 10.sp)
                    Text(
                        "${currencyFormatter.format(client.totalPrice)} د.ج",
                        color = TextPrimary,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(SurfaceElevated)
                        .padding(10.dp)
                ) {
                    Text("المبلغ المدفوع", color = TextMuted, fontSize = 10.sp)
                    Text(
                        "${currencyFormatter.format(client.paidAmount)} د.ج",
                        color = SuccessGreen,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(SurfaceElevated)
                        .padding(10.dp)
                ) {
                    Text("المتبقي عند الاستلام", color = TextMuted, fontSize = 10.sp)
                    Text(
                        "${currencyFormatter.format(client.remainingBalance)} د.ج",
                        color = if (client.remainingBalance > 0) WarningOrange else SuccessGreen,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
fun DeliveryBoxContentsCard(
    client: ClientEntity,
    usbDelivery: UsbDeliveryEntity?
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        shape = RoundedCornerShape(20.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(SurfaceBorder, AccentCyan.copy(alpha = 0.3f)))),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(18.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.Inventory2,
                    contentDescription = null,
                    tint = AccentCyan,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "محتويات باقة التسليم الفاخرة (VIP Delivery Box)",
                    color = TextPrimary,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            val items = listOf(
                Pair("فلاشة كريستال SanDisk 3.2 (128 GB)", "تحتوي الفيلم الكامل 4K + جميع الصور الأصلية المعدلة"),
                Pair("ألبوم إيطالي فاخر 30x60 سم", "جلد طبيعي مختار مع طباعة حرارية مقاومة للرطوبة والزمن"),
                Pair("علبة خشبية منقوشة بالذهب باسم العروسين", "محفورة بالليزر مع بطانة مخملية لحماية الفلاشة والألبوم"),
                Pair("فيديو ريلز عمودي 60 ثانية", "جاهز ومحسن للنشر الفوري بجودة فائقة"),
                Pair("نسخة العقد والفاتورة الموثقة", "ضمان حفظ الميديا والأرشيف في سحابة الاستوديو لمدة 5 سنوات")
            )

            items.forEach { (name, desc) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 5.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Icon(
                        imageVector = Icons.Default.Usb,
                        contentDescription = null,
                        tint = AccentCyan,
                        modifier = Modifier.size(16.dp).padding(top = 2.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(text = name, color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        Text(text = desc, color = TextMuted, fontSize = 10.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun AssignedWeddingCrewCard(
    client: ClientEntity,
    onContactCrew: (String) -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        shape = RoundedCornerShape(20.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(SurfaceBorder, PrimaryGold.copy(alpha = 0.2f)))),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(18.dp)) {
            Text(
                text = "فريق الإخراج والتصوير المخصص لحفلكم:",
                color = TextPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(12.dp))

            val team = listOf(
                Triple("إبراهيم (Studio Director)", "المشرف العام ومخرج الحفل", "0779000833"),
                Triple("كريم سعيدي", "المصور السينمائي الرئيسي (Sony FX3)", "0550112233"),
                Triple("حمزة منصوري", "طيار الدرون المعتمد (DJI Inspire)", "0661223344"),
                Triple("ياسين بن عمارة", "كبير مهندسي المونتاج وتصحيح الألوان", "0771334455")
            )

            team.forEach { (name, role, phone) ->
                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 5.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(SurfaceElevated)
                        .padding(horizontal = 10.dp, vertical = 8.dp)
                ) {
                    Column {
                        Text(name, color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        Text(role, color = TextMuted, fontSize = 10.sp)
                    }

                    IconButton(
                        onClick = { onContactCrew(phone) },
                        modifier = Modifier.size(34.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Call,
                            contentDescription = "اتصال",
                            tint = PrimaryGold,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun DigitalBarcodePickupCard(client: ClientEntity) {
    Card(
        colors = CardDefaults.cardColors(containerColor = SurfaceCard),
        shape = RoundedCornerShape(20.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(SurfaceBorder, PrimaryGold.copy(alpha = 0.3f)))),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth().padding(20.dp)
        ) {
            Text(
                text = "بطاقة التحقق الرقمية للاستلام بالاستوديو",
                color = TextPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "أظهر هذا الباركود عند حضورك لاستلام علبة الفلاشة والألبوم الفاخر",
                color = TextSecondary,
                fontSize = 11.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 2.dp, bottom = 14.dp)
            )

            // Render Real Code 128 Barcode Label
            Code128BarcodeView(
                barcodeText = client.clientCode,
                groomName = client.groomName,
                wilaya = client.wilayaName
            )

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = client.clientCode,
                color = LightGold,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

@Composable
fun StudioConciergeSupportCard(
    clientCode: String,
    onCall: () -> Unit,
    onWhatsApp: () -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = BackgroundSecondary),
        shape = RoundedCornerShape(20.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(BrandAmber, PrimaryGold.copy(alpha = 0.4f)))),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(18.dp)) {
            Text(
                text = "هل تحتاج إلى مساعدة أو تعديل على المونتاج؟",
                color = TextPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "فريق خدمة زبائن IBRA PRODUCTION متواجد للإجابة على جميع استفساراتكم مباشرة.",
                color = TextSecondary,
                fontSize = 11.sp,
                modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
            )

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Button(
                    onClick = onWhatsApp,
                    colors = ButtonDefaults.buttonColors(containerColor = SuccessGreen),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.Chat,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("محادثة واتساب", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Button(
                    onClick = onCall,
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(
                        imageVector = Icons.Default.Call,
                        contentDescription = null,
                        tint = BackgroundDark,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("اتصال 0779000833", color = BackgroundDark, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
