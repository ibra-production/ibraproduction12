package com.example.ui.screens

import androidx.compose.foundation.Canvas
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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.AttachMoney
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Paid
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material.icons.filled.Usb
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.i18n.StudioStrings
import com.example.ui.StudioTab
import com.example.ui.StudioViewModel
import com.example.ui.components.LuxuryMetricCard
import com.example.ui.components.SectionHeader
import com.example.ui.components.StatusBadge
import com.example.ui.theme.AccentCyan
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.DangerRed
import com.example.ui.theme.GoldSecondary
import com.example.ui.theme.LightGold
import com.example.ui.theme.PrimaryGold
import com.example.ui.theme.SuccessGreen
import com.example.ui.theme.SurfaceBorder
import com.example.ui.theme.SurfaceCard
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import com.example.ui.theme.WarningOrange

@Composable
fun DashboardScreen(
    viewModel: StudioViewModel,
    onNavigateTab: (StudioTab) -> Unit,
    onOpenScanner: () -> Unit
) {
    val language by viewModel.currentLanguage.collectAsState()
    val metrics by viewModel.dashboardMetrics.collectAsState()
    val bookings by viewModel.bookings.collectAsState()
    val transactions by viewModel.transactions.collectAsState()

    val currency = StudioStrings.get("currency_dzd", language)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Banner & Studio Title
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 10.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(
                        Brush.linearGradient(
                            listOf(
                                Color(0xFF1E293B),
                                Color(0xFF0F172A),
                                BackgroundDark
                            )
                        )
                    )
                    .border(
                        1.dp,
                        Brush.linearGradient(listOf(PrimaryGold.copy(alpha = 0.6f), Color.Transparent)),
                        RoundedCornerShape(20.dp)
                    )
                    .padding(18.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "ستوديو إبرا للإنتاج الفني",
                                color = PrimaryGold,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "لوحة التحكم التنفيذية والمؤشرات المالية الحية",
                                color = TextSecondary,
                                fontSize = 12.sp
                            )
                        }
                        Box(
                            modifier = Modifier
                                .background(SuccessGreen.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                                .border(1.dp, SuccessGreen.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "موسم 2026/2027 نشط",
                                color = SuccessGreen,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Profit & Revenue highlight row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("المداخيل الإجمالية", color = TextSecondary, fontSize = 11.sp)
                            Text(
                                text = "${String.format("%,.0f", metrics.totalRevenue)} $currency",
                                color = TextPrimary,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("صافي الأرباح المحققة", color = TextSecondary, fontSize = 11.sp)
                            Text(
                                text = "${String.format("%,.0f", metrics.netProfit)} $currency",
                                color = LightGold,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }

        // Quick Actions Row
        item {
            SectionHeader(title = "إجراءات سريعة • Actions Rapides")
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                item {
                    QuickActionChip(
                        icon = Icons.Default.QrCodeScanner,
                        label = "مسح باركود",
                        color = PrimaryGold,
                        onClick = onOpenScanner,
                        testTag = "quick_action_scan"
                    )
                }
                item {
                    QuickActionChip(
                        icon = Icons.Default.CalendarMonth,
                        label = "حجز جديد",
                        color = LightGold,
                        onClick = { onNavigateTab(StudioTab.BOOKINGS) },
                        testTag = "quick_action_booking"
                    )
                }
                item {
                    QuickActionChip(
                        icon = Icons.Default.Paid,
                        label = "تسجيل دفعة",
                        color = SuccessGreen,
                        onClick = { onNavigateTab(StudioTab.FINANCE) },
                        testTag = "quick_action_payment"
                    )
                }
                item {
                    QuickActionChip(
                        icon = Icons.Default.Usb,
                        label = "تسليم فلاشة",
                        color = AccentCyan,
                        onClick = { onNavigateTab(StudioTab.USB) },
                        testTag = "quick_action_usb"
                    )
                }
                item {
                    QuickActionChip(
                        icon = Icons.Default.Group,
                        label = "ملفات الطاقم",
                        color = PrimaryGold,
                        onClick = { onNavigateTab(StudioTab.TEAM) },
                        testTag = "quick_action_team"
                    )
                }
            }
        }

        // 4 Key Metric Cards Grid
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    LuxuryMetricCard(
                        title = "إجمالي العرسان",
                        value = "${metrics.totalClients}",
                        subtitle = "عريس مسجل في النظام",
                        icon = Icons.Default.Group,
                        iconTint = PrimaryGold,
                        modifier = Modifier.weight(1f)
                    )
                    LuxuryMetricCard(
                        title = "الحجوزات المؤكدة",
                        value = "${metrics.confirmedBookings}",
                        subtitle = "حفل زفاف مبرمج",
                        icon = Icons.Default.CheckCircle,
                        iconTint = SuccessGreen,
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    LuxuryMetricCard(
                        title = "المبالغ المحصلة",
                        value = "${String.format("%,.0f", metrics.totalReceived)}",
                        subtitle = "دج تسبيقات ودفعات",
                        icon = Icons.Default.Paid,
                        iconTint = LightGold,
                        modifier = Modifier.weight(1f)
                    )
                    LuxuryMetricCard(
                        title = "الديون المتبقية",
                        value = "${String.format("%,.0f", metrics.totalOutstandingDebt)}",
                        subtitle = "دج مستحقات قيد التحصيل",
                        icon = Icons.Default.AttachMoney,
                        iconTint = WarningOrange,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // Monthly Financial Trend Visual Chart
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp)),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "الأداء المالي ونمو الحجوزات 2026",
                            color = TextPrimary,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(8.dp).background(PrimaryGold, CircleShape))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("مداخيل", color = TextSecondary, fontSize = 10.sp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Box(modifier = Modifier.size(8.dp).background(GoldSecondary, CircleShape))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("أرباح", color = TextSecondary, fontSize = 10.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Minimal custom Compose Canvas bar chart
                    Canvas(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(100.dp)
                    ) {
                        val months = listOf("جوي", "أوت", "سبت", "أكت", "نوف", "ديس")
                        val revenueLevels = listOf(0.45f, 0.70f, 0.85f, 0.95f, 0.80f, 0.65f)
                        val profitLevels = listOf(0.30f, 0.50f, 0.60f, 0.70f, 0.55f, 0.45f)

                        val barWidth = size.width / (months.size * 2.8f)
                        val spacing = size.width / months.size

                        for (i in months.indices) {
                            val x = i * spacing + spacing * 0.25f

                            // Revenue bar
                            val revHeight = size.height * revenueLevels[i]
                            drawRect(
                                color = Color(0xFFE5C158),
                                topLeft = Offset(x, size.height - revHeight),
                                size = Size(barWidth, revHeight)
                            )

                            // Profit bar
                            val profHeight = size.height * profitLevels[i]
                            drawRect(
                                color = Color(0xFFC29B38),
                                topLeft = Offset(x + barWidth + 2f, size.height - profHeight),
                                size = Size(barWidth, profHeight)
                            )
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        listOf("جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر").forEach { month ->
                            Text(month, color = TextMuted, fontSize = 10.sp)
                        }
                    }
                }
            }
        }

        // Upcoming Weddings Section
        item {
            SectionHeader(
                title = "الأعراس والمناسبات القادمة",
                actionText = "عرض الكل",
                onActionClick = { onNavigateTab(StudioTab.BOOKINGS) }
            )
        }

        items(bookings.take(3)) { booking ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigateTab(StudioTab.BOOKINGS) }
                    .border(1.dp, SurfaceBorder, RoundedCornerShape(14.dp)),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = booking.groomName,
                                color = TextPrimary,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            StatusBadge(booking.status)
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "📅 ${booking.eventDate} (${booking.eventTime}) • 📍 ${booking.venueName}",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )
                        Text(
                            text = "الباقة: ${booking.packageType} • ${booking.wilaya}",
                            color = PrimaryGold.copy(alpha = 0.8f),
                            fontSize = 11.sp
                        )
                    }

                    Icon(
                        imageVector = Icons.Default.ArrowForward,
                        contentDescription = "Details",
                        tint = TextSecondary,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }

        // Recent Financial Transactions
        item {
            SectionHeader(
                title = "آخر المعاملات المالية",
                actionText = "السجل المالي",
                onActionClick = { onNavigateTab(StudioTab.FINANCE) }
            )
        }

        items(transactions.take(3)) { tx ->
            val isIncome = tx.type == "INCOME"
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp)),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .clip(CircleShape)
                                .background(if (isIncome) SuccessGreen.copy(alpha = 0.15f) else DangerRed.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (isIncome) Icons.Default.Paid else Icons.Default.AttachMoney,
                                contentDescription = null,
                                tint = if (isIncome) SuccessGreen else DangerRed,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        Spacer(modifier = Modifier.width(10.dp))

                        Column {
                            Text(
                                text = tx.title,
                                color = TextPrimary,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "${tx.date} • ${tx.recordedBy}",
                                color = TextSecondary,
                                fontSize = 11.sp
                            )
                        }
                    }

                    Text(
                        text = "${if (isIncome) "+" else "-"}${String.format("%,.0f", tx.amount)} $currency",
                        color = if (isIncome) SuccessGreen else DangerRed,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun QuickActionChip(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    color: Color,
    onClick: () -> Unit,
    testTag: String
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .testTag(testTag)
            .clip(RoundedCornerShape(12.dp))
            .background(SurfaceCard)
            .border(1.dp, color.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
            .clickable { onClick() }
            .padding(horizontal = 14.dp, vertical = 10.dp)
    ) {
        Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(18.dp))
        Spacer(modifier = Modifier.width(8.dp))
        Text(text = label, color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
    }
}
