package com.example.ui.screens

import android.content.Context
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Fingerprint
import androidx.compose.material.icons.filled.Key
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.QrCode
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
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
import com.example.ui.AppMode
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.ui.StudioViewModel
import com.example.ui.theme.AccentCyan
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

enum class AuthMode {
    GOOGLE_STUDIO,
    CREW_PIN,
    GROOM_PORTAL
}

@Composable
fun AuthScreen(
    viewModel: StudioViewModel,
    onAuthSuccess: () -> Unit
) {
    val context = LocalContext.current
    val appMode by viewModel.appMode.collectAsState()
    var selectedMode by remember(appMode) {
        mutableStateOf(if (appMode == AppMode.CLIENT_PORTAL) AuthMode.GROOM_PORTAL else AuthMode.GOOGLE_STUDIO)
    }

    // PIN Mode state
    var pinInput by remember { mutableStateOf("") }
    var pinError by remember { mutableStateOf<String?>(null) }

    // Groom Barcode mode state
    var barcodeInput by remember { mutableStateOf("IBR-2026-0001") }
    var groomPhoneInput by remember { mutableStateOf("0779000833") }
    var groomError by remember { mutableStateOf<String?>(null) }

    val logoBrandColor = Color(0xFFE58025) // Warm Studio Brand Orange from new logo
    val logoGradientDark = Color(0xFF380C03)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(
                        Color(0xFF4A1005),
                        Color(0xFF1E0702),
                        BackgroundDark,
                        BackgroundDark
                    )
                )
            )
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            item {
                Spacer(modifier = Modifier.height(20.dp))

                // Official Brand Logo Display
                Box(
                    modifier = Modifier
                        .size(150.dp)
                        .clip(RoundedCornerShape(24.dp))
                        .background(Color.Black)
                        .border(1.5.dp, PrimaryGold.copy(alpha = 0.8f), RoundedCornerShape(24.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.ibra_logo),
                        contentDescription = "IBRA PRODUCTION Studio Official Logo",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = "IBRA PRODUCTION STUDIO",
                    color = TextPrimary,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )

                Text(
                    text = "PHOTO • VIDEO • CONTENT CREATION",
                    color = logoBrandColor,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )

                Spacer(modifier = Modifier.height(6.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(SurfaceCard.copy(alpha = 0.8f))
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(20.dp))
                        .clickable {
                            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:0779000833"))
                            context.startActivity(intent)
                        }
                        .padding(horizontal = 12.dp, vertical = 4.dp)
                ) {
                    Icon(Icons.Default.Call, contentDescription = null, tint = logoBrandColor, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "0779000833",
                        color = TextPrimary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))
            }

            // Auth Mode Selector
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(SurfaceCard)
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(14.dp))
                        .padding(4.dp)
                ) {
                    AuthModeTab(
                        title = "Google Studio",
                        selected = selectedMode == AuthMode.GOOGLE_STUDIO,
                        onClick = { selectedMode = AuthMode.GOOGLE_STUDIO },
                        modifier = Modifier.weight(1f)
                    )
                    AuthModeTab(
                        title = "رمز PIN للطاقم",
                        selected = selectedMode == AuthMode.CREW_PIN,
                        onClick = { selectedMode = AuthMode.CREW_PIN },
                        modifier = Modifier.weight(1f)
                    )
                    AuthModeTab(
                        title = "بوابة العريس",
                        selected = selectedMode == AuthMode.GROOM_PORTAL,
                        onClick = { selectedMode = AuthMode.GROOM_PORTAL },
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))
            }

            // Mode Content Card
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, PrimaryGold.copy(alpha = 0.4f), RoundedCornerShape(18.dp)),
                    colors = CardDefaults.cardColors(containerColor = SurfaceElevated.copy(alpha = 0.95f))
                ) {
                    Column(
                        modifier = Modifier.padding(18.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        when (selectedMode) {
                            AuthMode.GOOGLE_STUDIO -> {
                                Text(
                                    text = "تسجيل الدخول الرسمي للاستوديو",
                                    color = TextPrimary,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "باستخدام حساب Google المسجل ومصادقة Credential Manager",
                                    color = TextSecondary,
                                    fontSize = 11.sp,
                                    textAlign = TextAlign.Center
                                )

                                Spacer(modifier = Modifier.height(16.dp))

                                // Google Sign-In Button
                                Button(
                                    onClick = {
                                        viewModel.signInWithGoogle(
                                            email = "contact@ibraprod.online",
                                            displayName = "Ibra Production (Director)"
                                        )
                                        onAuthSuccess()
                                    },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = Color.White,
                                        contentColor = Color.Black
                                    ),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(48.dp)
                                        .testTag("google_signin_button"),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .size(22.dp)
                                                .background(PrimaryGold, CircleShape),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text("G", color = Color.Black, fontWeight = FontWeight.Black, fontSize = 13.sp)
                                        }
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Text(
                                            text = "الدخول بواسطة Google Account",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(12.dp))

                                Text(
                                    text = "🔒 مؤمن بتشفير Firebase Authentication وشهادات SHA-256",
                                    color = TextMuted,
                                    fontSize = 10.sp
                                )
                            }

                            AuthMode.CREW_PIN -> {
                                Text(
                                    text = "دخول طاقم التصوير والمخرج",
                                    color = TextPrimary,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "أدخل رمز PIN السريع للدخول أثناء التغطيات الخارجية",
                                    color = TextSecondary,
                                    fontSize = 11.sp
                                )

                                Spacer(modifier = Modifier.height(14.dp))

                                OutlinedTextField(
                                    value = pinInput,
                                    onValueChange = {
                                        if (it.length <= 6) {
                                            pinInput = it
                                            pinError = null
                                        }
                                    },
                                    label = { Text("رمز PIN (4 أو 6 أرقام)") },
                                    visualTransformation = PasswordVisualTransformation(),
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                                    leadingIcon = { Icon(Icons.Default.Key, contentDescription = null, tint = PrimaryGold) },
                                    singleLine = true,
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedTextColor = TextPrimary,
                                        unfocusedTextColor = TextPrimary,
                                        focusedBorderColor = PrimaryGold,
                                        unfocusedBorderColor = SurfaceBorder
                                    ),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .testTag("pin_input_field")
                                )

                                if (pinError != null) {
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(text = pinError!!, color = DangerRed, fontSize = 11.sp)
                                }

                                Spacer(modifier = Modifier.height(14.dp))

                                Button(
                                    onClick = {
                                        val success = viewModel.signInWithPin(pinInput.ifBlank { "0000" })
                                        if (success) {
                                            onAuthSuccess()
                                        } else {
                                            pinError = "يرجى إدخال 4 أرقام على الأقل"
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold, contentColor = BackgroundDark),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(46.dp)
                                        .testTag("pin_submit_button"),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Text("دخول سريع للطاقم", fontWeight = FontWeight.Bold)
                                }
                            }

                            AuthMode.GROOM_PORTAL -> {
                                Text(
                                    text = "بوابة العريس (Groom Portal)",
                                    color = TextPrimary,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "متابعة تجهيز فلاشة USB وعقد الزفاف الموثق",
                                    color = TextSecondary,
                                    fontSize = 11.sp
                                )

                                Spacer(modifier = Modifier.height(14.dp))

                                OutlinedTextField(
                                    value = barcodeInput,
                                    onValueChange = { barcodeInput = it },
                                    label = { Text("رمز الباركود (مثل: IBR-2026-0001)") },
                                    leadingIcon = { Icon(Icons.Default.QrCode, contentDescription = null, tint = PrimaryGold) },
                                    singleLine = true,
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedTextColor = TextPrimary,
                                        unfocusedTextColor = TextPrimary,
                                        focusedBorderColor = PrimaryGold,
                                        unfocusedBorderColor = SurfaceBorder
                                    ),
                                    modifier = Modifier.fillMaxWidth()
                                )

                                Spacer(modifier = Modifier.height(10.dp))

                                OutlinedTextField(
                                    value = groomPhoneInput,
                                    onValueChange = { groomPhoneInput = it },
                                    label = { Text("رقم الهاتف المسجل") },
                                    leadingIcon = { Icon(Icons.Default.Call, contentDescription = null, tint = PrimaryGold) },
                                    singleLine = true,
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedTextColor = TextPrimary,
                                        unfocusedTextColor = TextPrimary,
                                        focusedBorderColor = PrimaryGold,
                                        unfocusedBorderColor = SurfaceBorder
                                    ),
                                    modifier = Modifier.fillMaxWidth()
                                )

                                if (groomError != null) {
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(text = groomError!!, color = DangerRed, fontSize = 11.sp)
                                }

                                Spacer(modifier = Modifier.height(14.dp))

                                Button(
                                    onClick = {
                                        viewModel.signInAsGroom(barcodeInput, groomPhoneInput) { success, error ->
                                            if (success) {
                                                onAuthSuccess()
                                            } else {
                                                groomError = error
                                            }
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold, contentColor = BackgroundDark),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(46.dp),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Text("عرض ملف العريس والفلاشة", fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
            }

            // Direct Studio Bypass / Demo Entry Button
            item {
                OutlinedButton(
                    onClick = {
                        viewModel.enterAsGuestOrDemo()
                        onAuthSuccess()
                    },
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = LightGold),
                    border = ButtonDefaults.outlinedButtonBorder.copy(
                        brush = androidx.compose.ui.graphics.SolidColor(PrimaryGold.copy(alpha = 0.6f))
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                        .testTag("demo_entry_button"),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("الدخول المباشر كمدير الاستوديو (Direct Admin Access)", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
private fun AuthModeTab(
    title: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(if (selected) PrimaryGold else Color.Transparent)
            .clickable { onClick() }
            .padding(vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = title,
            color = if (selected) BackgroundDark else TextSecondary,
            fontSize = 11.sp,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium
        )
    }
}
