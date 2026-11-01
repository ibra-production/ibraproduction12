package com.example.ui.screens

import android.content.Context
import android.content.Intent
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.Print
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.ClientEntity
import com.example.ui.StudioViewModel
import com.example.ui.components.SectionHeader
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.GoldSecondary
import com.example.ui.theme.LightGold
import com.example.ui.theme.PrimaryGold
import com.example.ui.theme.SurfaceBorder
import com.example.ui.theme.SurfaceCard
import com.example.ui.theme.SurfaceElevated
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary

enum class DocumentType {
    CONTRACT_ARABIC,
    CONTRACT_FRENCH,
    RECEIPT_PAYMENT,
    DELIVERY_VOUCHER
}

@Composable
fun DocumentsScreen(viewModel: StudioViewModel) {
    val clients by viewModel.clients.collectAsState()
    val context = LocalContext.current

    var selectedDocType by remember { mutableStateOf(DocumentType.CONTRACT_ARABIC) }
    var selectedClient by remember { mutableStateOf(clients.firstOrNull()) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text(
                text = "مركز العقود والوثائق الرسمية • Documents & Contrats",
                color = PrimaryGold,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(top = 10.dp)
            )
            Text(
                text = "توليد عقود الزفاف، وصولات الدفع، واستمارات تسليم الفلاشات باللغتين العربية والفرنسية",
                color = TextSecondary,
                fontSize = 12.sp
            )
        }

        // Document Type Tabs
        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                val types = listOf(
                    DocumentType.CONTRACT_ARABIC to "عقد زفاف (العربية)",
                    DocumentType.CONTRACT_FRENCH to "Contrat Mariage (FR)",
                    DocumentType.RECEIPT_PAYMENT to "وصل دفع وتسبيق",
                    DocumentType.DELIVERY_VOUCHER to "وصل تسليم الفلاشة"
                )
                items(types) { (type, label) ->
                    val isSelected = selectedDocType == type
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isSelected) PrimaryGold else SurfaceCard)
                            .border(1.dp, if (isSelected) PrimaryGold else SurfaceBorder, RoundedCornerShape(20.dp))
                            .clickable { selectedDocType = type }
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = label,
                            color = if (isSelected) BackgroundDark else TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    }
                }
            }
        }

        // Select Client Dropdown / Row
        item {
            SectionHeader(title = "اختيار العريس لطباعة الوثيقة:")
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(clients) { client ->
                    val isSelected = client == selectedClient
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) SurfaceElevated else SurfaceCard)
                            .border(1.dp, if (isSelected) PrimaryGold else SurfaceBorder, RoundedCornerShape(10.dp))
                            .clickable { selectedClient = client }
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        Column {
                            Text(client.groomName, color = if (isSelected) PrimaryGold else TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text(client.clientCode, color = TextMuted, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                        }
                    }
                }
            }
        }

        // Printable Document Sheet Render
        item {
            val c = selectedClient ?: clients.firstOrNull()
            if (c != null) {
                DocumentPaperView(
                    client = c,
                    docType = selectedDocType,
                    onShare = { shareDocument(context, c, selectedDocType) }
                )
            }
        }

        item {
            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}

