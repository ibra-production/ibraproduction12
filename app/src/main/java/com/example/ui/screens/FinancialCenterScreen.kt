package com.example.ui.screens

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
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AttachMoney
import androidx.compose.material.icons.filled.Paid
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.TransactionEntity
import com.example.ui.StudioViewModel
import com.example.ui.components.LuxuryMetricCard
import com.example.ui.components.SectionHeader
import com.example.ui.theme.BackgroundDark
import com.example.ui.theme.DangerRed
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
fun FinancialCenterScreen(viewModel: StudioViewModel) {
    val metrics by viewModel.dashboardMetrics.collectAsState()
    val transactions by viewModel.transactions.collectAsState()

    var showAddDialog by remember { mutableStateOf(false) }
    var selectedFilter by remember { mutableStateOf("ALL") }

    val filteredTransactions = remember(transactions, selectedFilter) {
        when (selectedFilter) {
            "INCOME" -> transactions.filter { it.type == "INCOME" }
            "EXPENSE" -> transactions.filter { it.type == "EXPENSE" }
            else -> transactions
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header
            item {
                Text(
                    text = "المركز المالي والمحاسبة (Financial Center)",
                    color = PrimaryGold,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 10.dp)
                )
                Text(
                    text = "متابعة المداخيل، المصاريف، أرباح المشاريع، وديون الزبائن بالدينار الجزائري (د.ج)",
                    color = TextSecondary,
                    fontSize = 12.sp
                )
            }

            // Financial Summary 4 Cards
            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        LuxuryMetricCard(
                            title = "المبالغ المحصلة (Total In)",
                            value = "${String.format("%,.0f", metrics.totalReceived)} دج",
                            subtitle = "تسبيقات ودفعات نهائية",
                            icon = Icons.Default.TrendingUp,
                            iconTint = SuccessGreen,
                            modifier = Modifier.weight(1f)
                        )
                        LuxuryMetricCard(
                            title = "المصاريف التشغيلية (Total Out)",
                            value = "${String.format("%,.0f", metrics.totalExpenses)} دج",
                            subtitle = "أطقم، ألبومات ومعدات",
                            icon = Icons.Default.TrendingDown,
                            iconTint = DangerRed,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        LuxuryMetricCard(
                            title = "صافي الأرباح (Net Profit)",
                            value = "${String.format("%,.0f", metrics.netProfit)} دج",
                            subtitle = "الأرباح الصافية الحالية",
                            icon = Icons.Default.Paid,
                            iconTint = PrimaryGold,
                            modifier = Modifier.weight(1f)
                        )
                        LuxuryMetricCard(
                            title = "ديون غير محصلة (Debts)",
                            value = "${String.format("%,.0f", metrics.totalOutstandingDebt)} دج",
                            subtitle = "مستحقات قيد التسديد",
                            icon = Icons.Default.AttachMoney,
                            iconTint = WarningOrange,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            // Filter Tabs
            item {
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    val tabs = listOf(
                        "ALL" to "جميع المعاملات (${transactions.size})",
                        "INCOME" to "المداخيل فقط (${transactions.count { it.type == "INCOME" }})",
                        "EXPENSE" to "المصاريف فقط (${transactions.count { it.type == "EXPENSE" }})"
                    )
                    items(tabs) { (key, label) ->
                        val isSelected = selectedFilter == key
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(if (isSelected) PrimaryGold else SurfaceCard)
                                .border(1.dp, if (isSelected) PrimaryGold else SurfaceBorder, RoundedCornerShape(20.dp))
                                .clickable { selectedFilter = key }
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

            // Transactions History List
            item {
                SectionHeader(title = "سجل العمليات المالية والمحاسبية")
            }

            items(filteredTransactions) { tx ->
                val isIncome = tx.type == "INCOME"
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp)),
                    colors = CardDefaults.cardColors(containerColor = SurfaceCard)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .clip(CircleShape)
                                    .background(if (isIncome) SuccessGreen.copy(alpha = 0.15f) else DangerRed.copy(alpha = 0.15f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = if (isIncome) Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                                    contentDescription = null,
                                    tint = if (isIncome) SuccessGreen else DangerRed,
                                    modifier = Modifier.size(20.dp)
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column {
                                Text(
                                    text = tx.title,
                                    color = TextPrimary,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "${tx.category} • ${tx.date} • ${tx.recordedBy}",
                                    color = TextSecondary,
                                    fontSize = 11.sp
                                )
                                if (tx.description.isNotBlank()) {
                                    Text(
                                        text = tx.description,
                                        color = TextMuted,
                                        fontSize = 11.sp
                                    )
                                }
                            }
                        }

                        Text(
                            text = "${if (isIncome) "+" else "-"}${String.format("%,.0f", tx.amount)} د.ج",
                            color = if (isIncome) SuccessGreen else DangerRed,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }

        // Add Transaction Floating Action Button
        FloatingActionButton(
            onClick = { showAddDialog = true },
            containerColor = PrimaryGold,
            contentColor = BackgroundDark,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(20.dp)
                .testTag("add_transaction_fab")
        ) {
            Icon(Icons.Default.Add, contentDescription = "Add Transaction")
        }
    }

    // Add Transaction Dialog
    if (showAddDialog) {
        AddTransactionDialog(
            onDismiss = { showAddDialog = false },
            onConfirm = { type, cat, amount, title, desc, code, name, date ->
                viewModel.addTransaction(
                    type = type,
                    category = cat,
                    amount = amount,
                    title = title,
                    description = desc,
                    clientCode = code,
                    clientName = name,
                    date = date
                )
                showAddDialog = false
            }
        )
    }
}

@Composable
private fun AddTransactionDialog(
    onDismiss: () -> Unit,
    onConfirm: (
        type: String,
        category: String,
        amount: Double,
        title: String,
        description: String,
        clientCode: String,
        clientName: String,
        date: String
    ) -> Unit
) {
    var type by remember { mutableStateOf("INCOME") }
    var category by remember { mutableStateOf("DEPOSIT") }
    var title by remember { mutableStateOf("") }
    var amount by remember { mutableStateOf("") }
    var clientCode by remember { mutableStateOf("") }
    var clientName by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var date by remember { mutableStateOf("2026-11-01") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text("تسجيل معاملة مالية جديدة", color = PrimaryGold, fontSize = 17.sp, fontWeight = FontWeight.Bold)
        },
        text = {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                item {
                    // Type Selector (Income / Expense)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(SurfaceCard, RoundedCornerShape(10.dp))
                            .padding(4.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (type == "INCOME") SuccessGreen else Color.Transparent)
                                .clickable { type = "INCOME" }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("مدخول (Income)", color = if (type == "INCOME") Color.White else TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (type == "EXPENSE") DangerRed else Color.Transparent)
                                .clickable { type = "EXPENSE" }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("مصروف (Expense)", color = if (type == "EXPENSE") Color.White else TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                item {
                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text("بيان المعاملة (العنوان)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                item {
                    OutlinedTextField(
                        value = amount,
                        onValueChange = { amount = it },
                        label = { Text("المبلغ بالدينار الجزائري (د.ج)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                item {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = clientCode,
                            onValueChange = { clientCode = it },
                            label = { Text("كود العريس (اختياري)") },
                            singleLine = true,
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = date,
                            onValueChange = { date = it },
                            label = { Text("التاريخ") },
                            singleLine = true,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                item {
                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        label = { Text("التفاصيل والملاحظات") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val parsedAmount = amount.toDoubleOrNull() ?: 0.0
                    if (title.isNotBlank() && parsedAmount > 0) {
                        onConfirm(type, category, parsedAmount, title, description, clientCode, clientName, date)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryGold, contentColor = BackgroundDark)
            ) {
                Text("حفظ المعاملة", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            OutlinedButton(onClick = onDismiss) {
                Text("إلغاء")
            }
        },
        containerColor = SurfaceElevated
    )
}
