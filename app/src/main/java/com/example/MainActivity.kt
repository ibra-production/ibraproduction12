package com.example

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.firebase.*
import com.example.ui.screens.*
import com.example.ui.theme.*

enum class CustomerTab(val label: String) {
    HOME("الرئيسية"),
    SERVICES("الخدمات"),
    BOOKING("حجز موعد"),
    TRACKING("تتبع الحجز"),
    PORTFOLIO("المعرض")
}

class MainActivity : ComponentActivity() {
    private val repository = IbraFirebaseRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                CustomerAppRoot(repository = repository)
            }
        }
    }
}

@Composable
fun CustomerAppRoot(repository: IbraFirebaseRepository) {
    val context = LocalContext.current
    var currentTab by remember { mutableStateOf(CustomerTab.HOME) }
    var userPhone by remember { mutableStateOf("") }
    var preselectedPkg by remember { mutableStateOf<StudioPackage?>(null) }
    var preselectedSrv by remember { mutableStateOf<StudioService?>(null) }

    // Live real-time streams from shared Firestore
    val offers by repository.observeOffers().collectAsState(initial = emptyList())
    val portfolio by repository.observePortfolio().collectAsState(initial = emptyList())
    val services by repository.observeServices().collectAsState(initial = emptyList())
    val packages by repository.observePackages().collectAsState(initial = emptyList())

    Scaffold(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark),
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(BackgroundSecondary)
                    .statusBarsPadding()
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "IBRA PRODUCTION",
                            color = Color.White,
                            fontWeight = FontWeight.Black,
                            fontSize = 16.sp,
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = "الإنتاج والتصوير السينمائي للأعراس",
                            color = LightGold,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    // Optional external link to official website
                    IconButton(
                        onClick = {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://ibraprod.online"))
                            context.startActivity(intent)
                        }
                    ) {
                        Icon(
                            Icons.Default.Language,
                            contentDescription = "الموقع الرسمي",
                            tint = PrimaryGold
                        )
                    }
                }
            }
        },
        bottomBar = {
            NavigationBar(
                containerColor = BackgroundSecondary,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = currentTab == CustomerTab.HOME,
                    onClick = { currentTab = CustomerTab.HOME },
                    icon = { Icon(Icons.Default.Home, contentDescription = null) },
                    label = { Text(CustomerTab.HOME.label, fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.Black,
                        selectedTextColor = LightGold,
                        indicatorColor = PrimaryGold,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    )
                )

                NavigationBarItem(
                    selected = currentTab == CustomerTab.SERVICES,
                    onClick = { currentTab = CustomerTab.SERVICES },
                    icon = { Icon(Icons.Default.CameraAlt, contentDescription = null) },
                    label = { Text(CustomerTab.SERVICES.label, fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.Black,
                        selectedTextColor = LightGold,
                        indicatorColor = PrimaryGold,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    )
                )

                NavigationBarItem(
                    selected = currentTab == CustomerTab.BOOKING,
                    onClick = { currentTab = CustomerTab.BOOKING },
                    icon = { Icon(Icons.Default.EventAvailable, contentDescription = null) },
                    label = { Text(CustomerTab.BOOKING.label, fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.Black,
                        selectedTextColor = LightGold,
                        indicatorColor = PrimaryGold,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    )
                )

                NavigationBarItem(
                    selected = currentTab == CustomerTab.TRACKING,
                    onClick = { currentTab = CustomerTab.TRACKING },
                    icon = { Icon(Icons.Default.QrCode, contentDescription = null) },
                    label = { Text(CustomerTab.TRACKING.label, fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.Black,
                        selectedTextColor = LightGold,
                        indicatorColor = PrimaryGold,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    )
                )

                NavigationBarItem(
                    selected = currentTab == CustomerTab.PORTFOLIO,
                    onClick = { currentTab = CustomerTab.PORTFOLIO },
                    icon = { Icon(Icons.Default.PhotoLibrary, contentDescription = null) },
                    label = { Text(CustomerTab.PORTFOLIO.label, fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.Black,
                        selectedTextColor = LightGold,
                        indicatorColor = PrimaryGold,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    )
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(BackgroundDark)
        ) {
            when (currentTab) {
                CustomerTab.HOME -> CustomerHomeScreen(
                    offers = offers,
                    portfolio = portfolio,
                    onNavigateToBooking = { currentTab = CustomerTab.BOOKING },
                    onNavigateToServices = { currentTab = CustomerTab.SERVICES },
                    onNavigateToPortfolio = { currentTab = CustomerTab.PORTFOLIO },
                    onNavigateToTracking = { currentTab = CustomerTab.TRACKING }
                )

                CustomerTab.SERVICES -> CustomerServicesScreen(
                    services = services,
                    packages = packages,
                    onSelectPackageForBooking = { pkg ->
                        preselectedPkg = pkg
                        preselectedSrv = null
                        currentTab = CustomerTab.BOOKING
                    },
                    onSelectServiceForBooking = { srv ->
                        preselectedSrv = srv
                        preselectedPkg = null
                        currentTab = CustomerTab.BOOKING
                    }
                )

                CustomerTab.BOOKING -> CustomerBookingScreen(
                    repository = repository,
                    preselectedPackage = preselectedPkg,
                    preselectedService = preselectedSrv,
                    onBookingCreatedSuccess = { bookingId, phone ->
                        userPhone = phone
                        preselectedPkg = null
                        preselectedSrv = null
                        currentTab = CustomerTab.TRACKING
                    }
                )

                CustomerTab.TRACKING -> CustomerTrackingScreen(
                    repository = repository,
                    initialPhone = userPhone,
                    onNavigateToNewBooking = { currentTab = CustomerTab.BOOKING }
                )

                CustomerTab.PORTFOLIO -> CustomerPortfolioScreen(
                    portfolio = portfolio
                )
            }
        }
    }
}
