package com.example.barcode

/**
 * High precision linear Code 128 (Subset B) encoder according to ISO/IEC 15417.
 * Generates true linear barcode bit patterns for scanner reading and printing.
 */
object Code128Encoder {

    // Code 128 patterns for indices 0 to 106 (widths of alternating bars & spaces)
    private val PATTERNS = arrayOf(
        "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", // 0-9
        "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", // 10-19
        "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", // 20-29
        "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", // 30-39
        "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", // 40-49
        "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111", // 50-59
        "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", // 60-69
        "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111", // 70-79
        "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", // 80-89
        "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141", // 90-99
        "114131", "311141", "411131", "211412", "211214", "211232", "2331112"                               // 100-106
    )

    private const val START_CODE_B = 104
    private const val STOP_CODE = 106

    /**
     * Converts a text string (e.g. "IBR-2026-0001") into boolean bits (true = black bar, false = white space).
     * Includes 10 modules of quiet zone on each side, Start B, data, checksum, Stop, and termination bar.
     */
    fun encodeToModules(text: String): List<Boolean> {
        val cleanText = text.trim()
        val indices = mutableListOf<Int>()
        indices.add(START_CODE_B)

        var checksum = START_CODE_B
        for (i in cleanText.indices) {
            val charCode = cleanText[i].code
            val symbolIndex = charCode - 32 // Subset B maps ASCII 32..126 to symbol values 0..94
            if (symbolIndex in 0..94) {
                indices.add(symbolIndex)
                checksum += symbolIndex * (i + 1)
            }
        }
        val checkDigit = checksum % 103
        indices.add(checkDigit)
        indices.add(STOP_CODE)

        val modules = mutableListOf<Boolean>()

        // Left Quiet Zone (10 modules of white)
        repeat(10) { modules.add(false) }

        // Encode each symbol pattern
        for (symbolIndex in indices) {
            val pattern = PATTERNS[symbolIndex]
            var isBar = true
            for (charDigit in pattern) {
                val width = charDigit.digitToInt()
                repeat(width) {
                    modules.add(isBar)
                }
                isBar = !isBar
            }
        }

        // Right Quiet Zone (10 modules of white)
        repeat(10) { modules.add(false) }

        return modules
    }

    /**
     * Validates if a barcode string matches the standard IBRA format (e.g. "IBR-2026-0001")
     */
    fun isValidIbraBarcode(code: String): Boolean {
        val regex = Regex("^IBR-\\d{4}-\\d{4}$")
        return regex.matches(code.trim().uppercase())
    }

    /**
     * Generates the next sequential barcode given the current count
     */
    fun generateNextBarcode(currentMaxNumber: Int, year: Int = 2026): String {
        val nextNumber = currentMaxNumber + 1
        return String.format("IBR-%04d-%04d", year, nextNumber)
    }
}
