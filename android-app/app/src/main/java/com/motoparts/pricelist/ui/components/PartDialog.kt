package com.motoparts.pricelist.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.motoparts.pricelist.model.MotorPart
import com.motoparts.pricelist.ui.theme.AmberPrimary
import java.util.Date
import java.text.SimpleDateFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PartDialog(
    initialPart: MotorPart? = null,
    onDismiss: () -> Unit,
    onSave: (MotorPart) -> Unit
) {
    var partNumber by remember { mutableStateOf(initialPart?.partNumber ?: "") }
    var itemName by remember { mutableStateOf(initialPart?.itemName ?: "") }
    var brand by remember { mutableStateOf(initialPart?.brand ?: "") }
    var srpPriceText by remember { mutableStateOf(initialPart?.srpPrice?.let { String.format(Locale.US, "%.2f", it) } ?: "") }
    var shopPriceText by remember { mutableStateOf(initialPart?.shopPrice?.let { String.format(Locale.US, "%.2f", it) } ?: "") }

    var errorMessage by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(if (initialPart == null) "Add New Motor Part" else "Edit Motor Part")
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedTextField(
                    value = partNumber,
                    onValueChange = { partNumber = it },
                    label = { Text("Part Number *") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                OutlinedTextField(
                    value = itemName,
                    onValueChange = { itemName = it },
                    label = { Text("Item Name *") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )

                // Brand input: ALWAYS BIG LETTER (Uppercase)
                OutlinedTextField(
                    value = brand,
                    onValueChange = { brand = it.uppercase(Locale.ROOT) },
                    label = { Text("Brand * (ALWAYS CAPITAL)") },
                    placeholder = { Text("E.G. BREMBO, AKRAPOVIC") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        capitalization = KeyboardCapitalization.Characters
                    )
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = srpPriceText,
                        onValueChange = { srpPriceText = it },
                        label = { Text("SRP (₱)") },
                        modifier = Modifier.weight(1f),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                    )
                    OutlinedTextField(
                        value = shopPriceText,
                        onValueChange = { shopPriceText = it },
                        label = { Text("Shop Price (₱)") },
                        modifier = Modifier.weight(1f),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                    )
                }

                if (errorMessage != null) {
                    Text(
                        text = errorMessage ?: "",
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        },
        confirmButton = {
            Button(
                colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                onClick = {
                    if (partNumber.isBlank() || itemName.isBlank() || brand.isBlank()) {
                        errorMessage = "Please fill in all required fields."
                        return@Button
                    }
                    val srp = srpPriceText.toDoubleOrNull() ?: 0.0
                    val shop = shopPriceText.toDoubleOrNull() ?: 0.0

                    val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
                    val updated = MotorPart(
                        id = initialPart?.id ?: "part-${System.currentTimeMillis()}",
                        partNumber = partNumber.trim(),
                        itemName = itemName.trim(),
                        brand = brand.trim().uppercase(Locale.ROOT),
                        srpPrice = srp,
                        shopPrice = shop,
                        updatedAt = dateFormat.format(Date())
                    )
                    onSave(updated)
                }
            ) {
                Text(if (initialPart == null) "Add Item" else "Save Changes")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
