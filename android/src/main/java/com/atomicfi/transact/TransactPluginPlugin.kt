package com.atomicfi.transact

import android.util.Base64
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import financial.atomic.transact.ActionConfig
import financial.atomic.transact.Config
import financial.atomic.transact.PausedTransactRef
import financial.atomic.transact.Transact
import financial.atomic.transact.receiver.TransactBroadcastReceiver
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import org.json.JSONObject

@CapacitorPlugin(name = "TransactPlugin")
class TransactPluginPlugin : Plugin() {

    private var savedCall: PluginCall? = null
    private var pausedRef: PausedTransactRef? = null
    private val pluginScope = CoroutineScope(Dispatchers.Main + Job())

    // The `environment` option accepts a shorthand string ("production" | "sandbox") or a
    // full object ({ environment, transactPath?, apiPath? }). Normalize both to a name and
    // optional transactPath.
    private fun readEnvironment(call: PluginCall): Pair<String, String?> {
        // Shorthand string form.
        call.getString("environment")?.let { return Pair(it, null) }

        // Object form.
        val environmentObj = call.getObject("environment") ?: return Pair("production", null)
        val name = environmentObj.optString("environment", "production")
        val transactPath = if (environmentObj.has("transactPath")) {
            environmentObj.optString("transactPath")
        } else {
            null
        }
        return Pair(name, transactPath)
    }

    private fun parseEnvironmentURL(name: String, transactPath: String?): String {
        return when (name) {
            "sandbox" -> "https://transact-sandbox.atomicfi.com"
            "custom" -> transactPath ?: "https://transact.atomicfi.com"
            else -> "https://transact.atomicfi.com"
        }
    }

    private fun parseActionEnvironment(name: String, transactPath: String?): Pair<Config.Environment, String?> {
        return when (name) {
            "sandbox" -> Pair(Config.Environment.SANDBOX, null)
            "custom" -> Pair(Config.Environment.CUSTOM, transactPath ?: "https://transact.atomicfi.com")
            else -> Pair(Config.Environment.PRODUCTION, null)
        }
    }

    @PluginMethod
    fun presentTransact(call: PluginCall) {
        val configObj = call.getObject("config")
        if (configObj == null) {
            call.reject("Config is required")
            return
        }

        val (environmentName, transactPath) = readEnvironment(call)
        val debug = call.getBoolean("debug") ?: false
        val wrapperVersion = call.getString("wrapperVersion") ?: ""
        val activity = bridge.activity
        if (activity == null) {
            call.reject("Activity not available")
            return
        }

        savedCall = call

        // Add platform info using SDK helper with `capacitor-<wrapper version>` suffix.
        val platformMap = Config.Platform.suffixed("capacitor-$wrapperVersion").encode()
        configObj.put("platform", JSONObject(platformMap as Map<String, Any?>))

        // Base64 encode the config for the token-based constructor
        val token = Base64.encodeToString(
            configObj.toString().toByteArray(Charsets.UTF_8),
            Base64.NO_WRAP
        )

        val environmentURL = parseEnvironmentURL(environmentName, transactPath)

        val config = Config(
            token = token,
            environment = "CUSTOM",
            environmentURL = environmentURL,
            webContentsDebuggingEnabled = debug
        )

        activity.runOnUiThread {
            try {
                Transact.present(activity, config, object : TransactBroadcastReceiver() {
                    override fun onClose(data: JSONObject) {
                        notifyListeners("onClose", jsonToJSObject(data))

                        val result = JSObject()
                        result.put("closed", jsonToJSObject(data))
                        savedCall?.resolve(result)
                        savedCall = null
                    }

                    override fun onFinish(data: JSONObject) {
                        notifyListeners("onFinish", jsonToJSObject(data))

                        val result = JSObject()
                        result.put("finished", jsonToJSObject(data))
                        savedCall?.resolve(result)
                        savedCall = null
                    }

                    override fun onInteraction(data: JSONObject) {
                        notifyListeners("onInteraction", jsonToJSObject(data))
                    }

                    override fun onDataRequest(data: JSONObject) {
                        notifyListeners("onDataRequest", jsonToJSObject(data))
                    }

                    override fun onAuthStatusUpdate(data: JSONObject) {
                        notifyListeners("onAuthStatusUpdate", jsonToJSObject(data))
                    }

                    override fun onTaskStatusUpdate(data: JSONObject) {
                        notifyListeners("onTaskStatusUpdate", jsonToJSObject(data))
                    }
                })
            } catch (e: Exception) {
                call.reject("Failed to present Transact", e)
                savedCall = null
            }
        }
    }

