package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
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
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CloudQueue
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Paid
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Movie
import androidx.compose.material.icons.filled.Usb
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.barcode.BarcodeScannerSheet
import com.example.i18n.StudioStrings
import com.example.ui.StudioTab
import com.example.ui.StudioViewModel
import com.example.ui.components.RtlLayoutWrapper
import com.example.ui.components.StudioTopBar
import androidx.compose.material.icons.filled.AccountCircle
import com.example.ui.screens.AiAssistantScreen
import com.example.ui.screens.AuthScreen
import com.example.ui.screens.BarcodeCenterScreen
import com.example.ui.screens.BookingsScreen
import com.example.ui.screens.CalendarScreen
import com.example.ui.screens.CrmScreen
import com.example.ui.screens.DashboardScreen
import com.example.ui.screens.DocumentsScreen
import com.example.ui.screens.FinancialCenterScreen
import com.example.ui.screens.MediaArchiveScreen
import com.example.ui.screens.NotificationsScreen
import com.example.ui.screens.SettingsScreen
import com.example.ui.screens.TeamScreen
import com.example.ui.screens.UsbDeliveryScreen
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.BackgroundSecondary
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.PrimaryGold
import com.example.ui.theme.LightGold
import com.example.ui.theme.SurfaceBorder
import com.example.ui.theme.SurfaceCard
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Fingerprint
import androidx.compose.material.icons.filled.Lock
import com.example.ui.AppMode
import com.example.ui.components.BiometricSecurityDialog
import com.example.ui.screens.ClientPortalScreen

