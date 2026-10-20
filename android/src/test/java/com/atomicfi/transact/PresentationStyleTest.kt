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
    fun missingStyleDefaultsToFullScreen() {
        assertEquals(
            Config.PresentationStyle.FULL_SCREEN,
            TransactPluginPlugin.parsePresentationStyle(null)
        )
    }

    @Test
    fun unknownStyleDefaultsToFullScreen() {
        assertEquals(
            Config.PresentationStyle.FULL_SCREEN,
            TransactPluginPlugin.parsePresentationStyle("pageSheet")
        )
    }
}