    @PluginMethod
    fun presentAction(call: PluginCall) {
        val id = call.getString("id")
        if (id == null) {
            call.reject("id is required")
            return
        }

        val (environmentName, transactPath) = readEnvironment(call)
        val debug = call.getBoolean("debug") ?: false
        val wrapperVersion = call.getString("wrapperVersion") ?: ""
        val activity = bridge.activity
        if (activity == null) {
            call.reject("Activity not available")
            return
        }

        savedCall = call

        val (env, envURL) = parseActionEnvironment(environmentName, transactPath)

        val config = ActionConfig(
            id = id,
            environment = env,
            environmentURL = envURL,
            webContentsDebuggingEnabled = debug
        )
        config.platform = Config.Platform.suffixed("capacitor-$wrapperVersion")

        activity.runOnUiThread {
            try {
                Transact.presentAction(activity, config)

                Transact.registerReceiver(activity, object : TransactBroadcastReceiver() {
                    override fun onLaunch() {
                        notifyListeners("onLaunch", JSObject())
                    }

                    override fun onClose(data: JSONObject) {
                        notifyListeners("onClose", jsonToJSObject(data))

                        val result = JSObject()
                        result.put("closed", jsonToJSObject(data))
                        savedCall?.resolve(result)
                        savedCall = null
                    }

                    override fun onFinish(data: JSONObject) {
                        notifyListeners("onFinish", jsonToJSObject(data))

                        val result = JSObject()
                        result.put("finished", jsonToJSObject(data))
                        savedCall?.resolve(result)
                        savedCall = null
                    }

                    override fun onAuthStatusUpdate(data: JSONObject) {
                        notifyListeners("onAuthStatusUpdate", jsonToJSObject(data))
                    }

                    override fun onTaskStatusUpdate(data: JSONObject) {
                        notifyListeners("onTaskStatusUpdate", jsonToJSObject(data))
                    }
                })
            } catch (e: Exception) {
                call.reject("Failed to present action", e)
                savedCall = null
            }
        }
    }

    @PluginMethod
    fun hideTransact(call: PluginCall) {
        val activity = bridge.activity
        if (activity == null) {
            call.reject("Activity not available")
            return
        }

        activity.runOnUiThread {
            try {
                Transact.hideTransact(activity)
                call.resolve()
            } catch (e: Exception) {
                call.reject("Failed to hide Transact", e)
            }
        }
    }

    @PluginMethod
    fun pauseTransact(call: PluginCall) {
        val animated = call.getBoolean("animated") ?: true

        pluginScope.launch {
            try {
                val ref = Transact.pauseTransact(animated)
                pausedRef = ref
                call.resolve()
            } catch (e: Exception) {
                call.reject("Failed to pause Transact", e)
            }
        }
    }

    @PluginMethod
    fun resumeTransact(call: PluginCall) {
        val animated = call.getBoolean("animated") ?: true
        val activity = bridge.activity
        if (activity == null) {
            call.reject("Activity not available")
            return
        }
        val ref = pausedRef
        if (ref == null) {
            call.reject("No paused Transact session to resume")
            return
        }

        activity.runOnUiThread {
            try {
                ref.resume(activity, animated)
                pausedRef = null
                call.resolve()
            } catch (e: Exception) {
                call.reject("Failed to resume Transact", e)
            }
        }
    }

    @PluginMethod
    fun resolveDataRequest(call: PluginCall) {
        val activity = bridge.activity
        if (activity == null) {
            call.reject("Activity not available")
            return
        }

        val cardObj = call.getObject("card")
        val identityObj = call.getObject("identity")

        var card: Config.TransactDataResponse.CardData? = null
        if (cardObj != null) {
            val number = cardObj.getString("number")
            if (number == null) {
                call.reject("Card number is required")
                return
            }
            card = Config.TransactDataResponse.CardData(
                number = number,
                expiry = cardObj.optStringOrNull("expiry"),
                cvv = cardObj.optStringOrNull("cvv")
            )
        }

        var identity: Config.TransactDataResponse.Identity? = null
        if (identityObj != null) {
            identity = Config.TransactDataResponse.Identity(
                firstName = identityObj.optStringOrNull("firstName"),
                lastName = identityObj.optStringOrNull("lastName"),
                postalCode = identityObj.optStringOrNull("postalCode"),
                address = identityObj.optStringOrNull("address"),
                address2 = identityObj.optStringOrNull("address2"),
                city = identityObj.optStringOrNull("city"),
                state = identityObj.optStringOrNull("state"),
                phone = identityObj.optStringOrNull("phone"),
                email = identityObj.optStringOrNull("email")
            )
        }

        val response = Config.TransactDataResponse(card = card, identity = identity)

        activity.runOnUiThread {
            try {
                Transact.sendData(activity, response)
                call.resolve()
            } catch (e: Exception) {
                call.reject("Failed to send data response", e)
            }
        }
    }

    private fun jsonToJSObject(json: JSONObject): JSObject {
        return try {
            JSObject(json.toString())
        } catch (e: Exception) {
            JSObject()
        }
    }

    private fun JSONObject.optStringOrNull(key: String): String? {
        return if (has(key) && !isNull(key)) getString(key) else null
    }
}
