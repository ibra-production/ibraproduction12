package com.example.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.barcode.Code128BarcodeView
import com.example.data.firebase.*
import com.example.ui.theme.*
import kotlinx.coroutines.launch

// =========================================================================
// 1. HOME SCREEN (الرئيسية)
// =========================================================================

@Composable
fun CustomerHomeScreen(
    offers: List<StudioOffer>,
    portfolio: List<StudioPortfolioItem>,
    onNavigateToBooking: () -> Unit,
    onNavigateToServices: () -> Unit,
    onNavigateToPortfolio: () -> Unit,
    onNavigateToTracking: () -> Unit
) {
    val context = LocalContext.current

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        item { Spacer(modifier = Modifier.height(10.dp)) }

        // Top Cinematic Hero Card
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                Color(0xFF1E170A),
                                Color(0xFF121217),
                                Color(0xFF0A0A0E)
                            )
                        )
                    )
                    .border(1.dp, PrimaryGold.copy(alpha = 0.4f), RoundedCornerShape(24.dp))
                    .padding(20.dp)
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(PrimaryGold)
                        )
                        Text(
                            text = "استوديو إبرا للإنتاج السينمائي الفاخر",
                            color = PrimaryGold,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "توثيق سينمائي ملكي لأجمل لحظات العمر",
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Black,
                        lineHeight = 28.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "طاقم تصوير محترف بأحدث كاميرات السينما والدرون 4K في الجزائر. احجز موعد زفافك مباشرة مع الاستوديو.",
                        color = TextSecondary,
                        fontSize = 13.sp,
                        lineHeight = 20.sp
                    )

                    Spacer(modifier = Modifier.height(18.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = onNavigateToBooking,
                            colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(
                                Icons.Default.Event,
                                contentDescription = null,
                                tint = Color.Black,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("احجز موعدك الآن", color = Color.Black, fontWeight = FontWeight.Black)
                        }

                        OutlinedButton(
                            onClick = onNavigateToTracking,
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = LightGold),
                            border = ButtonDefaults.outlinedButtonBorder.copy(
                                brush = Brush.linearGradient(listOf(PrimaryGold, Color(0xFF8C7330)))
                            ),
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Icon(Icons.Default.QrCode, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("تتبع حجزي", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Active Promotions / Offers from Firestore
        if (offers.isNotEmpty()) {
            item {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Icon(Icons.Default.LocalOffer, contentDescription = null, tint = PrimaryGold, modifier = Modifier.size(20.dp))
                            Text(
                                text = "العروض والتخفيضات الحالية",
                                color = Color.White,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Text(
                            text = "${offers.size} عروض متاحة",
                            color = PrimaryGold,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        contentPadding = PaddingValues(vertical = 4.dp)
                    ) {
                        items(offers) { offer ->
                            Card(
                                modifier = Modifier
                                    .width(260.dp)
                                    .clip(RoundedCornerShape(18.dp))
                                    .border(1.dp, SurfaceBorder, RoundedCornerShape(18.dp)),
                                colors = CardDefaults.cardColors(containerColor = SurfaceCard)
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    if (offer.badgeAr.isNotEmpty()) {
                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(8.dp))
                                                .background(PrimaryGold.copy(alpha = 0.2f))
                                                .padding(horizontal = 8.dp, vertical = 4.dp)
                                        ) {
                                            Text(offer.badgeAr, color = PrimaryGold, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        }
                                        Spacer(modifier = Modifier.height(6.dp))
                                    }

                                    Text(
                                        text = offer.titleAr,
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 15.sp,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )

                                    Spacer(modifier = Modifier.height(4.dp))

                                    Text(
                                        text = offer.descriptionAr,
                                        color = TextSecondary,
                                        fontSize = 12.sp,
                                        maxLines = 2,
                                        overflow = TextOverflow.Ellipsis,
                                        lineHeight = 16.sp
                                    )

                                    Spacer(modifier = Modifier.height(10.dp))

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column {
                                            if (offer.discountPrice > 0) {
                                                Text(
                                                    text = "${offer.discountPrice.toInt()} دج",
                                                    color = LightGold,
                                                    fontWeight = FontWeight.Black,
                                                    fontSize = 16.sp
                                                )
                                                if (offer.originalPrice > offer.discountPrice) {
                                                    Text(
                                                        text = "${offer.originalPrice.toInt()} دج",
                                                        color = TextMuted,
                                                        fontSize = 11.sp
                                                    )
                                                }
                                            } else {
                                                Text(
                                                    text = "${offer.originalPrice.toInt()} دج",
                                                    color = LightGold,
                                                    fontWeight = FontWeight.Black,
                                                    fontSize = 16.sp
                                                )
                                            }
                                        }

                                        Button(
                                            onClick = onNavigateToBooking,
                                            colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                                            shape = RoundedCornerShape(10.dp),
                                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                                        ) {
                                            Text("طلب العرض", color = Color.Black, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Quick Pillars & Quality Guarantees
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    text = "مميزات استوديو إبرا",
                    color = Color.White,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    QualityCard(
                        icon = Icons.Default.Videocam,
                        title = "سينما 4K",
                        desc = "أحدث عدسات ومعدات التصوير",
                        modifier = Modifier.weight(1f)
                    )
                    QualityCard(
                        icon = Icons.Default.Speed,
                        title = "تسليم سريع",
                        desc = "مونتاج ومعالجة خلال 15 يوماً",
                        modifier = Modifier.weight(1f)
                    )
                    QualityCard(
                        icon = Icons.Default.Verified,
                        title = "عقود موثقة",
                        desc = "ضمان حضور كامل الفريق",
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // Recent Portfolio Samples from Firestore
        if (portfolio.isNotEmpty()) {
            item {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "من أعمالنا الأخيرة",
                            color = Color.White,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                        TextButton(onClick = onNavigateToPortfolio) {
                            Text("عرض الكل", color = PrimaryGold, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        items(portfolio.take(6)) { item ->
                            Box(
                                modifier = Modifier
                                    .size(150.dp, 200.dp)
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(SurfaceCard)
                                    .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
                            ) {
                                AsyncImage(
                                    model = if (item.image.startsWith("http")) item.image else "https://ibraprod.online${item.image}",
                                    contentDescription = item.titleAr,
                                    modifier = Modifier.fillMaxSize(),
                                    contentScale = ContentScale.Crop
                                )
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .background(
                                            Brush.verticalGradient(
                                                listOf(Color.Transparent, Color.Black.copy(alpha = 0.85f)),
                                                startY = 100f
                                            )
                                        )
                                )
                                Text(
                                    text = item.titleAr,
                                    color = Color.White,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier
                                        .align(Alignment.BottomStart)
                                        .padding(10.dp),
                                    maxLines = 2,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    }
                }
            }
        }

        // External Support & Official Website Optional Link
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(18.dp))
                    .border(1.dp, SurfaceBorder, RoundedCornerShape(18.dp)),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("موقع إبرا برودكشن الرسمي", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text("ibraprod.online • الجزائر", color = TextSecondary, fontSize = 11.sp)
                    }

                    Button(
                        onClick = {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://ibraprod.online"))
                            context.startActivity(intent)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF26262B)),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.OpenInNew, contentDescription = null, tint = LightGold, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("زيارة الموقع", color = LightGold, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(20.dp)) }
    }
}

@Composable
private fun QualityCard(icon: androidx.compose.ui.graphics.vector.ImageVector, title: String, desc: String, modifier: Modifier) {
    Card(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .border(1.dp, SurfaceBorder, RoundedCornerShape(14.dp)),
        colors = CardDefaults.cardColors(containerColor = SurfaceCard)
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(icon, contentDescription = null, tint = PrimaryGold, modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.height(6.dp))
            Text(title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp, textAlign = TextAlign.Center)
            Spacer(modifier = Modifier.height(2.dp))
            Text(desc, color = TextMuted, fontSize = 10.sp, textAlign = TextAlign.Center, lineHeight = 13.sp)
        }
    }
}

// =========================================================================
// 2. SERVICES & PACKAGES SCREEN (الخدمات والباقات)
// =========================================================================

@Composable
fun CustomerServicesScreen(
    services: List<StudioService>,
    packages: List<StudioPackage>,
    onSelectPackageForBooking: (StudioPackage) -> Unit,
    onSelectServiceForBooking: (StudioService) -> Unit
) {
    var selectedTab by remember { mutableStateOf(0) } // 0 = Packages, 1 = Services

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp)
    ) {
        Spacer(modifier = Modifier.height(10.dp))

        // Toggle Switch
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(14.dp))
                .background(SurfaceCard)
                .padding(4.dp)
        ) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(10.dp))
                    .background(if (selectedTab == 0) PrimaryGold else Color.Transparent)
                    .clickable { selectedTab = 0 }
                    .padding(vertical = 10.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    "الباقات الملكية الشاملة (${packages.size})",
                    color = if (selectedTab == 0) Color.Black else TextSecondary,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(10.dp))
                    .background(if (selectedTab == 1) PrimaryGold else Color.Transparent)
                    .clickable { selectedTab = 1 }
                    .padding(vertical = 10.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    "الخدمات الفردية (${services.size})",
                    color = if (selectedTab == 1) Color.Black else TextSecondary,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        if (selectedTab == 0) {
            // Packages List
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(14.dp),
                contentPadding = PaddingValues(bottom = 20.dp)
            ) {
                items(packages) { pkg ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .border(
                                1.dp,
                                if (pkg.popular) PrimaryGold else SurfaceBorder,
                                RoundedCornerShape(20.dp)
                            ),
                        colors = CardDefaults.cardColors(containerColor = SurfaceCard)
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = pkg.nameAr,
                                    color = Color.White,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 17.sp
                                )

                                if (pkg.badgeAr.isNotEmpty() || pkg.popular) {
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(8.dp))
                                            .background(PrimaryGold.copy(alpha = 0.2f))
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            if (pkg.badgeAr.isNotEmpty()) pkg.badgeAr else "الأكثر طلباً",
                                            color = PrimaryGold,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = pkg.descriptionAr,
                                color = TextSecondary,
                                fontSize = 13.sp,
                                lineHeight = 18.sp
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            // Features
                            if (pkg.featuresAr.isNotEmpty()) {
                                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                    pkg.featuresAr.forEach { feature ->
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                                        ) {
                                            Icon(
                                                Icons.Default.CheckCircle,
                                                contentDescription = null,
                                                tint = PrimaryGold,
                                                modifier = Modifier.size(16.dp)
                                            )
                                            Text(feature, color = Color.White, fontSize = 12.sp)
                                        }
                                    }
                                }
                                Spacer(modifier = Modifier.height(14.dp))
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("السعر الإجمالي", color = TextMuted, fontSize = 11.sp)
                                    Text(
                                        "${pkg.price.toInt()} دج",
                                        color = LightGold,
                                        fontWeight = FontWeight.Black,
                                        fontSize = 18.sp
                                    )
                                }

                                Button(
                                    onClick = { onSelectPackageForBooking(pkg) },
                                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Icon(Icons.Default.CalendarToday, contentDescription = null, tint = Color.Black, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("احجز هذه الباقة", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // Services List
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(14.dp),
                contentPadding = PaddingValues(bottom = 20.dp)
            ) {
                items(services) { srv ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(18.dp))
                            .border(1.dp, SurfaceBorder, RoundedCornerShape(18.dp)),
                        colors = CardDefaults.cardColors(containerColor = SurfaceCard)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = srv.nameAr,
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = srv.descriptionAr,
                                    color = TextSecondary,
                                    fontSize = 12.sp,
                                    lineHeight = 16.sp
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "${srv.price.toInt()} دج",
                                    color = LightGold,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 15.sp
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Button(
                                onClick = { onSelectServiceForBooking(srv) },
                                colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text("حجز", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

// =========================================================================
// 3. BOOKING FORM SCREEN (حجز موعد جديد)
// =========================================================================

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerBookingScreen(
    repository: IbraFirebaseRepository,
    preselectedPackage: StudioPackage? = null,
    preselectedService: StudioService? = null,
    onBookingCreatedSuccess: (String, String) -> Unit // bookingId, phone
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var groomName by remember { mutableStateOf("") }
    var brideName by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("055") }
    var eventDate by remember { mutableStateOf("2026-08-15") }
    var eventTime by remember { mutableStateOf("14:00") }
    var venue by remember { mutableStateOf("") }
    var wilaya by remember { mutableStateOf("16 - الجزائر") }
    var eventType by remember { mutableStateOf("حفل زفاف فاخر") }
    var notes by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }

    val wilayas = listOf(
        "16 - الجزائر", "09 - البليدة", "35 - بومرداس", "31 - وهران", "25 - قسنطينة",
        "19 - سطيف", "15 - تيزي وزو", "06 - بجاية", "42 - تيبازة", "13 - تلمسان"
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 10.dp, bottom = 30.dp)
    ) {
        item {
            Column {
                Text(
                    text = "طلب حجز موعد تصوير جديد",
                    color = Color.White,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black
                )
                Text(
                    text = "يتم إرسال الطلب مباشرة إلى قاعدة بيانات الاستوديو والموقع في الوقت الحقيقي",
                    color = TextSecondary,
                    fontSize = 12.sp
                )
            }
        }

        if (preselectedPackage != null) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = PrimaryGold.copy(alpha = 0.1f)),
                    border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(PrimaryGold, Color(0xFF7A6520))))
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Icon(Icons.Default.CardGiftcard, contentDescription = null, tint = PrimaryGold)
                        Column {
                            Text("الباقة المختارة: ${preselectedPackage.nameAr}", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("السعر: ${preselectedPackage.price.toInt()} دج", color = LightGold, fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        // Form Fields
        item {
            OutlinedTextField(
                value = groomName,
                onValueChange = { groomName = it },
                label = { Text("اسم العريس الكامل *") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryGold,
                    unfocusedBorderColor = SurfaceBorder,
                    focusedLabelColor = PrimaryGold,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp),
                leadingIcon = { Icon(Icons.Default.Person, contentDescription = null, tint = PrimaryGold) }
            )
        }

        item {
            OutlinedTextField(
                value = brideName,
                onValueChange = { brideName = it },
                label = { Text("اسم العروس الكريمة") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryGold,
                    unfocusedBorderColor = SurfaceBorder,
                    focusedLabelColor = PrimaryGold,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp),
                leadingIcon = { Icon(Icons.Default.Favorite, contentDescription = null, tint = PrimaryGold) }
            )
        }

        item {
            OutlinedTextField(
                value = phone,
                onValueChange = { phone = it },
                label = { Text("رقم هاتف العريس للتواصل والتتبع *") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryGold,
                    unfocusedBorderColor = SurfaceBorder,
                    focusedLabelColor = PrimaryGold,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp),
                leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null, tint = PrimaryGold) }
            )
        }

        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = eventDate,
                    onValueChange = { eventDate = it },
                    label = { Text("تاريخ المناسبة (YYYY-MM-DD)") },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryGold,
                        unfocusedBorderColor = SurfaceBorder,
                        focusedLabelColor = PrimaryGold,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = eventTime,
                    onValueChange = { eventTime = it },
                    label = { Text("التوقيت") },
                    modifier = Modifier.weight(0.7f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryGold,
                        unfocusedBorderColor = SurfaceBorder,
                        focusedLabelColor = PrimaryGold,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    shape = RoundedCornerShape(12.dp)
                )
            }
        }

        item {
            OutlinedTextField(
                value = venue,
                onValueChange = { venue = it },
                label = { Text("مكان الحفل / قاعة الحفلات *") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryGold,
                    unfocusedBorderColor = SurfaceBorder,
                    focusedLabelColor = PrimaryGold,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp),
                leadingIcon = { Icon(Icons.Default.LocationOn, contentDescription = null, tint = PrimaryGold) }
            )
        }

        item {
            OutlinedTextField(
                value = notes,
                onValueChange = { notes = it },
                label = { Text("ملاحظات أو طلبات خاصة لطاقم التصوير") },
                modifier = Modifier.fillMaxWidth(),
                maxLines = 3,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryGold,
                    unfocusedBorderColor = SurfaceBorder,
                    focusedLabelColor = PrimaryGold,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp)
            )
        }

        item {
            Button(
                onClick = {
                    if (groomName.trim().length < 2) {
                        Toast.makeText(context, "يرجى كتابة اسم العريس بشكل صحيح", Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    if (phone.trim().replace(Regex("[^0-9]"), "").length < 8) {
                        Toast.makeText(context, "يرجى إدخال رقم هاتف جزائري صالح", Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    if (venue.trim().isEmpty()) {
                        Toast.makeText(context, "يرجى تحديد مكان أو قاعة الحفل", Toast.LENGTH_SHORT).show()
                        return@Button
                    }

                    isSubmitting = true
                    coroutineScope.launch {
                        val booking = CustomerBooking(
                            groomName = groomName,
                            brideName = brideName,
                            phone = phone,
                            eventDate = eventDate,
                            eventTime = eventTime,
                            venue = venue,
                            wilaya = wilaya,
                            eventType = eventType,
                            packageId = preselectedPackage?.id,
                            serviceId = preselectedService?.id,
                            notes = notes,
                            status = "new",
                            source = "android"
                        )
                        val result = repository.submitBooking(booking)
                        isSubmitting = false
                        if (result.isSuccess) {
                            val id = result.getOrNull() ?: ""
                            Toast.makeText(context, "تم إرسال حجزك بنجاح! سيتم مراجعته وتأكيده من الإدارة.", Toast.LENGTH_LONG).show()
                            onBookingCreatedSuccess(id, phone)
                        } else {
                            Toast.makeText(context, "تعذر إرسال الحجز، يرجى التحقق من اتصال الإنترنت", Toast.LENGTH_LONG).show()
                        }
                    }
                },
                enabled = !isSubmitting,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                shape = RoundedCornerShape(14.dp)
            ) {
                if (isSubmitting) {
                    CircularProgressIndicator(color = Color.Black, modifier = Modifier.size(22.dp))
                } else {
                    Icon(Icons.Default.Send, contentDescription = null, tint = Color.Black)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("إرسال طلب الحجز إلى استوديو إبرا", color = Color.Black, fontWeight = FontWeight.Black, fontSize = 15.sp)
                }
            }
        }
    }
}

// =========================================================================
// 4. TRACKING & MY BOOKINGS SCREEN (حجوزاتي ومتابعة الطلب)
// =========================================================================

@Composable
fun CustomerTrackingScreen(
    repository: IbraFirebaseRepository,
    initialPhone: String = "",
    onNavigateToNewBooking: () -> Unit
) {
    var searchPhone by remember { mutableStateOf(initialPhone) }
    var activePhoneToQuery by remember { mutableStateOf(initialPhone) }

    val bookingsFlow = remember(activePhoneToQuery) {
        repository.observeCustomerBookings(activePhoneToQuery)
    }
    val bookings by bookingsFlow.collectAsState(initial = emptyList())

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 10.dp, bottom = 30.dp)
    ) {
        item {
            Column {
                Text(
                    text = "تتبع حجوزات العرسان في الوقت الفعلي",
                    color = Color.White,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black
                )
                Text(
                    text = "مزامنة لحظية مباشرة مع نظام إدارة الاستوديو على موقع ibraprod.online",
                    color = TextSecondary,
                    fontSize = 12.sp
                )
            }
        }

        // Phone Search Bar
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = searchPhone,
                    onValueChange = { searchPhone = it },
                    placeholder = { Text("أدخل رقم هاتفك (مثلاً 0558948485)") },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryGold,
                        unfocusedBorderColor = SurfaceBorder,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    shape = RoundedCornerShape(12.dp),
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = PrimaryGold) }
                )

                Button(
                    onClick = { activePhoneToQuery = searchPhone.trim() },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("بحث", color = Color.Black, fontWeight = FontWeight.Bold)
                }
            }
        }

        if (bookings.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = SurfaceCard),
                    border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(SurfaceBorder, SurfaceBorder)))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(28.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(Icons.Default.EventBusy, contentDescription = null, tint = TextMuted, modifier = Modifier.size(48.dp))
                        Spacer(modifier = Modifier.height(10.dp))
                        Text("لا توجد حجوزات مسجلة بهذا الرقم حالياً", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("تأكد من كتابة نفس رقم الهاتف المستخدم أثناء الحجز في الموقع أو التطبيق", color = TextSecondary, fontSize = 12.sp, textAlign = TextAlign.Center)
                        Spacer(modifier = Modifier.height(14.dp))
                        Button(
                            onClick = onNavigateToNewBooking,
                            colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("إنشاء حجز جديد الآن", color = Color.Black, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        } else {
            items(bookings) { booking ->
                BookingTrackingCard(booking = booking)
            }
        }
    }
}

@Composable
private fun BookingTrackingCard(booking: CustomerBooking) {
    val statusColor = when (booking.status) {
        "new" -> Color(0xFFF59E0B)       // Amber
        "confirmed" -> Color(0xFF10B981) // Emerald
        "processing" -> Color(0xFF3B82F6)// Blue
        "completed" -> Color(0xFF8B5CF6) // Purple
        else -> Color.Gray
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .border(1.dp, statusColor.copy(alpha = 0.5f), RoundedCornerShape(20.dp)),
        colors = CardDefaults.cardColors(containerColor = SurfaceCard)
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            // Status Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(statusColor.copy(alpha = 0.2f))
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Text(
                        booking.statusLabelAr,
                        color = statusColor,
                        fontWeight = FontWeight.Black,
                        fontSize = 12.sp
                    )
                }

                if (!booking.clientCode.isNullOrEmpty()) {
                    Text(
                        booking.clientCode,
                        color = LightGold,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Groom & Bride
            Text(
                text = "العريس: ${booking.groomName}" + if (booking.brideName.isNotEmpty()) " والعروس: ${booking.brideName}" else "",
                color = Color.White,
                fontWeight = FontWeight.Black,
                fontSize = 16.sp
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Event Details
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Icon(Icons.Default.CalendarMonth, contentDescription = null, tint = PrimaryGold, modifier = Modifier.size(16.dp))
                Text(
                    text = "التاريخ: ${booking.eventDate} • التوقيت: ${booking.eventTime}",
                    color = TextSecondary,
                    fontSize = 13.sp
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Icon(Icons.Default.LocationOn, contentDescription = null, tint = PrimaryGold, modifier = Modifier.size(16.dp))
                Text(
                    text = "المكان: ${booking.venue} (${booking.wilaya})",
                    color = TextSecondary,
                    fontSize = 13.sp
                )
            }

            // Real-Time Barcode Section
            val barcodeText = booking.clientCode ?: booking.id
            if (barcodeText.isNotEmpty()) {
                Spacer(modifier = Modifier.height(14.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.White)
                        .padding(10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Code128BarcodeView(
                        barcodeData = barcodeText,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(55.dp)
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "باركود الاعتماد الرسمي: $barcodeText",
                    color = TextMuted,
                    fontSize = 11.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

// =========================================================================
// 5. PORTFOLIO SCREEN (معرض الأعمال)
// =========================================================================

@Composable
fun CustomerPortfolioScreen(
    portfolio: List<StudioPortfolioItem>
) {
    var selectedCategory by remember { mutableStateOf("ALL") }

    val filteredList = remember(portfolio, selectedCategory) {
        if (selectedCategory == "ALL") portfolio
        else portfolio.filter { it.category.equals(selectedCategory, ignoreCase = true) }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp)
    ) {
        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = "معرض الأعمال السينمائية والفوتوغرافية",
            color = Color.White,
            fontSize = 20.sp,
            fontWeight = FontWeight.Black
        )
        Text(
            text = "شاهد عينات حقيقية من إنتاج استوديو إبرا لأعراس الجزائر الفاخرة",
            color = TextSecondary,
            fontSize = 12.sp
        )

        Spacer(modifier = Modifier.height(14.dp))

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            contentPadding = PaddingValues(bottom = 20.dp)
        ) {
            items(filteredList) { item ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(220.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp)),
                    colors = CardDefaults.cardColors(containerColor = SurfaceCard)
                ) {
                    Box(modifier = Modifier.fillMaxSize()) {
                        AsyncImage(
                            model = if (item.image.startsWith("http")) item.image else "https://ibraprod.online${item.image}",
                            contentDescription = item.titleAr,
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.verticalGradient(
                                        listOf(Color.Transparent, Color.Black.copy(alpha = 0.85f)),
                                        startY = 100f
                                    )
                                )
                        )
                        Column(
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .padding(10.dp)
                        ) {
                            Text(
                                text = item.titleAr,
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            if (item.descriptionAr.isNotEmpty()) {
                                Text(
                                    text = item.descriptionAr,
                                    color = TextSecondary,
                                    fontSize = 10.sp,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
