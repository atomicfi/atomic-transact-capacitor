package com.atomicfi.transact

import financial.atomic.transact.Config
import org.junit.Assert.assertEquals
import org.junit.Test

class PresentationStyleTest {

    @Test
    fun formSheetMapsToFormSheet() {
        assertEquals(
            Config.PresentationStyle.FORM_SHEET,
            TransactPluginPlugin.parsePresentationStyle("formSheet")
        )
    }

    @Test
    fun fullScreenMapsToFullScreen() {
        assertEquals(
            Config.PresentationStyle.FULL_SCREEN,
            TransactPluginPlugin.parsePresentationStyle("fullScreen")
        )
    }

    @Test
    fun missingStyleDefaultsToFormSheet() {
        assertEquals(
            Config.PresentationStyle.FORM_SHEET,
            TransactPluginPlugin.parsePresentationStyle(null)
        )
    }

    @Test
    fun unknownStyleDefaultsToFormSheet() {
        assertEquals(
            Config.PresentationStyle.FORM_SHEET,
            TransactPluginPlugin.parsePresentationStyle("pageSheet")
        )
    }
}
