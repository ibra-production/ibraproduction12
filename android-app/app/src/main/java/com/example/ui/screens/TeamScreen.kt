package com.example.ui.screens

import android.content.Intent
import android.net.Uri
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.FolderOpen
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.TeamMemberEntity
import com.example.ui.StudioViewModel
import com.example.ui.components.AddTeamMemberDialog
import com.example.ui.components.CATEGORY_OPTIONS
import com.example.ui.components.CategoryOption
import com.example.ui.components.TeamMemberDossierDialog
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.BackgroundSecondary
import com.example.ui.theme.LightGold
import com.example.ui.theme.PrimaryGold
import com.example.ui.theme.SuccessGreen
import com.example.ui.theme.SurfaceBorder
import com.example.ui.theme.SurfaceCard
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import com.example.ui.theme.WarningOrange
import java.text.NumberFormat
import java.util.Locale

@Composable
fun TeamScreen(viewModel: StudioViewModel) {
    val context = LocalContext.current
    val teamMembers by viewModel.teamMembers.collectAsState()
    val selectedMemberDossier by viewModel.selectedMemberDossier.collectAsState()
    val selectedCategoryFilter by viewModel.selectedCategoryFilter.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var showAddDialog by remember { mutableStateOf(false) }

    val currencyFormat = NumberFormat.getNumberInstance(Locale.FRANCE)

    // Filter members by category and search
    val filteredMembers = teamMembers.filter { member ->
        val matchesCategory = (selectedCategoryFilter == "ALL") || (member.categoryKey == selectedCategoryFilter)
        val query = searchQuery.trim().lowercase(Locale.ROOT)
        val matchesSearch = query.isEmpty() ||
                member.name.lowercase(Locale.ROOT).contains(query) ||
                member.categoryNameAr.lowercase(Locale.ROOT).contains(query) ||
                member.phone.contains(query) ||
                member.wilayaName.lowercase(Locale.ROOT).contains(query) ||
                member.dossierNumber.lowercase(Locale.ROOT).contains(query)
        matchesCategory && matchesSearch
    }

    // Stats calculations
    val totalCount = teamMembers.size
    val availableCount = teamMembers.count { it.status == "AVAILABLE" }
    val privacyCount = teamMembers.count { it.isStrictPrivacy }
    val totalDues = teamMembers.sumOf { it.remainingBalance }

    val allFilterOptions = listOf(
        CategoryOption("ALL", "الكل (جميع التخصصات)", "✨")
    ) + CATEGORY_OPTIONS

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
            .padding(horizontal = 14.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Top Banner Title
        item {
            Column(modifier = Modifier.padding(top = 10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "واجهة فريق العمل والشركاء • Équipe & Prestataires",
                            color = PrimaryGold,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "الملفات المهنية للمصورين، الفرق الفلكلورية، الطهاة، وموردي الأعراس",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )
                    }

                    Button(
                        onClick = { showAddDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.testTag("open_add_member_dialog_button")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = null,
                            tint = BackgroundDark,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "فتح ملف جديد",
                            color = BackgroundDark,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }

        // Summary Metric Cards
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Total Crew
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .background(SurfaceCard, RoundedCornerShape(12.dp))
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp))
                        .padding(10.dp)
                ) {
                    Column {
                        Text("إجمالي الطاقم", color = TextMuted, fontSize = 10.sp)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text("$totalCount ملف", color = PrimaryGold, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Available
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .background(SurfaceCard, RoundedCornerShape(12.dp))
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp))
                        .padding(10.dp)
                ) {
                    Column {
                        Text("متاحون للعمل", color = TextMuted, fontSize = 10.sp)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text("$availableCount متاح", color = SuccessGreen, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Strict Privacy
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .background(SurfaceCard, RoundedCornerShape(12.dp))
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp))
                        .padding(10.dp)
                ) {
                    Column {
                        Text("طواقم نسوية 🔒", color = TextMuted, fontSize = 10.sp)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text("$privacyCount ملف", color = LightGold, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Total Remaining Balance
                Box(
                    modifier = Modifier
                        .weight(1.2f)
                        .background(SurfaceCard, RoundedCornerShape(12.dp))
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp))
                        .padding(10.dp)
                ) {
                    Column {
                        Text("مستحقات معلقة", color = TextMuted, fontSize = 10.sp)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            "${currencyFormat.format(totalDues)} د.ج",
                            color = WarningOrange,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Horizontal Category Filter Strip (All 15 Algerian Wedding Specialties)
        item {
            Column {
                Text(
                    text = "تصفية التخصصات الحرفية (${allFilterOptions.size}):",
                    color = LightGold,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 6.dp)
                )

                LazyRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(allFilterOptions) { cat ->
                        val isSelected = selectedCategoryFilter == cat.key
                        val countInCat = if (cat.key == "ALL") totalCount else teamMembers.count { it.categoryKey == cat.key }
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) PrimaryGold.copy(alpha = 0.25f) else SurfaceCard)
                                .border(
                                    1.dp,
                                    if (isSelected) PrimaryGold else SurfaceBorder,
                                    RoundedCornerShape(12.dp)
                                )
                                .clickable { viewModel.setCategoryFilter(cat.key) }
                                .padding(horizontal = 12.dp, vertical = 7.dp)
                                .testTag("filter_tab_${cat.key}"),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = cat.emoji, fontSize = 13.sp)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "${cat.nameAr} ($countInCat)",
                                color = if (isSelected) PrimaryGold else TextSecondary,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                            )
                        }
                    }
                }
            }
        }

        // Search Bar
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        tint = PrimaryGold
                    )
                },
                placeholder = {
                    Text(
                        text = "بحث بالاسم، رقم الهاتف، الولاية أو رقم الملف...",
                        color = TextMuted,
                        fontSize = 12.sp
                    )
                },
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("team_search_input"),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimaryGold,
                    unfocusedBorderColor = SurfaceBorder,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary,
                    focusedContainerColor = SurfaceCard,
                    unfocusedContainerColor = SurfaceCard
                ),
                shape = RoundedCornerShape(12.dp)
            )
        }

        // Section header with count
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "الملفات المهنية المسجلة (${filteredMembers.size}):",
                    color = PrimaryGold,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )

                if (selectedCategoryFilter != "ALL") {
                    Text(
                        text = "إلغاء التصفية",
                        color = TextMuted,
                        fontSize = 11.sp,
                        modifier = Modifier.clickable { viewModel.setCategoryFilter("ALL") }
                    )
                }
            }
        }

        // Team Member Dossier Cards
        if (filteredMembers.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 30.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "لا توجد ملفات مهنية تطابق معايير البحث.",
                        color = TextMuted,
                        fontSize = 13.sp
                    )
                }
            }
        } else {
            items(filteredMembers) { member ->
                MemberDossierSummaryCard(
                    member = member,
                    currencyFormat = currencyFormat,
                    onOpenDossier = { viewModel.selectMemberDossier(member) },
                    onCall = {
                        try {
                            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${member.phone.replace(" ", "")}"))
                            context.startActivity(intent)
                        } catch (_: Exception) {}
                    },
                    onWhatsApp = {
                        try {
                            val clean = member.phone.replace("[^0-9]".toRegex(), "")
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://api.whatsapp.com/send?phone=$clean"))
                            context.startActivity(intent)
                        } catch (_: Exception) {}
                    }
                )
            }
        }

        item {
            Spacer(modifier = Modifier.height(40.dp))
        }
    }

    // Detailed Member Dossier Modal Dialog
    selectedMemberDossier?.let { member ->
        TeamMemberDossierDialog(
            member = member,
            onDismiss = { viewModel.selectMemberDossier(null) },
            onRecordPayout = { amount, note ->
                viewModel.recordTeamPayout(member, amount, note)
            },
            onAssignWedding = { weddingLabel ->
                viewModel.assignMemberToWedding(member, weddingLabel)
            },
            onDeleteMember = {
                viewModel.deleteTeamMember(member)
            }
        )
    }

    // Add New Member / Vendor Dialog
    if (showAddDialog) {
        AddTeamMemberDialog(
            onDismiss = { showAddDialog = false },
            onConfirm = { newMember ->
                viewModel.addTeamMember(newMember)
                showAddDialog = false
            }
        )
    }
}

