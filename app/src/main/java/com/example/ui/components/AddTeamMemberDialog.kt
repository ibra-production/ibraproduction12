package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.data.model.TeamMemberEntity
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.BackgroundSecondary
import com.example.ui.theme.LightGold
import com.example.ui.theme.PrimaryGold
import com.example.ui.theme.SurfaceBorder
import com.example.ui.theme.SurfaceCard
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary

data class CategoryOption(
    val key: String,
    val nameAr: String,
    val emoji: String,
    val isDefaultPrivacy: Boolean = false
)

val CATEGORY_OPTIONS = listOf(
    CategoryOption("PHOTO_MEN", "فوتوغراف رجال", "📸"),
    CategoryOption("PHOTO_WOMEN", "فوتوغراف نساء", "🌸", isDefaultPrivacy = true),
    CategoryOption("NO_PHOTO", "ممنوع التصوير", "🛡️", isDefaultPrivacy = true),
    CategoryOption("KHYALA", "خيالة", "🐎"),
    CategoryOption("CARABINA", "كرابيلا", "💥"),
    CategoryOption("DJ_MEN", "ديجي رجال", "🎧"),
    CategoryOption("DJ_WOMEN", "ديجي نساء", "🎶", isDefaultPrivacy = true),
    CategoryOption("LUXURY_CARS", "سيارات فخمة", "🚘"),
    CategoryOption("DECORATION", "ديكورات", "🏛️"),
    CategoryOption("WEDDING_HALLS", "قاعات أفراح", "🏰"),
    CategoryOption("CHEF_MEN", "طباخ", "👨‍🍳"),
    CategoryOption("CHEF_WOMEN", "طباخة", "👩‍🍳", isDefaultPrivacy = true),
    CategoryOption("SERVEUSE", "سارفوز", "☕", isDefaultPrivacy = true),
    CategoryOption("NAILS_ARTIST", "صانعة أظافر", "💅", isDefaultPrivacy = true),
    CategoryOption("GATEAU_MAKER", "صانعة القاطو", "🍯")
)

