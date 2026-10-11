package com.motoparts.pricelist

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.motoparts.pricelist.data.PartsRepository
import com.motoparts.pricelist.model.MotorPart
import com.motoparts.pricelist.ui.screens.HomeScreen
import com.motoparts.pricelist.ui.theme.MotoPartsTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val repository = PartsRepository(applicationContext)

        setContent {
            MotoPartsTheme {
                var parts by remember { mutableStateOf(repository.getParts()) }

                HomeScreen(
                    parts = parts,
                    onSavePart = { savedPart ->
                        val index = parts.indexOfFirst { it.id == savedPart.id }
                        val updated = if (index >= 0) {
                            parts.toMutableList().apply { set(index, savedPart) }
                        } else {
                            listOf(savedPart) + parts
                        }
                        parts = updated
                        repository.saveParts(updated)
                    },
                    onDeletePart = { partId ->
                        val updated = parts.filterNot { it.id == partId }
                        parts = updated
                        repository.saveParts(updated)
                    }
                )
            }
        }
    }
}
