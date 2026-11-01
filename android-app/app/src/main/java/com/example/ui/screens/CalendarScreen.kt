package com.example.ui.screens

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
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.StudioViewModel
import com.example.ui.components.SectionHeader
import com.example.ui.components.StatusBadge
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.LightGold
import com.example.ui.theme.PrimaryGold
import com.example.ui.theme.SurfaceBorder
import com.example.ui.theme.SurfaceCard
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import com.example.ui.theme.WarningOrange

@Composable
fun CalendarScreen(viewModel: StudioViewModel) {
    val bookings by viewModel.bookings.collectAsState()

    val daysInMonth = (1..30).toList()
    var selectedDay by remember { mutableStateOf(14) } // November 14 is Karim's wedding

    val selectedDateString = String.format("2026-11-%02d", selectedDay)
    val dayBookings = remember(bookings, selectedDateString) {
        bookings.filter { it.eventDate == selectedDateString }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text(
                text = "تقويم الأعراس والمواعيد • Calendrier des Mariages",
                color = PrimaryGold,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(top = 10.dp)
            )
            Text(
                text = "نوفمبر 2026 • تتبع مواعيد الأعراس وجلسات التصوير وتوزيع المصورين",
                color = TextSecondary,
                fontSize = 12.sp
            )
        }

        // Horizontal Day Selector
        item {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(daysInMonth) { day ->
                    val dateStr = String.format("2026-11-%02d", day)
                    val countForDay = bookings.count { it.eventDate == dateStr }
                    val isSelected = selectedDay == day

                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) PrimaryGold else SurfaceCard)
                            .border(1.dp, if (isSelected) PrimaryGold else SurfaceBorder, RoundedCornerShape(12.dp))
                            .clickable { selectedDay = day }
                            .padding(horizontal = 12.dp, vertical = 10.dp)
                    ) {
                        Text(
                            text = "نوفمبر",
                            color = if (isSelected) BackgroundDark else TextMuted,
                            fontSize = 9.sp
                        )
                        Text(
                            text = "$day",
                            color = if (isSelected) BackgroundDark else TextPrimary,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                        if (countForDay > 0) {
                            Box(
                                modifier = Modifier
                                    .padding(top = 4.dp)
                                    .size(6.dp)
                                    .clip(CircleShape)
                                    .background(if (isSelected) BackgroundDark else PrimaryGold)
                            )
                        } else {
                            Spacer(modifier = Modifier.height(6.dp))
                        }
                    }
                }
            }
        }

        item {
            SectionHeader(title = "أحداث يوم $selectedDateString (${dayBookings.size})")
        }

        if (dayBookings.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(140.dp)
                        .background(SurfaceCard, RoundedCornerShape(14.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.Event, contentDescription = null, tint = TextMuted, modifier = Modifier.size(36.dp))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("لا توجد أعراس مبرمجة في هذا اليوم", color = TextSecondary, fontSize = 13.sp)
                    }
                }
            }
        } else {
            items(dayBookings) { booking ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, PrimaryGold.copy(alpha = 0.5f), RoundedCornerShape(14.dp)),
                    colors = CardDefaults.cardColors(containerColor = SurfaceCard)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "⏰ ${booking.eventTime}",
                                color = PrimaryGold,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                            StatusBadge(booking.status)
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "${booking.groomName} & ${booking.brideName}",
                            color = TextPrimary,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )

                        Text(
                            text = "📍 ${booking.venueName} • ${booking.wilaya}",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = "فريق العمل المعين: ${booking.leadPhotographer.ifEmpty { "إبراهيم" }} + ${booking.leadVideographer.ifEmpty { "سامي" }}",
                            color = LightGold,
                            fontSize = 12.sp
                        )
                    }
                }
            }
        }

        item {
            SectionHeader(title = "جميع الأعراس المجدولة القادمة")
        }

        items(bookings) { b ->
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
                    Column {
                        Text(b.groomName, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("📅 ${b.eventDate} (${b.eventTime}) • ${b.wilaya}", color = TextSecondary, fontSize = 11.sp)
                        Text(b.packageType, color = PrimaryGold, fontSize = 11.sp)
                    }
                    StatusBadge(b.status)
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}