@Composable
private fun MemberDossierSummaryCard(
    member: TeamMemberEntity,
    currencyFormat: NumberFormat,
    onOpenDossier: () -> Unit,
    onCall: () -> Unit,
    onWhatsApp: () -> Unit
) {
    val isAvailable = member.status == "AVAILABLE"

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
            .clickable { onOpenDossier() }
            .testTag("team_card_${member.dossierNumber}"),
        colors = CardDefaults.cardColors(containerColor = SurfaceCard)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            // Header Row: Avatar, Name, Category Pill, Status
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .clip(CircleShape)
                        .background(PrimaryGold.copy(alpha = 0.16f))
                        .border(1.dp, PrimaryGold.copy(alpha = 0.6f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = member.name.take(2),
                        color = PrimaryGold,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = member.name,
                            color = TextPrimary,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )

                        Text(
                            text = member.dossierNumber,
                            color = LightGold,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }

                    Spacer(modifier = Modifier.height(2.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .background(PrimaryGold.copy(alpha = 0.15f), RoundedCornerShape(6.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = member.categoryNameAr,
                                color = PrimaryGold,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Spacer(modifier = Modifier.width(8.dp))

                        Box(
                            modifier = Modifier
                                .background(
                                    if (isAvailable) SuccessGreen.copy(alpha = 0.15f) else WarningOrange.copy(alpha = 0.15f),
                                    RoundedCornerShape(6.dp)
                                )
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = if (isAvailable) "متاح" else "في حفل حالياً",
                                color = if (isAvailable) SuccessGreen else WarningOrange,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            // Role and Specialty Description
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = member.role,
                color = TextSecondary,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )

            if (member.isStrictPrivacy) {
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(6.dp))
                        .background(PrimaryGold.copy(alpha = 0.1f))
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Security,
                        contentDescription = null,
                        tint = PrimaryGold,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "🔒 طاقم نسوي خاص / خاضع لبروتوكول حظر التصوير وحماية الخصوصية",
                        color = LightGold,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            // Financial & Wilaya indicators
            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(BackgroundSecondary, RoundedCornerShape(8.dp))
                    .padding(horizontal = 10.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = null,
                        tint = TextMuted,
                        modifier = Modifier.size(13.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = member.wilayaName.take(15),
                        color = TextSecondary,
                        fontSize = 11.sp
                    )
                }

                Text(
                    text = "سعر الحفلة: ${currencyFormat.format(member.feePerEvent)} د.ج",
                    color = PrimaryGold,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = null,
                        tint = LightGold,
                        modifier = Modifier.size(13.dp)
                    )
                    Spacer(modifier = Modifier.width(3.dp))
                    Text(
                        text = "${member.rating} (${member.assignedEventsCount} حفل)",
                        color = TextMuted,
                        fontSize = 10.sp
                    )
                }
            }

            // Action Buttons
            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Call
                OutlinedButton(
                    onClick = onCall,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PrimaryGold),
                    border = ButtonDefaults.outlinedButtonBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SurfaceBorder)),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Call,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("اتصال", fontSize = 11.sp)
                }

                // WhatsApp
                OutlinedButton(
                    onClick = onWhatsApp,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = SuccessGreen),
                    border = ButtonDefaults.outlinedButtonBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SurfaceBorder)),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("💬 واتساب", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }

                // Open Dossier
                Button(
                    onClick = onOpenDossier,
                    modifier = Modifier.weight(1.4f),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.FolderOpen,
                        contentDescription = null,
                        tint = BackgroundDark,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("فتح الملف", color = BackgroundDark, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                }
            }
        }
    }
}
