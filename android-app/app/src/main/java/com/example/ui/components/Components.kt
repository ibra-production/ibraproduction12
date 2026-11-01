package com.example.ui.components

import android.content.Intent
import android.net.Uri
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Fingerprint
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import com.example.R
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
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
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.i18n.AppLanguage
import com.example.i18n.StudioStrings
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.BackgroundSecondary
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
fun RtlLayoutWrapper(
    language: AppLanguage,
    content: @Composable () -> Unit
) {
    val direction = if (language.isRtl) LayoutDirection.Rtl else LayoutDirection.Ltr
    CompositionLocalProvider(LocalLayoutDirection provides direction) {
        content()
    }
}

@Composable
fun StudioTopBar(
    language: AppLanguage,
    onLanguageChange: (AppLanguage) -> Unit,
    unreadNotificationsCount: Int,
    onOpenNotifications: () -> Unit,
    onOpenScanner: () -> Unit,
    onOpenAuth: () -> Unit,
    appMode: com.example.ui.AppMode = com.example.ui.AppMode.CLIENT_PORTAL,
    onLockAdmin: () -> Unit = {},
    onRequestAdmin: () -> Unit = {}
) {
    var showLanguageMenu by remember { mutableStateOf(false) }
    val context = LocalContext.current

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(BackgroundDark)
            .padding(horizontal = 14.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Studio Logo & Title
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.clickable { onOpenAuth() }
        ) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(Color.Black)
                    .border(1.5.dp, PrimaryGold, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.ibra_logo),
                    contentDescription = "IBRA PRODUCTION Logo",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            Spacer(modifier = Modifier.width(10.dp))

            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "IBRA PRODUCTION",
                        color = TextPrimary,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Box(
                        modifier = Modifier
                            .background(PrimaryGold.copy(alpha = 0.2f), RoundedCornerShape(4.dp))
                            .border(0.5.dp, PrimaryGold, RoundedCornerShape(4.dp))
                            .padding(horizontal = 4.dp, vertical = 1.dp)
                    ) {
                        Text(
                            text = "STUDIO",
                            color = PrimaryGold,
                            fontSize = 8.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                    }
                }
                Text(
                    text = "0779000833 • PHOTO & VIDEO",
                    color = LightGold,
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        // Action Buttons: Scanner, Notifications, Language, Auth
        Row(verticalAlignment = Alignment.CenterVertically) {
            // Scanner Trigger Button
            IconButton(
                onClick = onOpenScanner,
                modifier = Modifier
                    .testTag("top_bar_scanner_btn")
                    .size(36.dp)
                    .background(PrimaryGold.copy(alpha = 0.12f), CircleShape)
                    .border(1.dp, PrimaryGold.copy(alpha = 0.4f), CircleShape)
            ) {
                Icon(
                    imageVector = Icons.Default.QrCodeScanner,
                    contentDescription = "Scan Barcode",
                    tint = PrimaryGold,
                    modifier = Modifier.size(17.dp)
                )
            }

            Spacer(modifier = Modifier.width(6.dp))

            // Notifications
            IconButton(
                onClick = onOpenNotifications,
                modifier = Modifier
                    .testTag("top_bar_notifications_btn")
                    .size(36.dp)
                    .background(SurfaceCard, CircleShape)
                    .border(1.dp, SurfaceBorder, CircleShape)
            ) {
                BadgedBox(
                    badge = {
                        if (unreadNotificationsCount > 0) {
                            Badge(
                                containerColor = DangerRed,
                                contentColor = TextPrimary
                            ) {
                                Text("$unreadNotificationsCount")
                            }
                        }
                    }
                ) {
                    Icon(
                        imageVector = Icons.Default.Notifications,
                        contentDescription = "Notifications",
                        tint = if (unreadNotificationsCount > 0) PrimaryGold else TextSecondary,
                        modifier = Modifier.size(17.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.width(6.dp))

            // Language Selector
            Box {
                IconButton(
                    onClick = { showLanguageMenu = true },
                    modifier = Modifier
                        .testTag("language_selector_btn")
                        .size(36.dp)
                        .background(SurfaceCard, CircleShape)
                        .border(1.dp, SurfaceBorder, CircleShape)
                ) {
                    Text(
                        text = language.code.uppercase(),
                        color = PrimaryGold,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                DropdownMenu(
                    expanded = showLanguageMenu,
                    onDismissRequest = { showLanguageMenu = false },
                    modifier = Modifier.background(SurfaceElevated)
                ) {
                    AppLanguage.values().forEach { lang ->
                        DropdownMenuItem(
                            text = {
                                Text(
                                    text = lang.displayName,
                                    color = if (lang == language) PrimaryGold else TextPrimary,
                                    fontWeight = if (lang == language) FontWeight.Bold else FontWeight.Normal
                                )
                            },
                            onClick = {
                                onLanguageChange(lang)
                                showLanguageMenu = false
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.width(6.dp))

            // Auth / User Profile button
            IconButton(
                onClick = onOpenAuth,
                modifier = Modifier
                    .testTag("top_bar_auth_btn")
                    .size(36.dp)
                    .background(PrimaryGold.copy(alpha = 0.15f), CircleShape)
                    .border(1.dp, PrimaryGold.copy(alpha = 0.5f), CircleShape)
            ) {
                Icon(
                    imageVector = Icons.Default.AccountCircle,
                    contentDescription = "Studio Auth",
                    tint = PrimaryGold,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.width(6.dp))

            // Biometric Admin Mode Switcher Button
            if (appMode == com.example.ui.AppMode.ADMIN_STUDIO) {
                Button(
                    onClick = onLockAdmin,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrimaryGold.copy(alpha = 0.2f)
                    ),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                    modifier = Modifier
                        .height(34.dp)
                        .border(1.dp, PrimaryGold, RoundedCornerShape(10.dp))
                        .testTag("lock_admin_top_btn")
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "قفل الإدارة",
                        tint = PrimaryGold,
                        modifier = Modifier.size(13.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "قفل 🔒",
                        color = LightGold,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            } else {
                Button(
                    onClick = onRequestAdmin,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = PrimaryGold.copy(alpha = 0.15f)
                    ),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                    modifier = Modifier
                        .height(34.dp)
                        .border(1.dp, PrimaryGold.copy(alpha = 0.4f), RoundedCornerShape(10.dp))
                        .testTag("request_admin_top_btn")
                ) {
                    Icon(
                        imageVector = Icons.Default.Fingerprint,
                        contentDescription = "دخول الإدارة",
                        tint = PrimaryGold,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "الإدارة 🔒",
                        color = LightGold,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
fun LuxuryMetricCard(
    title: String,
    value: String,
    subtitle: String,
    icon: ImageVector,
    iconTint: Color = PrimaryGold,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(SurfaceCard)
            .border(
                width = 1.dp,
                brush = Brush.linearGradient(
                    listOf(PrimaryGold.copy(alpha = 0.4f), Color.Transparent, SurfaceBorder)
                ),
                shape = RoundedCornerShape(16.dp)
            )
            .padding(14.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    color = TextSecondary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium
                )
                Box(
                    modifier = Modifier
                        .size(30.dp)
                        .clip(CircleShape)
                        .background(iconTint.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = iconTint,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = value,
                color = TextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(2.dp))

            Text(
                text = subtitle,
                color = PrimaryGold.copy(alpha = 0.8f),
                fontSize = 10.sp
            )
        }
    }
}

@Composable
fun SectionHeader(
    title: String,
    actionText: String? = null,
    onActionClick: (() -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .width(4.dp)
                    .height(16.dp)
                    .clip(RoundedCornerShape(2.dp))
                    .background(PrimaryGold)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = title,
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold
            )
        }

        if (actionText != null && onActionClick != null) {
            Text(
                text = actionText,
                color = PrimaryGold,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.clickable { onActionClick() }
            )
        }
    }
}

@Composable
fun StatusBadge(
    status: String,
    modifier: Modifier = Modifier
) {
    val (bgColor, textColor, label) = when (status.uppercase()) {
        "CONFIRMED" -> Triple(SuccessGreen.copy(alpha = 0.15f), SuccessGreen, "مؤكد • Confirmé")
        "PENDING" -> Triple(WarningOrange.copy(alpha = 0.15f), WarningOrange, "قيد الانتظار • En Attente")
        "IN_PROGRESS", "IN_PRODUCTION", "EDITING" -> Triple(PrimaryGold.copy(alpha = 0.15f), PrimaryGold, "قيد الإنجاز • En Cours")
        "DELIVERED", "COMPLETED" -> Triple(LightGold.copy(alpha = 0.2f), LightGold, "تم التسليم • Livré")
        "CANCELLED" -> Triple(DangerRed.copy(alpha = 0.15f), DangerRed, "ملغى • Annulé")
        "VERIFIED" -> Triple(SuccessGreen.copy(alpha = 0.15f), SuccessGreen, "تم التحقق • Vérifié")
        else -> Triple(SurfaceBorder, TextSecondary, status)
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(bgColor)
            .border(0.5.dp, textColor.copy(alpha = 0.4f), RoundedCornerShape(6.dp))
            .padding(horizontal = 8.dp, vertical = 3.dp)
    ) {
        Text(
            text = label,
            color = textColor,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

val ALGERIAN_WILAYAS = listOf(
    "16 - الجزائر (Alger)",
    "31 - وهران (Oran)",
    "25 - قسنطينة (Constantine)",
    "19 - سطيف (Sétif)",
    "05 - باتنة (Batna)",
    "15 - تيزي وزو (Tizi Ouzou)",
    "13 - تلمسان (Tlemcen)",
    "23 - عنابة (Annaba)",
    "06 - بجاية (Béjaïa)",
    "09 - البليدة (Blida)",
    "35 - بومرداس (Boumerdès)",
    "42 - تيبازة (Tipaza)",
    "10 - البويرة (Bouira)",
    "28 - المسيلة (M'Sila)",
    "14 - تيارت (Tiaret)",
    "27 - مستغانم (Mostaganem)",
    "02 - الشلف (Chlef)",
    "34 - برج بوعريريج (Bordj Bou Arréridj)",
    "07 - بسكرة (Biskra)",
    "30 - ورقلة (Ouargla)"
)
