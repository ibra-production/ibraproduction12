package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val IbraDarkColorScheme = darkColorScheme(
    primary = PrimaryGold,
    onPrimary = BackgroundDark,
    primaryContainer = GoldSecondary,
    onPrimaryContainer = TextPrimary,
    secondary = LightGold,
    onSecondary = BackgroundDark,
    secondaryContainer = SurfaceElevated,
    onSecondaryContainer = TextPrimary,
    tertiary = AccentCyan,
    onTertiary = BackgroundDark,
    background = BackgroundDark,
    onBackground = TextPrimary,
    surface = BackgroundSecondary,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceCard,
    onSurfaceVariant = TextSecondary,
    outline = SurfaceBorder,
    error = DangerRed,
    onError = TextPrimary,
    errorContainer = DangerRedContainer,
    onErrorContainer = TextPrimary
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false, // Preserve dedicated luxury brand palette
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = IbraDarkColorScheme,
        typography = Typography,
        content = content
    )
}