@Composable
fun AddTeamMemberDialog(
    onDismiss: () -> Unit,
    onConfirm: (TeamMemberEntity) -> Unit
) {
    var selectedCategory by remember { mutableStateOf(CATEGORY_OPTIONS[0]) }
    var name by remember { mutableStateOf("") }
    var role by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("05") }
    var email by remember { mutableStateOf("") }
    var wilayaName by remember { mutableStateOf("16 - الجزائر (Alger)") }
    var specialty by remember { mutableStateOf("") }
    var equipment by remember { mutableStateOf("") }
    var feeText by remember { mutableStateOf("35000") }
    var isStrictPrivacy by remember { mutableStateOf(false) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.96f)
                .clip(RoundedCornerShape(20.dp))
                .border(1.dp, PrimaryGold.copy(alpha = 0.5f), RoundedCornerShape(20.dp))
                .testTag("add_team_member_dialog"),
            color = BackgroundDark
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(20.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onDismiss) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "إغلاق",
                            tint = TextSecondary
                        )
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.PersonAdd,
                            contentDescription = null,
                            tint = PrimaryGold,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "فتح ملف مهني جديد للطاقم",
                            color = PrimaryGold,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.width(32.dp))
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Category Selection
                Text(
                    text = "اختر التخصص / الحرفة المطلوبة (15 تخصص جزائري معتمد):",
                    color = LightGold,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                LazyRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(CATEGORY_OPTIONS) { opt ->
                        val isSel = opt.key == selectedCategory.key
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(10.dp))
                                .background(if (isSel) PrimaryGold.copy(alpha = 0.25f) else SurfaceCard)
                                .border(
                                    1.dp,
                                    if (isSel) PrimaryGold else SurfaceBorder,
                                    RoundedCornerShape(10.dp)
                                )
                                .clickable {
                                    selectedCategory = opt
                                    if (opt.isDefaultPrivacy) isStrictPrivacy = true
                                }
                                .padding(horizontal = 12.dp, vertical = 7.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = opt.emoji, fontSize = 14.sp)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = opt.nameAr,
                                color = if (isSel) PrimaryGold else TextSecondary,
                                fontSize = 11.sp,
                                fontWeight = if (isSel) FontWeight.Bold else FontWeight.Medium
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Input Fields
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("الاسم الكامل (أو اسم الفرقة / الوكالة)", fontSize = 12.sp) },
                    placeholder = { Text("مثال: أمين لعمارة / فرقة أولاد نايل", fontSize = 12.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryGold,
                        unfocusedBorderColor = SurfaceBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    )
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = role,
                    onValueChange = { role = it },
                    label = { Text("المسمى الوظيفي والدور المحدد", fontSize = 12.sp) },
                    placeholder = { Text("مثال: مصور رئيسي / قائد الفرقة / مسؤولة أمن الصالة", fontSize = 12.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryGold,
                        unfocusedBorderColor = SurfaceBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    )
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text("رقم الهاتف (واتساب)", fontSize = 12.sp) },
                        modifier = Modifier.weight(1f),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrimaryGold,
                            unfocusedBorderColor = SurfaceBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        )
                    )

                    OutlinedTextField(
                        value = feeText,
                        onValueChange = { feeText = it },
                        label = { Text("سعر الحفلة (د.ج)", fontSize = 12.sp) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrimaryGold,
                            unfocusedBorderColor = SurfaceBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        )
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = wilayaName,
                    onValueChange = { wilayaName = it },
                    label = { Text("الولاية ومقر النشاط", fontSize = 12.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryGold,
                        unfocusedBorderColor = SurfaceBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    )
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = equipment,
                    onValueChange = { equipment = it },
                    label = { Text("العتاد والتجهيزات المعتمدة", fontSize = 12.sp) },
                    placeholder = { Text("نوع الكاميرات، مواصفات الصوت، سيارات الموكب، الأواني...", fontSize = 11.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryGold,
                        unfocusedBorderColor = SurfaceBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    )
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = specialty,
                    onValueChange = { specialty = it },
                    label = { Text("تفاصيل الخدمة والمهام", fontSize = 12.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimaryGold,
                        unfocusedBorderColor = SurfaceBorder,
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary
                    )
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Privacy Checkbox
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .background(SurfaceCard)
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(10.dp))
                        .clickable { isStrictPrivacy = !isStrictPrivacy }
                        .padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = isStrictPrivacy,
                        onCheckedChange = { isStrictPrivacy = it },
                        colors = CheckboxDefaults.colors(checkedColor = PrimaryGold)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Column {
                        Text(
                            text = "طاقم نسوي خاص / خاضع لبروتوكول حماية الخصوصية ومنع التصوير",
                            color = TextPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "مخصص لقاعات النساء، تصديرة العروس، حارسات الهواتف والمضيفات",
                            color = TextMuted,
                            fontSize = 10.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Submit Button
                Button(
                    onClick = {
                        if (name.isNotBlank()) {
                            val fee = feeText.toDoubleOrNull() ?: 35000.0
                            val code = "DOS-${selectedCategory.key.take(3)}-${(100..999).random()}"
                            val newMember = TeamMemberEntity(
                                dossierNumber = code,
                                name = name.trim(),
                                categoryKey = selectedCategory.key,
                                categoryNameAr = selectedCategory.nameAr,
                                role = role.ifBlank { selectedCategory.nameAr },
                                phone = phone.trim(),
                                email = email.trim(),
                                wilayaName = wilayaName.trim(),
                                specialty = specialty.trim(),
                                equipmentDetails = equipment.trim(),
                                feePerEvent = fee,
                                totalEarned = 0.0,
                                totalPaid = 0.0,
                                remainingBalance = 0.0,
                                assignedEventsCount = 0,
                                isStrictPrivacy = isStrictPrivacy,
                                notes = "عضو وطاقم معتمد جديد في شبكة استوديو إبرا 2026."
                            )
                            onConfirm(newMember)
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("submit_add_team_member_button"),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = "فتح وتثبيت الملف المهني",
                        color = BackgroundDark,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}
