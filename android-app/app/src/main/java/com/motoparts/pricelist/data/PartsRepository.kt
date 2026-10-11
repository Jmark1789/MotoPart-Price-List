package com.motoparts.pricelist.data

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.motoparts.pricelist.model.MotorPart
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class PartsRepository(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("motoparts_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)

    private val initialParts = listOf(
        MotorPart("mp-001", "BRM-110C74010", "Brembo RCS 19 Corsa Corta Radial Master Cylinder", "BREMBO", 21500.0, 18200.0, now()),
        MotorPart("mp-002", "AKR-S-Y7R5-HEGEHT", "Akrapovic Racing Line Titanium Full Exhaust System", "AKRAPOVIC", 64500.0, 54000.0, now()),
        MotorPart("mp-003", "OHL-KA463", "Ohlins TTX GP Rear Monoshock Absorber", "OHLINS", 82000.0, 69000.0, now()),
        MotorPart("mp-004", "NGK-6289", "NGK Laser Iridium Spark Plug CR9EIA-9", "NGK", 750.0, 480.0, now()),
        MotorPart("mp-005", "DID-525ZVMX-120GG", "DID 525 ZVM-X Super Street Gold Chain 120L", "D.I.D", 9400.0, 7500.0, now()),
        MotorPart("mp-006", "EBC-FA447HH", "EBC Double-H Sintered Front Brake Pads", "EBC BRAKES", 2750.0, 1950.0, now()),
        MotorPart("mp-007", "KN-BM-1019", "K&N High-Flow Performance Air Filter", "K&N", 4200.0, 3100.0, now()),
        MotorPart("mp-008", "VTX-RS217K", "Vortex V3 2.0 Adjustable Billet Rearsets", "VORTEX", 24500.0, 20000.0, now()),
        MotorPart("mp-009", "MTL-104118", "Motul 300V Factory Line 10W-40 Synthetic 4T (4L)", "MOTUL", 4950.0, 3800.0, now()),
        MotorPart("mp-010", "DNS-FP-9941", "Denso High Output Fuel Pump Module 255 LPH", "DENSO", 10800.0, 8400.0, now()),
        MotorPart("mp-011", "RNG-CP0442BL", "R&G Aero Crash Protectors & Frame Sliders", "R&G RACING", 7200.0, 5600.0, now()),
        MotorPart("mp-012", "MCH-RD6-1207017", "Michelin Road 6 Front Sport-Touring Tire 120/70 ZR17", "MICHELIN", 11200.0, 8900.0, now()),
        MotorPart("mp-013", "SHW-SK43BPF", "Showa 43mm BPF Fork Oil & Dust Seal Rebuild Kit", "SHOWA", 2900.0, 2100.0, now()),
        MotorPart("mp-014", "CD-PB-7-B", "Custom Dynamics ProBEAM LED 7-Inch Headlight", "CUSTOM DYNAMICS", 19500.0, 15800.0, now()),
        MotorPart("mp-015", "WSC-PK1944", "Wiseco Pro-Lite Forged High-Compression Piston Kit", "WISECO", 13700.0, 10800.0, now()),
        MotorPart("mp-016", "ASV-BRF310-SK", "ASV F3 Unbreakable Folding Brake & Clutch Levers", "ASV", 9900.0, 7800.0, now())
    )

    fun getParts(): List<MotorPart> {
        val json = prefs.getString("parts_list", null) ?: return initialParts
        return try {
            val type = object : TypeToken<List<MotorPart>>() {}.type
            gson.fromJson<List<MotorPart>>(json, type).map {
                it.copy(brand = it.brand.uppercase(Locale.ROOT))
            }
        } catch (e: Exception) {
            initialParts
        }
    }

    fun saveParts(parts: List<MotorPart>) {
        val uppercaseParts = parts.map { it.copy(brand = it.brand.uppercase(Locale.ROOT)) }
        val json = gson.toJson(uppercaseParts)
        prefs.edit().putString("parts_list", json).apply()
    }

    private fun now(): String = dateFormat.format(Date())
}
