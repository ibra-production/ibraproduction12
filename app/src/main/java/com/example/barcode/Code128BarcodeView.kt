package com.example.barcode

import android.content.Context
import android.content.Intent
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Print
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.GoldSecondary
import com.example.ui.theme.PrimaryGold
import com.example.ui.theme.SurfaceCard
import com.example.ui.theme.TextPrimary

@Composable
fun Code128BarcodeView(
    barcodeText: String,
    groomName: String = "",
    wilaya: String = "",
    modifier: Modifier = Modifier,
    showActions: Boolean = true
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    val modules = remember(barcodeText) {
        Code128Encoder.encodeToModules(barcodeText)
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(SurfaceCard, RoundedCornerShape(16.dp))
            .border(1.dp, PrimaryGold.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Studio Luxury Badge
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(
                imageVector = Icons.Default.Verified,
                contentDescription = null,
                tint = PrimaryGold,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "IBRA PRODUCTION • STUDIO LABEL",
                color = PrimaryGold,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
        }

        if (groomName.isNotBlank()) {
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = groomName,
                color = TextPrimary,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center
            )
        }

        if (wilaya.isNotBlank()) {
            Text(
                text = wilaya,
                color = PrimaryGold.copy(alpha = 0.8f),
                fontSize = 11.sp,
                textAlign = TextAlign.Center
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Printable / Optical high contrast white plate for barcode
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White, RoundedCornerShape(8.dp))
                .border(2.dp, GoldSecondary, RoundedCornerShape(8.dp))
                .padding(vertical = 12.dp, horizontal = 12.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                // Code 128 Canvas
                Canvas(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(70.dp)
                ) {
                    val totalModules = modules.size
                    if (totalModules > 0) {
                        val moduleWidth = size.width / totalModules
                        val barHeight = size.height

                        for (i in modules.indices) {
                            if (modules[i]) {
                                drawRect(
                                    color = Color.Black,
                                    topLeft = Offset(x = i * moduleWidth, y = 0f),
                                    size = Size(width = moduleWidth + 0.5f, height = barHeight)
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Human readable monospaced text
                Text(
                    text = barcodeText,
                    color = Color.Black,
                    fontFamily = FontFamily.Monospace,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 3.sp
                )
            }
        }

        if (showActions) {
            Spacer(modifier = Modifier.height(14.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = {
                        clipboardManager.setText(AnnotatedString(barcodeText))
                    },
                    modifier = Modifier
                        .weight(1f)
                        .testTag("copy_barcode_btn"),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PrimaryGold),
                    border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(PrimaryGold.copy(alpha = 0.6f)))
                ) {
                    Icon(Icons.Default.ContentCopy, contentDescription = "Copy", modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("نسخ", fontSize = 12.sp)
                }

                OutlinedButton(
                    onClick = {
                        shareBarcode(context, barcodeText, groomName)
                    },
                    modifier = Modifier
                        .weight(1f)
                        .testTag("share_barcode_btn"),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PrimaryGold),
                    border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(PrimaryGold.copy(alpha = 0.6f)))
                ) {
                    Icon(Icons.Default.Share, contentDescription = "Share", modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("مشاركة", fontSize = 12.sp)
                }
            }
        }
    }
}

private fun shareBarcode(context: Context, barcode: String, groom: String) {
    val sendIntent: Intent = Intent().apply {
        action = Intent.ACTION_SEND
        putExtra(
            Intent.EXTRA_TEXT,
            "IBRA PRODUCTION STUDIO - رمز العريس الرسمي:\nالكود: $barcode\nالعريس: $groom\nhttps://ibraprod.online"
        )
        type = "text/plain"
    }
    val shareIntent = Intent.createChooser(sendIntent, "مشاركة باركود العريس")
    context.startActivity(shareIntent)
}
