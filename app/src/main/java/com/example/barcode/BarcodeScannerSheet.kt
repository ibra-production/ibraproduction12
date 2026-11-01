package com.example.barcode

import android.view.ViewGroup
import androidx.camera.core.CameraSelector
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
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
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FlashOn
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Usb
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.example.data.model.ClientEntity
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.BackgroundSecondary
import com.example.ui.theme.DangerRed
import com.example.ui.theme.GoldSecondary
import com.example.ui.theme.PrimaryGold
import com.example.ui.theme.SuccessGreen
import com.example.ui.theme.SurfaceBorder
import com.example.ui.theme.SurfaceCard
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun BarcodeScannerSheet(
    onDismiss: () -> Unit,
    onBarcodeDetected: (String) -> Unit,
    matchedClient: ClientEntity?,
    onViewClientDetails: (ClientEntity) -> Unit
) {
    var scannedInput by remember { mutableStateOf("") }
    var useCamera by remember { mutableStateOf(false) }
    val cameraPermissionState = rememberPermissionState(android.Manifest.permission.CAMERA)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(BackgroundSecondary, RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Top bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .background(PrimaryGold.copy(alpha = 0.15f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.QrCodeScanner,
                        contentDescription = null,
                        tint = PrimaryGold,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "ماسح الباركود Code 128",
                        color = TextPrimary,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "كاميرا الهاتف أو ماسح USB السلكي / اللاسلكي",
                        color = TextSecondary,
                        fontSize = 11.sp
                    )
                }
            }

            IconButton(onClick = onDismiss, modifier = Modifier.testTag("close_scanner_sheet")) {
                Icon(Icons.Default.Close, contentDescription = "Close", tint = TextSecondary)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Scanner Mode Tabs
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(SurfaceCard, RoundedCornerShape(12.dp))
                .padding(4.dp)
        ) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(8.dp))
                    .background(if (!useCamera) PrimaryGold else Color.Transparent)
                    .clickable { useCamera = false }
                    .padding(vertical = 8.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.Usb,
                        contentDescription = null,
                        tint = if (!useCamera) BackgroundDark else TextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "قارئ USB / يدوي",
                        color = if (!useCamera) BackgroundDark else TextSecondary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(8.dp))
                    .background(if (useCamera) PrimaryGold else Color.Transparent)
                    .clickable {
                        useCamera = true
                        if (!cameraPermissionState.status.isGranted) {
                            cameraPermissionState.launchPermissionRequest()
                        }
                    }
                    .padding(vertical = 8.dp),
                contentAlignment = Alignment.Center
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.CameraAlt,
                        contentDescription = null,
                        tint = if (useCamera) BackgroundDark else TextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "كاميرا الهاتف",
                        color = if (useCamera) BackgroundDark else TextSecondary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        if (useCamera) {
            // Live Camera View
            if (cameraPermissionState.status.isGranted) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .border(1.dp, PrimaryGold.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    CameraPreviewView(onBarcodeDetected = { code ->
                        scannedInput = code
                        onBarcodeDetected(code)
                    })

                    // Reticle overlay
                    Box(
                        modifier = Modifier
                            .size(width = 240.dp, height = 90.dp)
                            .border(2.dp, PrimaryGold, RoundedCornerShape(8.dp))
                    )
                    Text(
                        text = "وجّه الكاميرا نحو خطوط الباركود Code 128",
                        color = PrimaryGold,
                        fontSize = 11.sp,
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .padding(bottom = 8.dp)
                            .background(BackgroundDark.copy(alpha = 0.7f), RoundedCornerShape(4.dp))
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    )
                }
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(140.dp)
                        .background(SurfaceCard, RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("مطلوب إذن الكاميرا للمسح المباشر", color = TextSecondary, fontSize = 13.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = { cameraPermissionState.launchPermissionRequest() },
                            colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold, contentColor = BackgroundDark)
                        ) {
                            Text("منح الإذن الآن")
                        }
                    }
                }
            }
        }

        // USB Scanner / Manual text field
        Spacer(modifier = Modifier.height(12.dp))
        OutlinedTextField(
            value = scannedInput,
            onValueChange = {
                scannedInput = it
                if (it.isNotBlank()) {
                    onBarcodeDetected(it.trim())
                }
            },
            placeholder = { Text("أدخل الكود مثل: IBR-2026-0001", color = TextSecondary.copy(alpha = 0.6f), fontSize = 13.sp) },
            leadingIcon = { Icon(Icons.Default.QrCodeScanner, contentDescription = null, tint = PrimaryGold) },
            trailingIcon = {
                if (scannedInput.isNotBlank()) {
                    IconButton(onClick = {
                        scannedInput = ""
                        onBarcodeDetected("")
                    }) {
                        Icon(Icons.Default.Close, contentDescription = "Clear", tint = TextSecondary)
                    }
                }
            },
            singleLine = true,
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
            keyboardActions = KeyboardActions(onSearch = { onBarcodeDetected(scannedInput.trim()) }),
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
                .testTag("barcode_scanner_input")
        )

        // Quick simulation presets for fast demo/testing
        Spacer(modifier = Modifier.height(10.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            listOf("IBR-2026-0001", "IBR-2026-0002", "IBR-2026-0003", "IBR-2026-0004").forEach { preset ->
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .background(SurfaceCard, RoundedCornerShape(8.dp))
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(8.dp))
                        .clickable {
                            scannedInput = preset
                            onBarcodeDetected(preset)
                        }
                        .padding(vertical = 6.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = preset.substringAfterLast("-"),
                        color = PrimaryGold,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // Matched Client Result Card
        if (matchedClient != null) {
            Spacer(modifier = Modifier.height(16.dp))
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, SuccessGreen, RoundedCornerShape(14.dp)),
                colors = CardDefaults.cardColors(containerColor = SurfaceCard)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SuccessGreen, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("تم التعرف على العريس بنجاح!", color = SuccessGreen, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                        Text(matchedClient.clientCode, color = PrimaryGold, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(matchedClient.groomName, color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Text("العروس: ${matchedClient.brideName} • ${matchedClient.wilayaName}", color = TextSecondary, fontSize = 12.sp)

                    Spacer(modifier = Modifier.height(6.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("الباقة: ${matchedClient.packageName}", color = TextSecondary, fontSize = 12.sp)
                        val debt = matchedClient.remainingBalance
                        Text(
                            if (debt <= 0) "خالص بالكامل (0 د.ج)" else "المتبقي: ${debt.toInt()} د.ج",
                            color = if (debt <= 0) SuccessGreen else DangerRed,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Button(
                        onClick = {
                            onViewClientDetails(matchedClient)
                            onDismiss()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold, contentColor = BackgroundDark),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("open_matched_client_btn")
                    ) {
                        Text("فتح ملف العريس الكامل", fontWeight = FontWeight.Bold)
                    }
                }
            }
        } else if (scannedInput.isNotBlank()) {
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "لم يتم العثور على زبون يحمل هذا الكود ($scannedInput)",
                color = DangerRed,
                fontSize = 12.sp
            )
        }
    }
}

@Composable
private fun CameraPreviewView(onBarcodeDetected: (String) -> Unit) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current

    AndroidView(
        factory = { ctx ->
            val previewView = PreviewView(ctx).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            }
            val cameraProviderFuture = ProcessCameraProvider.getInstance(ctx)
            cameraProviderFuture.addListener({
                val cameraProvider = cameraProviderFuture.get()
                val preview = Preview.Builder().build().also {
                    it.setSurfaceProvider(previewView.surfaceProvider)
                }
                val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
                try {
                    cameraProvider.unbindAll()
                    cameraProvider.bindToLifecycle(lifecycleOwner, cameraSelector, preview)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }, ContextCompat.getMainExecutor(ctx))
            previewView
        },
        modifier = Modifier.fillMaxSize()
    )
}
