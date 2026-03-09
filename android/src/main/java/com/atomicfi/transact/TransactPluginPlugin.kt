package com.atomicfi.transact

import android.os.Build
import android.util.Base64
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import financial.atomic.transact.ActionConfig
import financial.atomic.transact.Config
import financial.atomic.transact.Transact
import financial.atomic.transact.receiver.TransactBroadcastReceiver
import org.json.JSONObject

@CapacitorPlugin(name = "TransactPlugin")
class TransactPluginPlugin : Plugin() {

    private var savedCall: PluginCall? = null

    private fun parseEnvironmentURL(environmentObj: JSONObject?): String {
        if (environmentObj == null) return "https://transact.atomicfi.com"

        return when (environmentObj.optString("environment", "production")) {
            "sandbox" -> "https://transact-sandbox.atomicfi.com"
            "custom" -> environmentObj.optString("transactPath", "https://transact.atomicfi.com")
            else -> "https://transact.atomicfi.com"
        }
    }

    private fun parseActionEnvironment(environmentObj: JSONObject?): Pair<Config.Environment, String?> {
        if (environmentObj == null) return Pair(Config.Environment.PRODUCTION, null)

        return when (environmentObj.optString("environment", "production")) {
            "sandbox" -> Pair(Config.Environment.SANDBOX, null)
            "custom" -> {
                val transactPath = environmentObj.optString("transactPath", "https://transact.atomicfi.com")
                Pair(Config.Environment.CUSTOM, transactPath)
            }
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

        val environmentObj = call.getObject("environment")
        val activity = bridge.activity
        if (activity == null) {
            call.reject("Activity not available")
            return
        }

        savedCall = call

        // Add platform info to config
        val platform = JSONObject()
        platform.put("name", "android")
        platform.put("systemVersion", Build.VERSION.SDK_INT.toString())
        platform.put("sdkVersion", BuildConfig.TRANSACT_VERSION + "-capacitor")
        configObj.put("platform", platform)

        // Base64 encode the config for the token-based constructor
        val token = Base64.encodeToString(
            configObj.toString().toByteArray(Charsets.UTF_8),
            Base64.NO_WRAP
        )

        val environmentURL = parseEnvironmentURL(environmentObj)

        val config = Config(
            token = token,
            environment = "CUSTOM",
            environmentURL = environmentURL
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

        val environmentObj = call.getObject("environment")
        val activity = bridge.activity
        if (activity == null) {
            call.reject("Activity not available")
            return
        }

        savedCall = call

        val (env, envURL) = parseActionEnvironment(environmentObj)

        val config = ActionConfig(
            id = id,
            environment = env,
            environmentURL = envURL
        )

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
            card = Config.TransactDataResponse.CardData(
                number = cardObj.getString("number"),
                expiry = if (cardObj.has("expiry") && !cardObj.isNull("expiry")) cardObj.getString("expiry") else null,
                cvv = if (cardObj.has("cvv") && !cardObj.isNull("cvv")) cardObj.getString("cvv") else null
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