class MainActivity : ComponentActivity() {
    private val studioViewModel: StudioViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                StudioAppRoot(viewModel = studioViewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudioAppRoot(viewModel: StudioViewModel) {
    val currentTab by viewModel.currentTab.collectAsState()
    val appMode by viewModel.appMode.collectAsState()
    val showBiometricPrompt by viewModel.showBiometricPrompt.collectAsState()
    val language by viewModel.currentLanguage.collectAsState()
    val unreadNotifs by viewModel.unreadNotificationsCount.collectAsState()
    val showScanner by viewModel.showScannerSheet.collectAsState()
    val matchedClient by viewModel.matchedClient.collectAsState()

    // Back handling:
    if (appMode == AppMode.ADMIN_STUDIO) {
        BackHandler {
            if (currentTab != StudioTab.DASHBOARD) {
                viewModel.selectTab(StudioTab.DASHBOARD)
            } else {
                viewModel.lockAdmin()
            }
        }
    } else if (currentTab != StudioTab.CLIENT_PORTAL) {
        BackHandler {
            viewModel.switchToClientPortal()
        }
    }

    RtlLayoutWrapper(language = language) {
        Scaffold(
            modifier = Modifier
                .fillMaxSize()
                .background(BackgroundDark),
            topBar = {
                Column(modifier = Modifier.statusBarsPadding()) {
                    StudioTopBar(
                        language = language,
                        onLanguageChange = { viewModel.setLanguage(it) },
                        unreadNotificationsCount = unreadNotifs,
                        onOpenNotifications = { viewModel.selectTab(StudioTab.NOTIFICATIONS) },
                        onOpenScanner = { viewModel.openScanner() },
                        onOpenAuth = { viewModel.selectTab(StudioTab.AUTH) },
                        appMode = appMode,
                        onLockAdmin = { viewModel.lockAdmin() },
                        onRequestAdmin = { viewModel.requestAdminAccess() }
                    )

                    // Secondary Modules Navigation Strip (Shown in Admin Mode)
                    if (appMode == AppMode.ADMIN_STUDIO) {
                        SecondaryModulesStrip(
                            currentTab = currentTab,
                            onTabSelected = { viewModel.selectTab(it) }
                        )
                    }
                }
            },
            bottomBar = {
                StudioBottomNavBar(
                    currentTab = currentTab,
                    appMode = appMode,
                    onTabSelected = { viewModel.selectTab(it) },
                    onRequestAdmin = { viewModel.requestAdminAccess() }
                )
            }
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .background(BackgroundDark)
            ) {
                when (currentTab) {
                    StudioTab.CLIENT_PORTAL -> ClientPortalScreen(
                        viewModel = viewModel,
                        onRequestAdmin = { viewModel.requestAdminAccess() }
                    )
                    StudioTab.DASHBOARD -> DashboardScreen(
                        viewModel = viewModel,
                        onNavigateTab = { viewModel.selectTab(it) },
                        onOpenScanner = { viewModel.openScanner() }
                    )
                    StudioTab.BOOKINGS -> BookingsScreen(viewModel = viewModel)
                    StudioTab.CRM -> CrmScreen(viewModel = viewModel)
                    StudioTab.BARCODES -> BarcodeCenterScreen(
                        viewModel = viewModel,
                        onOpenScanner = { viewModel.openScanner() }
                    )
                    StudioTab.USB -> UsbDeliveryScreen(viewModel = viewModel)
                    StudioTab.FINANCE -> FinancialCenterScreen(viewModel = viewModel)
                    StudioTab.CALENDAR -> CalendarScreen(viewModel = viewModel)
                    StudioTab.TEAM -> TeamScreen(viewModel = viewModel)
                    StudioTab.DOCUMENTS -> DocumentsScreen(viewModel = viewModel)
                    StudioTab.MEDIA -> MediaArchiveScreen(viewModel = viewModel)
                    StudioTab.AI_ASSISTANT -> AiAssistantScreen(viewModel = viewModel)
                    StudioTab.NOTIFICATIONS -> NotificationsScreen(viewModel = viewModel)
                    StudioTab.SETTINGS -> SettingsScreen(viewModel = viewModel)
                    StudioTab.AUTH -> AuthScreen(
                        viewModel = viewModel,
                        onAuthSuccess = { viewModel.selectTab(StudioTab.DASHBOARD) }
                    )
                }
            }
        }

        // Biometric Security Gateway Dialog
        if (showBiometricPrompt) {
            BiometricSecurityDialog(
                onDismiss = { viewModel.dismissBiometricPrompt() },
                onAuthenticated = { viewModel.unlockAdminViaBiometric() }
            )
        }

        // Barcode Scanner Modal Sheet
        if (showScanner) {
            val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
            ModalBottomSheet(
                onDismissRequest = { viewModel.closeScanner() },
                sheetState = sheetState,
                containerColor = BackgroundSecondary
            ) {
                BarcodeScannerSheet(
                    onDismiss = { viewModel.closeScanner() },
                    onBarcodeDetected = { code -> viewModel.onBarcodeDetected(code) },
                    matchedClient = matchedClient,
                    onViewClientDetails = { client ->
                        viewModel.setSelectedClient(client)
                        viewModel.selectTab(StudioTab.CRM)
                    }
                )
            }
        }
    }
}

@Composable
fun SecondaryModulesStrip(
    currentTab: StudioTab,
    onTabSelected: (StudioTab) -> Unit
) {
    val modules = listOf(
        Triple(StudioTab.CLIENT_PORTAL, "بوابة العريس", Icons.Default.Favorite),
        Triple(StudioTab.USB, "فلاشات USB", Icons.Default.Usb),
        Triple(StudioTab.CALENDAR, "التقويم", Icons.Default.CalendarMonth),
        Triple(StudioTab.TEAM, "طاقم العمل", Icons.Default.Group),
        Triple(StudioTab.DOCUMENTS, "العقود والوثائق", Icons.Default.Description),
        Triple(StudioTab.MEDIA, "الأرشيف السحابي", Icons.Default.CloudQueue),
        Triple(StudioTab.AI_ASSISTANT, "المساعد الذكي", Icons.Default.AutoAwesome),
        Triple(StudioTab.SETTINGS, "الإعدادات", Icons.Default.Settings),
        Triple(StudioTab.AUTH, "الحساب والمصادقة", Icons.Default.AccountCircle)
    )

    LazyRow(
        modifier = Modifier
            .fillMaxWidth()
            .background(BackgroundDark)
            .padding(horizontal = 14.dp, vertical = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(modules) { (tab, label, icon) ->
            val isSelected = currentTab == tab
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (isSelected) PrimaryGold.copy(alpha = 0.2f) else SurfaceCard)
                    .border(
                        1.dp,
                        if (isSelected) PrimaryGold else SurfaceBorder,
                        RoundedCornerShape(12.dp)
                    )
                    .clickable { onTabSelected(tab) }
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = if (isSelected) PrimaryGold else TextSecondary,
                    modifier = Modifier.size(15.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = label,
                    color = if (isSelected) PrimaryGold else TextSecondary,
                    fontSize = 11.sp,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                )
            }
        }
    }
}

