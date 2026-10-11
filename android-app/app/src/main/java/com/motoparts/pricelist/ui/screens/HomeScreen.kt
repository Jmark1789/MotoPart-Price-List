package com.motoparts.pricelist.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.motoparts.pricelist.model.MotorPart
import com.motoparts.pricelist.ui.components.PartDialog
import com.motoparts.pricelist.ui.theme.*
import java.text.NumberFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    parts: List<MotorPart>,
    onSavePart: (MotorPart) -> Unit,
    onDeletePart: (String) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedBrand by remember { mutableStateOf("ALL") }
    var partToEdit by remember { mutableStateOf<MotorPart?>(null) }
    var showDialog by remember { mutableStateOf(false) }

    val brands = remember(parts) {
        listOf("ALL") + parts.map { it.brand }.distinct().sorted()
    }

    val filteredParts = remember(parts, searchQuery, selectedBrand) {
        parts.filter { part ->
            val matchesQuery = searchQuery.isBlank() ||
                    part.partNumber.contains(searchQuery, ignoreCase = true) ||
                    part.itemName.contains(searchQuery, ignoreCase = true) ||
                    part.brand.contains(searchQuery, ignoreCase = true)

            val matchesBrand = selectedBrand == "ALL" || part.brand.equals(selectedBrand, ignoreCase = true)
            matchesQuery && matchesBrand
        }
    }

    val currencyFormatter = remember {
        NumberFormat.getCurrencyInstance(Locale("en", "PH")).apply {
            maximumFractionDigits = 2
            minimumFractionDigits = 2
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            "MOTOPARTS PRICELIST",
                            fontWeight = FontWeight.Bold,
                            color = AmberPrimary,
                            fontSize = 18.sp
                        )
                        Text(
                            "${parts.size} Catalog Items",
                            color = TextMuted,
                            fontSize = 12.sp
                        )
                    }
                },
                actions = {
                    Button(
                        onClick = {
                            partToEdit = null
                            showDialog = true
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Add", tint = Color.Black)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Add Part", color = Color.Black, fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = SurfaceDark
                )
            )
        },
        containerColor = BackgroundDark
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(12.dp))

            // Search input
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search part #, item name, or brand...", color = TextMuted) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = TextMuted) },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = AmberPrimary,
                    unfocusedBorderColor = SurfaceLightDark,
                    focusedContainerColor = SurfaceDark,
                    unfocusedContainerColor = SurfaceDark
                ),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Brand Filter Chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                brands.forEach { brandName ->
                    val isSelected = selectedBrand == brandName
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isSelected) AmberPrimary else SurfaceLightDark)
                            .clickable { selectedBrand = brandName }
                            .padding(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = brandName,
                            color = if (isSelected) Color.Black else TextPrimary,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Parts List
            if (filteredParts.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No motor parts found matching criteria", color = TextMuted)
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(filteredParts, key = { it.id }) { part ->
                        PartCard(
                            part = part,
                            currencyFormatter = currencyFormatter,
                            onEdit = {
                                partToEdit = part
                                showDialog = true
                            },
                            onDelete = {
                                onDeletePart(part.id)
                            }
                        )
                    }
                    item {
                        Spacer(modifier = Modifier.height(24.dp))
                    }
                }
            }
        }
    }

    if (showDialog) {
        PartDialog(
            initialPart = partToEdit,
            onDismiss = { showDialog = false },
            onSave = { saved ->
                onSavePart(saved)
                showDialog = false
            }
        )
    }
}

@Composable
fun PartCard(
    part: MotorPart,
    currencyFormatter: NumberFormat,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceDark)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Brand Badge (Always Uppercase)
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(AmberPrimary.copy(alpha = 0.15f))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = part.brand,
                        color = AmberPrimary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Row {
                    IconButton(onClick = onEdit, modifier = Modifier.size(28.dp)) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit", tint = TextMuted, modifier = Modifier.size(18.dp))
                    }
                    Spacer(modifier = Modifier.width(4.dp))
                    IconButton(onClick = onDelete, modifier = Modifier.size(28.dp)) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete", tint = RedRose.copy(alpha = 0.8f), modifier = Modifier.size(18.dp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = part.itemName,
                color = TextPrimary,
                fontWeight = FontWeight.SemiBold,
                fontSize = 15.sp
            )

            Text(
                text = "Part #: ${part.partNumber}",
                color = TextMuted,
                fontSize = 12.sp
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(SurfaceLightDark)
                    .padding(horizontal = 10.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("SRP PRICE", color = TextMuted, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text(
                        currencyFormatter.format(part.srpPrice),
                        color = AmberPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                }

                Column {
                    Text("SHOP PRICE", color = TextMuted, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text(
                        currencyFormatter.format(part.shopPrice),
                        color = TextPrimary,
                        fontWeight = FontWeight.Medium,
                        fontSize = 14.sp
                    )
                }

                Column(horizontalAlignment = Alignment.End) {
                    Text("PROFIT MARGIN", color = TextMuted, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text(
                        "+${currencyFormatter.format(part.profit)} (${String.format(Locale.US, "%.1f", part.marginPercent)}%)",
                        color = GreenEmerald,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 12.sp
                    )
                }
            }
        }
    }
}
