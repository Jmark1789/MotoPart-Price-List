package com.motoparts.pricelist.model

data class MotorPart(
    val id: String,
    val partNumber: String,
    val itemName: String,
    val brand: String, // Always uppercase
    val srpPrice: Double,
    val shopPrice: Double,
    val updatedAt: String
) {
    val profit: Double
        get() = srpPrice - shopPrice

    val marginPercent: Double
        get() = if (srpPrice > 0) ((srpPrice - shopPrice) / srpPrice) * 100 else 0.0
}