@Composable
fun StudioBottomNavBar(
    currentTab: StudioTab,
    appMode: AppMode,
    onTabSelected: (StudioTab) -> Unit,
    onRequestAdmin: () -> Unit
) {
    if (appMode == AppMode.CLIENT_PORTAL) {
        NavigationBar(
            containerColor = BackgroundSecondary,
            contentColor = TextPrimary,
            tonalElevation = 8.dp,
            modifier = Modifier
                .border(width = 0.5.dp, color = SurfaceBorder)
                .navigationBarsPadding()
                .testTag("client_bottom_nav_bar")
        ) {
            // 1. Wedding Progress & Order Tracking
            NavigationBarItem(
                selected = currentTab == StudioTab.CLIENT_PORTAL,
                onClick = { onTabSelected(StudioTab.CLIENT_PORTAL) },
                icon = {
                    Icon(
                        imageVector = Icons.Default.Favorite,
                        contentDescription = "متابعة العرس",
                        modifier = Modifier.size(20.dp)
                    )
                },
                label = {
                    Text(
                        text = "متابعة العرس",
                        fontSize = 11.sp,
                        fontWeight = if (currentTab == StudioTab.CLIENT_PORTAL) FontWeight.Bold else FontWeight.Normal
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = BackgroundDark,
                    selectedTextColor = PrimaryGold,
                    indicatorColor = PrimaryGold,
                    unselectedIconColor = TextSecondary,
                    unselectedTextColor = TextMuted
                )
            )

            // 2. Cinematic Showcase & Portfolio
            NavigationBarItem(
                selected = currentTab == StudioTab.MEDIA,
                onClick = { onTabSelected(StudioTab.MEDIA) },
                icon = {
                    Icon(
                        imageVector = Icons.Default.Movie,
                        contentDescription = "معرض الأعمال",
                        modifier = Modifier.size(20.dp)
                    )
                },
                label = {
                    Text(
                        text = "معرض الأعمال",
                        fontSize = 11.sp,
                        fontWeight = if (currentTab == StudioTab.MEDIA) FontWeight.Bold else FontWeight.Normal
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = BackgroundDark,
                    selectedTextColor = PrimaryGold,
                    indicatorColor = PrimaryGold,
                    unselectedIconColor = TextSecondary,
                    unselectedTextColor = TextMuted
                )
            )

            // 3. Groom Account & Studio Space
            NavigationBarItem(
                selected = currentTab == StudioTab.AUTH,
                onClick = { onTabSelected(StudioTab.AUTH) },
                icon = {
                    Icon(
                        imageVector = Icons.Default.AccountCircle,
                        contentDescription = "فضاء العميل",
                        modifier = Modifier.size(20.dp)
                    )
                },
                label = {
                    Text(
                        text = "فضاء العميل",
                        fontSize = 11.sp,
                        fontWeight = if (currentTab == StudioTab.AUTH) FontWeight.Bold else FontWeight.Normal
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = BackgroundDark,
                    selectedTextColor = PrimaryGold,
                    indicatorColor = PrimaryGold,
                    unselectedIconColor = TextSecondary,
                    unselectedTextColor = TextMuted
                )
            )
        }
    } else {
        val primaryTabs = listOf(
            Triple(StudioTab.DASHBOARD, "الرئيسية", Icons.Default.Dashboard),
            Triple(StudioTab.BOOKINGS, "الحجوزات", Icons.Default.Event),
            Triple(StudioTab.CRM, "الزبائن", Icons.Default.People),
            Triple(StudioTab.BARCODES, "باركود 128", Icons.Default.QrCode),
            Triple(StudioTab.FINANCE, "المالية", Icons.Default.Paid)
        )

        NavigationBar(
            containerColor = BackgroundSecondary,
            contentColor = TextPrimary,
            tonalElevation = 8.dp,
            modifier = Modifier
                .border(width = 0.5.dp, color = SurfaceBorder)
                .navigationBarsPadding()
                .testTag("studio_bottom_nav_bar")
        ) {
            primaryTabs.forEach { (tab, label, icon) ->
                val isSelected = currentTab == tab
                NavigationBarItem(
                    selected = isSelected,
                    onClick = { onTabSelected(tab) },
                    icon = {
                        Icon(
                            imageVector = icon,
                            contentDescription = label,
                            modifier = Modifier.size(20.dp)
                        )
                    },
                    label = {
                        Text(
                            text = label,
                            fontSize = 10.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                        )
                    },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = BackgroundDark,
                        selectedTextColor = PrimaryGold,
                        indicatorColor = PrimaryGold,
                        unselectedIconColor = TextSecondary,
                        unselectedTextColor = TextMuted
                    )
                )
            }
        }
    }
}