@Composable
private fun DocumentPaperView(
    client: ClientEntity,
    docType: DocumentType,
    onShare: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(2.dp, GoldSecondary, RoundedCornerShape(12.dp)),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFFCFDFE)) // Clean paper look
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "IBRA PRODUCTION STUDIO",
                        color = Color(0xFF0F172A),
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "STUDIO DE PRODUCTION AUDIOVISUELLE & MARIAGES",
                        color = Color(0xFF64748B),
                        fontSize = 9.sp
                    )
                    Text(
                        text = "Algérie • Tél: +213 550 00 11 22 • www.ibraprod.online",
                        color = Color(0xFF64748B),
                        fontSize = 9.sp
                    )
                }

                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .background(Color(0xFFE5C158), RoundedCornerShape(8.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Verified, contentDescription = null, tint = Color(0xFF050B14), modifier = Modifier.size(22.dp))
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
            Box(modifier = Modifier.fillMaxWidth().height(1.5.dp).background(Color(0xFFE2E8F0)))
            Spacer(modifier = Modifier.height(10.dp))

            // Title
            val titleText = when (docType) {
                DocumentType.CONTRACT_ARABIC -> "عقد تقديم خدمات التصوير والإنتاج السينمائي"
                DocumentType.CONTRACT_FRENCH -> "CONTRAT DE PRESTATION AUDIOVISUELLE ET CINÉMA"
                DocumentType.RECEIPT_PAYMENT -> "وصل استلام دفعة مالية (REÇU DE PAIEMENT)"
                DocumentType.DELIVERY_VOUCHER -> "استمارة تسليم فلاشة العريس (BON DE LIVRAISON USB)"
            }
            Text(
                text = titleText,
                color = Color(0xFF1E293B),
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = "رقم المعاملة: ${client.contractNumber} • كود العريس: ${client.clientCode}",
                color = Color(0xFF64748B),
                fontSize = 10.sp,
                fontFamily = FontFamily.Monospace
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Body
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                DocRow("الطرف الأول (الاستوديو):", "مؤسسة إبرا برودكشن ستوديو (Ibra Production)")
                DocRow("الطرف الثاني (العريس):", client.groomName)
                DocRow("العروس:", client.brideName)
                DocRow("رقم الهاتف:", client.phone)
                DocRow("الولاية ومكان الحفل:", "${client.wilayaName} • ${client.address}")
                DocRow("تاريخ المناسبة:", client.eventDate)
                DocRow("الباقة المختارة:", client.packageName)
                DocRow("السعر الإجمالي المتفق عليه:", "${client.totalPrice.toInt()} د.ج (دينار جزائري)")
                DocRow("المبلغ المسدد:", "${client.paidAmount.toInt()} د.ج")
                DocRow("المتبقي للدفع:", "${client.remainingBalance.toInt()} د.ج")
                DocRow("سيريال الفلاشة USB المخصصة:", client.usbSerial)
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "الشروط والأحكام: يلتزم الاستوديو بتسليم الفلاشة المحمية بهيكلية المجلدات الستة 01 إلى 06 مع الألبوم المطبوع بجودة سينمائية فائقة.",
                color = Color(0xFF64748B),
                fontSize = 10.sp,
                lineHeight = 14.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Signature Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("توقيع العريس (Le Client)", color = Color(0xFF475569), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(24.dp))
                    Text("....................................", color = Color(0xFF94A3B8))
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("ختم وتوقيع إبرا برودكشن", color = Color(0xFF475569), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(24.dp))
                    Text("IBRA PRODUCTION ★", color = Color(0xFFC29B38), fontWeight = FontWeight.Bold, fontSize = 11.sp)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Actions: Print & Share
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = onShare,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0F172A), contentColor = Color(0xFFE5C158)),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("مشاركة الوثيقة")
                }
            }
        }
    }
}

@Composable
private fun DocRow(label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth()) {
        Text(text = label, color = Color(0xFF475569), fontSize = 11.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.width(130.dp))
        Text(text = value, color = Color(0xFF0F172A), fontSize = 11.sp, fontWeight = FontWeight.Bold)
    }
}

private fun shareDocument(context: Context, client: ClientEntity, docType: DocumentType) {
    val text = """
        ★ وثيقة رسمية - IBRA PRODUCTION STUDIO ★
        نوع الوثيقة: $docType
        رقم العقد: ${client.contractNumber}
        كود العريس: ${client.clientCode}
        العريس: ${client.groomName}
        العروس: ${client.brideName}
        التاريخ: ${client.eventDate}
        الباقة: ${client.packageName}
        المبلغ الإجمالي: ${client.totalPrice.toInt()} د.ج
        المبلغ المسدد: ${client.paidAmount.toInt()} د.ج
        المتبقي: ${client.remainingBalance.toInt()} د.ج
        الفلاشة: ${client.usbSerial}
        https://ibraprod.online
    """.trimIndent()

    val intent = Intent().apply {
        action = Intent.ACTION_SEND
        putExtra(Intent.EXTRA_TEXT, text)
        type = "text/plain"
    }
    context.startActivity(Intent.createChooser(intent, "مشاركة الوثيقة"))
}
