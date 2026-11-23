package com.atomicfi.transact

import financial.atomic.transact.Config
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class HostFrameworkTest {

    @Test
    fun platformKeepsTheWrapperSuffix() {
        val platform = TransactPluginPlugin.platform("1.2.3", "8.1.0")

        assertTrue(platform.sdkVersion, platform.sdkVersion.endsWith("-capacitor-1.2.3"))
    }

    @Test
    fun platformNamesCapacitorAndItsVersion() {
        val platform = TransactPluginPlugin.platform("1.2.3", "8.1.0")

        assertEquals(Config.Platform.HostFramework("capacitor", "8.1.0"), platform.hostFramework)
    }

    @Test
    fun unknownCapacitorVersionIsNull() {
        val platform = TransactPluginPlugin.platform("1.2.3", null)

        assertEquals(Config.Platform.HostFramework("capacitor", null), platform.hostFramework)
    }

    @Test
    fun encodedPlatformNestsTheHostFramework() {
        val encoded = TransactPluginPlugin.platform("1.2.3", "8.1.0").encode()

        assertEquals(mapOf("name" to "capacitor", "version" to "8.1.0"), encoded["hostFramework"])
    }

    // build.gradle reads it from the @capacitor/android package this build compiles against.
    @Test
    fun buildConfigCarriesTheCapacitorVersion() {
        val version = BuildConfig.CAPACITOR_VERSION

        assertTrue("$version", version != null && Regex("""\d+\.\d+\.\d+.*""").matches(version))
    }
}
