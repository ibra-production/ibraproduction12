package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.barcode.Code128Encoder
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("IBRA PRODUCTION STUDIO", appName)
  }

  @Test
  fun `code 128 barcode generation and validation`() {
    val barcode = Code128Encoder.generateNextBarcode(0, 2026)
    assertEquals("IBR-2026-0001", barcode)
    assertTrue(Code128Encoder.isValidIbraBarcode(barcode))

    val modules = Code128Encoder.encodeToModules(barcode)
    assertTrue("Barcode must generate valid bit pattern", modules.isNotEmpty())
  }
}
