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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material.icons.filled.Usb
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.UsbDeliveryEntity
import com.example.ui.StudioViewModel
import com.example.ui.components.SectionHeader
import com.example.ui.components.StatusBadge
import com.example.ui.theme.AccentCyan
import com.example.ui.theme.BackgroundDark
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
fun UsbDeliveryScreen(viewModel: StudioViewModel) {
    val usbList by viewModel.usbDeliveries.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Info Box
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 10.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(SurfaceCard)
                    .border(1.dp, PrimaryGold.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "إدارة فلاشات العرسان (USB Flash Drive)",
                                color = PrimaryGold,
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "تسليم وسائط الأعراس مع التحقق الإجباري من المجلدات الستة",
                                color = TextSecondary,
                                fontSize = 11.sp
                            )
                        }
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(AccentCyan.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Usb, contentDescription = null, tint = AccentCyan, modifier = Modifier.size(20.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "الهيكلية الإلزامية لمجلدات الفلاشة:\n01-PHOTOS • 02-VIDEOS • 03-CONTRACT • 04-INVOICES • 05-ALBUM • 06-READ-ME",
                        color = LightGold,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace,
                        lineHeight = 16.sp
                    )
                }
            }
        }

        item {
            SectionHeader(title = "فلاشات قيد الإعداد والتسليم (${usbList.size})")
        }

        items(usbList) { usb ->
            UsbCardItem(
                usb = usb,
                onChecklistChange = { p, v, c, i, a, r ->
                    viewModel.updateUsbChecklist(usb, p, v, c, i, a, r)
                },
                onDeliver = {
                    viewModel.markUsbDelivered(usb)
                }
            )
        }

        item {
            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}

@Composable
private fun UsbCardItem(
    usb: UsbDeliveryEntity,
    onChecklistChange: (Boolean, Boolean, Boolean, Boolean, Boolean, Boolean) -> Unit,
    onDeliver: () -> Unit
) {
    val isDelivered = usb.deliveryStatus == "DELIVERED"
    val isVerified = usb.deliveryStatus == "VERIFIED" || isDelivered

    val folderCount = listOf(
        usb.copiedPhotosCount > 0,
        usb.copiedVideosCount > 0,
        usb.hasContract,
        usb.hasInvoices,
        usb.hasAlbum,
        usb.hasReadme
    ).count { it }

    val completionPercent = (folderCount / 6f)

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(
                1.dp,
                if (isDelivered) SuccessGreen.copy(alpha = 0.5f) else SurfaceBorder,
                RoundedCornerShape(16.dp)
            ),
        colors = CardDefaults.cardColors(containerColor = SurfaceCard)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header
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
                            text = usb.clientCode,
                            color = PrimaryGold,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "💾 ${usb.usbCapacity}",
                        color = LightGold,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                StatusBadge(usb.deliveryStatus)
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "العريس: ${usb.groomName}",
                color = TextPrimary,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = "الرقم التسلسلي للفلاشة: ${usb.serialNumber} • مراجعة: ${usb.verifiedBy}",
                color = TextSecondary,
                fontSize = 11.sp
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Progress bar
            LinearProgressIndicator(
                progress = { completionPercent },
                color = if (isVerified) SuccessGreen else PrimaryGold,
                trackColor = SurfaceBorder,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp))
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Checklist of 6 Folders
            Text("قائمة التحقق من محتويات الفلاشة ($folderCount / 6):", color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            Spacer(modifier = Modifier.height(6.dp))

            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                ChecklistItem(
                    label = "01-PHOTOS (الصور الكاملة عالية الدقة)",
                    checked = usb.copiedPhotosCount > 0,
                    enabled = !isDelivered,
                    onCheckedChange = { checked ->
                        onChecklistChange(checked, usb.copiedVideosCount > 0, usb.hasContract, usb.hasInvoices, usb.hasAlbum, usb.hasReadme)
                    }
                )
                ChecklistItem(
                    label = "02-VIDEOS (فيديو الكليب والفيلم السينمائي)",
                    checked = usb.copiedVideosCount > 0,
                    enabled = !isDelivered,
                    onCheckedChange = { checked ->
                        onChecklistChange(usb.copiedPhotosCount > 0, checked, usb.hasContract, usb.hasInvoices, usb.hasAlbum, usb.hasReadme)
                    }
                )
                ChecklistItem(
                    label = "03-CONTRACT (عقد العمل المبرم)",
                    checked = usb.hasContract,
                    enabled = !isDelivered,
                    onCheckedChange = { checked ->
                        onChecklistChange(usb.copiedPhotosCount > 0, usb.copiedVideosCount > 0, checked, usb.hasInvoices, usb.hasAlbum, usb.hasReadme)
                    }
                )
                ChecklistItem(
                    label = "04-INVOICES (وصولات الدفع الرسمية)",
                    checked = usb.hasInvoices,
                    enabled = !isDelivered,
                    onCheckedChange = { checked ->
                        onChecklistChange(usb.copiedPhotosCount > 0, usb.copiedVideosCount > 0, usb.hasContract, checked, usb.hasAlbum, usb.hasReadme)
                    }
                )
                ChecklistItem(
                    label = "05-ALBUM (تصاميم الألبوم الرقمي)",
                    checked = usb.hasAlbum,
                    enabled = !isDelivered,
                    onCheckedChange = { checked ->
                        onChecklistChange(usb.copiedPhotosCount > 0, usb.copiedVideosCount > 0, usb.hasContract, usb.hasInvoices, checked, usb.hasReadme)
                    }
                )
                ChecklistItem(
                    label = "06-READ-ME (إهداء وتعليمات التشغيل)",
                    checked = usb.hasReadme,
                    enabled = !isDelivered,
                    onCheckedChange = { checked ->
                        onChecklistChange(usb.copiedPhotosCount > 0, usb.copiedVideosCount > 0, usb.hasContract, usb.hasInvoices, usb.hasAlbum, checked)
                    }
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            if (!isDelivered) {
                Button(
                    onClick = onDeliver,
                    enabled = folderCount == 6,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrimaryGold,
                        contentColor = BackgroundDark,
                        disabledContainerColor = SurfaceBorder,
                        disabledContentColor = TextMuted
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("mark_usb_delivered_btn")
                ) {
                    Icon(Icons.Default.DoneAll, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (folderCount == 6) "تسليم الفلاشة للعريس (معتمد)" else "أكمل فحص الملفات للتسليم ($folderCount/6)",
                        fontWeight = FontWeight.Bold
                    )
                }
            } else {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(SuccessGreen.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                        .padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SuccessGreen, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("تم تسليم الفلاشة للعريس وتوقيع الوصل بنجاح", color = SuccessGreen, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun ChecklistItem(
    label: String,
    checked: Boolean,
    enabled: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .clickable(enabled = enabled) { onCheckedChange(!checked) }
            .padding(vertical = 2.dp)
    ) {
        Checkbox(
            checked = checked,
            onCheckedChange = if (enabled) onCheckedChange else null,
            colors = CheckboxDefaults.colors(
                checkedColor = PrimaryGold,
                uncheckedColor = TextSecondary,
                checkmarkColor = BackgroundDark
            ),
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = label,
            color = if (checked) TextPrimary else TextSecondary,
            fontSize = 12.sp,
            fontFamily = FontFamily.Monospace
        )
    }
}
