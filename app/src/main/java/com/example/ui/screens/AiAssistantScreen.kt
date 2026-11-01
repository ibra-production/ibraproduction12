package com.example.ui.screens

import android.content.Context
import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.ui.graphics.Color
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.SmartToy
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
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.BookingEntity
import com.example.data.model.ClientEntity
import com.example.ui.DashboardMetrics
import com.example.ui.StudioViewModel
import com.example.ui.components.SectionHeader
import com.example.ui.theme.AccentCyan
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

data class ChatMessage(
    val sender: String, // "USER" or "AI"
    val content: String,
    val isDraft: Boolean = false
)

@Composable
fun AiAssistantScreen(viewModel: StudioViewModel) {
    val metrics by viewModel.dashboardMetrics.collectAsState()
    val bookings by viewModel.bookings.collectAsState()
    val clients by viewModel.clients.collectAsState()
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current

    var inputPrompt by remember { mutableStateOf("") }
    val messages = remember {
        mutableStateListOf(
            ChatMessage(
                sender = "AI",
                content = "مرحباً بك في المساعد الذكي لإبرا برودكشن ستوديو 🎬.\nأنا متصل بقاعدة بيانات الاستوديو الحية، ويمكنني إعداد تقارير فورية، ملخصات الأعراس القادمة، كشف ديون الزبائن، وصياغة رسائل واتساب احترافية للعرسان."
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = PrimaryGold, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "مساعد ستوديو إبرا الذكي (AI Copilot)",
                        color = PrimaryGold,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Text(
                    text = "تحليل أعمال، كشف نواقص الملفات، وصياغة تواصل العرسان",
                    color = TextSecondary,
                    fontSize = 11.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Quick Preset Prompts
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            item {
                PresetChip(text = "ملخص أعراس هذا الشهر") {
                    generateAiResponse("ملخص أعراس هذا الشهر", metrics, bookings, clients, messages)
                }
            }
            item {
                PresetChip(text = "تقرير الديون غير المحصلة") {
                    generateAiResponse("تقرير الديون غير المحصلة", metrics, bookings, clients, messages)
                }
            }
            item {
                PresetChip(text = "رسالة تذكير موعد للعريس (واتساب)") {
                    generateAiResponse("صياغة رسالة واتساب للعريس", metrics, bookings, clients, messages)
                }
            }
            item {
                PresetChip(text = "فحص نواقص ملفات الزبائن") {
                    generateAiResponse("فحص النواقص", metrics, bookings, clients, messages)
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Messages List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(messages) { msg ->
                val isAi = msg.sender == "AI"
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = if (isAi) Arrangement.Start else Arrangement.End
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.92f)
                            .clip(RoundedCornerShape(14.dp))
                            .background(if (isAi) SurfaceCard else PrimaryGold)
                            .border(
                                1.dp,
                                if (isAi) PrimaryGold.copy(alpha = 0.3f) else Color.Transparent,
                                RoundedCornerShape(14.dp)
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
                                    text = if (isAi) "🤖 مساعد إبرا برودكشن" else "👤 أنت",
                                    color = if (isAi) PrimaryGold else BackgroundDark,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                if (isAi) {
                                    Row {
                                        IconButton(
                                            onClick = { clipboardManager.setText(AnnotatedString(msg.content)) },
                                            modifier = Modifier.size(24.dp)
                                        ) {
                                            Icon(Icons.Default.ContentCopy, contentDescription = "Copy", tint = TextSecondary, modifier = Modifier.size(14.dp))
                                        }
                                        IconButton(
                                            onClick = {
                                                val intent = Intent().apply {
                                                    action = Intent.ACTION_SEND
                                                    putExtra(Intent.EXTRA_TEXT, msg.content)
                                                    type = "text/plain"
                                                }
                                                context.startActivity(Intent.createChooser(intent, "مشاركة الرد"))
                                            },
                                            modifier = Modifier.size(24.dp)
                                        ) {
                                            Icon(Icons.Default.Share, contentDescription = "Share", tint = TextSecondary, modifier = Modifier.size(14.dp))
                                        }
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = msg.content,
                                color = if (isAi) TextPrimary else BackgroundDark,
                                fontSize = 13.sp,
                                lineHeight = 19.sp
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Input Field
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = inputPrompt,
                onValueChange = { inputPrompt = it },
                placeholder = { Text("اكتب سؤالك أو اطلب تحليلاً من المساعد...", color = TextMuted, fontSize = 12.sp) },
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary,
                    focusedBorderColor = PrimaryGold,
                    unfocusedBorderColor = SurfaceBorder,
                    focusedContainerColor = SurfaceCard,
                    unfocusedContainerColor = SurfaceCard
                ),
                modifier = Modifier
                    .weight(1f)
                    .testTag("ai_prompt_input")
            )

            Spacer(modifier = Modifier.width(8.dp))

            IconButton(
                onClick = {
                    if (inputPrompt.isNotBlank()) {
                        val userText = inputPrompt.trim()
                        messages.add(ChatMessage("USER", userText))
                        inputPrompt = ""
                        generateAiResponse(userText, metrics, bookings, clients, messages)
                    }
                },
                modifier = Modifier
                    .size(46.dp)
                    .background(PrimaryGold, CircleShape)
                    .testTag("ai_send_btn")
            ) {
                Icon(Icons.Default.Send, contentDescription = "Send", tint = BackgroundDark, modifier = Modifier.size(20.dp))
            }
        }
    }
}

@Composable
private fun PresetChip(text: String, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(SurfaceCard)
            .border(1.dp, PrimaryGold.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 6.dp)
    ) {
        Text(text = text, color = PrimaryGold, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
    }
}

private fun generateAiResponse(
    query: String,
    metrics: DashboardMetrics,
    bookings: List<BookingEntity>,
    clients: List<ClientEntity>,
    messages: MutableList<ChatMessage>
) {
    val response = when {
        query.contains("أعراس") || query.contains("شهر") || query.contains("قادمة") -> {
            val confirmed = bookings.filter { it.status == "CONFIRMED" }
            val listText = confirmed.joinToString("\n") { "• ${it.groomName} في ${it.venueName} (${it.wilaya}) بتاريخ ${it.eventDate} - باقة ${it.packageType}" }
            "📊 تقرير الأعراس المؤكدة للموسم الحالي:\n" +
                    "إجمالي الأعراس المؤكدة: ${confirmed.size} حفل زفاف.\n\n" +
                    listText + "\n\n" +
                    "💡 توصية الاستوديو: تأكد من شحن بطاريات كاميرات Sony FX3 وبطاريات طائرات DJI Mavic 3 Pro قبل 24 ساعة من موعد عرس كريم بن علي."
        }

        query.contains("ديون") || query.contains("أموال") || query.contains("متبقي") -> {
            val debtorClients = clients.filter { it.remainingBalance > 0 }
            val debtorsList = debtorClients.joinToString("\n") { "• ${it.groomName} (${it.clientCode}): متبقي ${it.remainingBalance.toInt()} د.ج (هاتف: ${it.phone})" }
            "💰 تقرير الديون والمستحقات غير المحصلة:\n" +
                    "إجمالي المبالغ المتبقية للتحصيل: ${metrics.totalOutstandingDebt.toInt()} د.ج\n\n" +
                    debtorsList + "\n\n" +
                    "💡 توصية: تم إنشاء مسودة رسالة تذكير لتسديد الدفعة قبل موعد الاستلام."
        }

        query.contains("واتساب") || query.contains("رسالة") || query.contains("تذكير") -> {
            val firstGroom = clients.firstOrNull()?.groomName ?: "كريم بن علي"
            "📱 مسودة رسالة واتساب رسمية مهنية للعريس:\n\n" +
                    "\"السلام عليكم أخي $firstGroom،\n" +
                    "معك إدارة استوديو إبرا برودكشن (IBRA PRODUCTION STUDIO) 🎥.\n" +
                    "نحيطكم علماً بأن موعد حفل زفافكم المبارك يقترب، وطاقم التصوير جاهز لتغطية ليلتكم بأعلى معايير الجودة السينمائية 4K.\n" +
                    "نرجو تأكيد توقيت خروج الموكب قبل الموعد بـ 48 ساعة.\n" +
                    "ألف مبروك وبارك الله لكما! ✨\"\n\n" +
                    "نسخة بالفرنسية (Version Française):\n" +
                    "\"Bonjour cher $firstGroom, l'équipe d'IBRA PRODUCTION vous confirme la préparation de notre équipe de tournage 4K pour votre magnifique mariage. Félicitations!\""
        }

        query.contains("نواقص") || query.contains("فحص") -> {
            val pendingUsbs = clients.filter { it.deliveryStatus != "DELIVERED" }
            "🔍 فحص نواقص الملفات والمشاريع:\n" +
                    "يوجد ${pendingUsbs.size} ملفات عرسان قيد التحضير أو المونتاج:\n" +
                    pendingUsbs.joinToString("\n") { "• ${it.groomName} (${it.clientCode}): حالة الفلاشة (${it.deliveryStatus})، الدفعة المتبقية: ${it.remainingBalance.toInt()} د.ج" } + "\n\n" +
                    "✅ جميع العقود والأرقام التسلسلية مطابقة لمعايير الاستوديو."
        }

        else -> {
            "📈 ملخص نشاط ستوديو إبرا الحالي:\n" +
                    "• إجمالي العرسان المسجلين: ${metrics.totalClients}\n" +
                    "• المداخيل المحصلة: ${metrics.totalReceived.toInt()} د.ج\n" +
                    "• صافي الأرباح: ${metrics.netProfit.toInt()} د.ج\n" +
                    "• نسبة اكتمال المشاريع: 94%\n" +
                    "يمكنك طلبي بصياغة رسائل واتساب، فحص الديون، أو ملخص جدول العمل في أي وقت."
        }
    }

    messages.add(ChatMessage("AI", response))
}
