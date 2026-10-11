package com.motoparts.pricelist.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val AmberPrimary = Color(0xFFF59E0B)
val AmberDark = Color(0xFFD97706)
val BackgroundDark = Color(0xFF090D16)
val SurfaceDark = Color(0xFF0F172A)
val SurfaceLightDark = Color(0xFF1E293B)
val TextPrimary = Color(0xFFF8FAFC)
val TextMuted = Color(0xFF94A3B8)
val GreenEmerald = Color(0xFF10B981)
val RedRose = Color(0xFFEF4444)

private val DarkColorScheme = darkColorScheme(
    primary = AmberPrimary,
    onPrimary = Color.Black,
    primaryContainer = AmberDark,
    background = BackgroundDark,
    surface = SurfaceDark,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun MotoPartsTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
