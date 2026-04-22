import Foundation
import Capacitor
import AtomicTransact

@objc(TransactPluginPlugin)
public class TransactPluginPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "TransactPluginPlugin"
    public let jsName = "TransactPlugin"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "presentTransact", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "presentAction", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "hideTransact", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pauseTransact", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resumeTransact", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resolveDataRequest", returnType: CAPPluginReturnPromise)
    ]

    private var dataResponseHandler: (([String: Any]?) -> Void)?
    private var pausedTransactRef: Atomic.PausedTransactRef?

    // MARK: - Environment Parsing

    private func parseEnvironment(_ environmentData: [String: Any]?) -> TransactEnvironment {
        guard let env = environmentData,
              let environment = env["environment"] as? String else {
            return .production
        }

        switch environment {
        case "sandbox":
            return .sandbox
        case "custom":
            let transactPath = env["transactPath"] as? String ?? "https://transact.atomicfi.com"
            let apiPath = env["apiPath"] as? String ?? "https://api.atomicfi.com"
            return .custom(transactPath: transactPath, apiPath: apiPath)
        default:
            return .production
        }
    }

    private func parsePresentationStyle(_ style: String?) -> UIModalPresentationStyle {
        switch style {
        case "fullScreen":
            return .fullScreen
        default:
            return .formSheet
        }
    }

    // MARK: - presentTransact

    @objc func presentTransact(_ call: CAPPluginCall) {
        guard let configData = call.getObject("config") else {
            call.reject("Config is required")
            return
        }

        let environmentData = call.getObject("environment")
        let presentationStyle = call.getString("presentationStyle")
        let debug = call.getBool("debug") ?? false

        DispatchQueue.main.async { [weak self] in
            guard let self = self,
                  let source = self.bridge?.viewController else {
                call.reject("Unable to get view controller")
                return
            }

            let parsedEnvironment = self.parseEnvironment(environmentData)
            let parsedPresentationStyle = self.parsePresentationStyle(presentationStyle)

            do {
                var json = configData as [String: Any]

                // Default language to "en" if not provided
                if json["language"] == nil {
                    json["language"] = "en"
                }

                // Add platform info using SDK defaults with -capacitor suffix
                json["platform"] = AtomicConfig.Platform(suffixed: "capacitor").encode()

                guard let data = try? JSONSerialization.data(withJSONObject: json, options: []) else {
                    call.reject("Failed to serialize config")
                    return
                }

                let decoder = JSONDecoder()
                let config = try decoder.decode(AtomicConfig.self, from: data)

                Task { @MainActor in
                    await Atomic.setDebug(isEnabled: debug, forwardLogs: { [weak self] message in
                        DispatchQueue.main.async {
                            self?.notifyListeners("onDebugLog", data: ["message": message])
                        }
                    })

                    Atomic.presentTransact(
                    from: source,
                    config: config,
                    environment: parsedEnvironment,
                    presentationStyle: parsedPresentationStyle,
                    onInteraction: { [weak self] interaction in
                        self?.notifyListeners("onInteraction", data: [
                            "name": interaction.name,
                            "value": interaction.value
                        ])
                    },
                    onDataRequest: { [weak self] request async -> TransactDataResponse? in
                        return await withCheckedContinuation { continuation in
                            self?.dataResponseHandler = { responseData in
                                guard let responseDict = responseData else {
                                    continuation.resume(returning: nil)
                                    return
                                }

                                do {
                                    let jsonData = try JSONSerialization.data(withJSONObject: responseDict, options: [])
                                    let response = try JSONDecoder().decode(TransactDataResponse.self, from: jsonData)
                                    continuation.resume(returning: response)
                                } catch {
                                    continuation.resume(returning: nil)
                                }
                            }

                            // Build event data from the request
                            var eventData: [String: Any] = [:]
                            for (key, value) in request.data {
                                eventData[key] = value
                            }
                            eventData["userId"] = request.userId
                            eventData["identifier"] = request.identifier
                            eventData["fields"] = request.fields
                            if let taskId = request.taskId {
                                eventData["taskId"] = taskId
                            }

                            self?.notifyListeners("onDataRequest", data: eventData)
                        }
                    },
                    onAuthStatusUpdate: { [weak self] status in
                        self?.notifyListeners("onAuthStatusUpdate", data: status.toDictionary())
                    },
                    onTaskStatusUpdate: { [weak self] status in
                        self?.notifyListeners("onTaskStatusUpdate", data: status.toDictionary())
                    },
                    onLaunch: { [weak self] in
                        self?.notifyListeners("onLaunch", data: [:])
                    },
                    onCompletion: { [weak self] result in
                        switch result {
                        case .finished(let response):
                            let data = self?.sanitizeDictionary(response.data) ?? [:]
                            self?.notifyListeners("onFinish", data: data)
                            call.resolve(["finished": data])
                        case .closed(let response):
                            let data = self?.sanitizeDictionary(response.data) ?? [:]
                            self?.notifyListeners("onClose", data: data)
                            call.resolve(["closed": data])
                        case .error:
                            call.resolve(["error": "Unknown error"])
                        case .transactDismissed:
                            call.resolve(["closed": ["reason": "dismissed"]])
                        @unknown default:
                            call.resolve(["error": "Unknown error"])
                        }
                    }
                )
                }
            } catch let DecodingError.keyNotFound(key, context) {
                call.reject("Config error: Missing key '\(key.stringValue)' at path: \(context.codingPath.map(\.stringValue).joined(separator: ".")). Debug: \(context.debugDescription)")
            } catch let DecodingError.typeMismatch(type, context) {
                call.reject("Config error: Type mismatch for \(type) at path: \(context.codingPath.map(\.stringValue).joined(separator: ".")). Debug: \(context.debugDescription)")
            } catch let DecodingError.valueNotFound(type, context) {
                call.reject("Config error: Value not found for \(type) at path: \(context.codingPath.map(\.stringValue).joined(separator: ".")). Debug: \(context.debugDescription)")
            } catch {
                call.reject("Config error: \(String(describing: error))")
            }
        }
    }

    // MARK: - presentAction

    @objc func presentAction(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else {
            call.reject("id is required")
            return
        }

        let environmentData = call.getObject("environment")
        let presentationStyle = call.getString("presentationStyle")
        let debug = call.getBool("debug") ?? false

        DispatchQueue.main.async { [weak self] in
            guard let self = self,
                  let source = self.bridge?.viewController else {
                call.reject("Unable to get view controller")
                return
            }

            let parsedEnvironment = self.parseEnvironment(environmentData)
            let parsedPresentationStyle = self.parsePresentationStyle(presentationStyle)

            // Parse optional theme
            var theme = AtomicConfig.Theme()
            if let themeData = call.getObject("theme") {
                if let jsonData = try? JSONSerialization.data(withJSONObject: themeData, options: []),
                   let parsedTheme = try? JSONDecoder().decode(AtomicConfig.Theme.self, from: jsonData) {
                    theme = parsedTheme
                }
            }

            // Parse optional metadata
            var metadata: [String: String]? = nil
            if let metadataData = call.getObject("metadata") {
                metadata = metadataData.compactMapValues { $0 as? String }
            }

            Task { @MainActor in
                await Atomic.setDebug(isEnabled: debug, forwardLogs: { [weak self] message in
                    DispatchQueue.main.async {
                        self?.notifyListeners("onDebugLog", data: ["message": message])
                    }
                })

                Atomic.presentAction(
                from: source,
                id: id,
                environment: parsedEnvironment,
                presentationStyle: parsedPresentationStyle,
                theme: theme,
                metadata: metadata,
                onLaunch: { [weak self] in
                    self?.notifyListeners("onLaunch", data: [:])
                },
                onAuthStatusUpdate: { [weak self] status in
                    self?.notifyListeners("onAuthStatusUpdate", data: status.toDictionary())
                },
                onTaskStatusUpdate: { [weak self] status in
                    self?.notifyListeners("onTaskStatusUpdate", data: status.toDictionary())
                },
                onCompletion: { [weak self] result in
                    switch result {
                    case .finished(let response):
                        let data = self?.sanitizeDictionary(response.data) ?? [:]
                        self?.notifyListeners("onFinish", data: data)
                        call.resolve(["finished": data])
                    case .closed(let response):
                        let data = self?.sanitizeDictionary(response.data) ?? [:]
                        self?.notifyListeners("onClose", data: data)
                        call.resolve(["closed": data])
                    case .error:
                        call.resolve(["error": "Unknown error"])
                    case .transactDismissed:
                        call.resolve(["closed": ["reason": "dismissed"]])
                    @unknown default:
                        call.resolve(["error": "Unknown error"])
                    }
                }
            )
            }
        }
    }

    // MARK: - hideTransact

    @objc func hideTransact(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            Atomic.hideTransact()
            call.resolve()
        }
    }

    // MARK: - pauseTransact

    @objc func pauseTransact(_ call: CAPPluginCall) {
        let animated = call.getBool("animated") ?? true

        Task { @MainActor [weak self] in
            guard let self = self else {
                call.reject("Plugin deallocated")
                return
            }

            do {
                let ref = try await Atomic.pauseTransact(animated: animated)
                self.pausedTransactRef = ref
                call.resolve()
            } catch Atomic.PauseTransactError.transactNotPresented {
                call.reject("Transact is not currently presented")
            } catch {
                call.reject("Failed to pause Transact: \(String(describing: error))")
            }
        }
    }

    // MARK: - resumeTransact

    @objc func resumeTransact(_ call: CAPPluginCall) {
        let animated = call.getBool("animated") ?? true

        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                call.reject("Plugin deallocated")
                return
            }
            guard let ref = self.pausedTransactRef else {
                call.reject("No paused Transact session to resume")
                return
            }
            guard let source = self.bridge?.viewController else {
                call.reject("Unable to get view controller")
                return
            }

            ref.resume(source: source, animated: animated)
            self.pausedTransactRef = nil
            call.resolve()
        }
    }

    // MARK: - resolveDataRequest

    @objc func resolveDataRequest(_ call: CAPPluginCall) {
        guard let handler = dataResponseHandler else {
            call.reject("No active data request")
            return
        }

        var responseData: [String: Any] = [:]
        if let card = call.getObject("card") {
            responseData["card"] = card
        }
        if let identity = call.getObject("identity") {
            responseData["identity"] = identity
        }

        handler(responseData.isEmpty ? nil : responseData)
        dataResponseHandler = nil
        call.resolve()
    }

    // MARK: - Helpers

    /// Ensures all values in the dictionary are JSON-serializable for Capacitor
    private func sanitizeDictionary(_ dict: [String: Any]) -> [String: Any] {
        var result: [String: Any] = [:]
        for (key, value) in dict {
            if let nested = value as? [String: Any] {
                result[key] = sanitizeDictionary(nested)
            } else if let array = value as? [Any] {
                result[key] = array
            } else if value is String || value is Int || value is Double || value is Bool {
                result[key] = value
            } else if let number = value as? NSNumber {
                result[key] = number
            } else {
                result[key] = "\(value)"
            }
        }
        return result
    }
}

// MARK: - Serialization Extensions

extension TransactCompany {
    func toDictionary() -> [String: Any] {
        var dict: [String: Any] = [
            "_id": id,
            "name": name
        ]
        if let branding = branding {
            var brandingDict: [String: Any] = [
                "color": branding.color
            ]
            var logoDict: [String: Any] = [
                "url": branding.logo.url
            ]
            if let bgColor = branding.logo.backgroundColor {
                logoDict["backgroundColor"] = bgColor
            }
            brandingDict["logo"] = logoDict
            dict["branding"] = brandingDict
        }
        return dict
    }
}

extension TransactAuthStatusUpdate {
    func toDictionary() -> [String: Any] {
        return [
            "status": status.rawValue,
            "company": company.toDictionary()
        ]
    }
}

extension TransactTaskStatusUpdate {
    func toDictionary() -> [String: Any] {
        var result: [String: Any] = [
            "taskId": taskId,
            "product": product.rawValue,
            "status": status.rawValue,
            "company": company.toDictionary()
        ]

        if let failReason = failReason {
            result["failReason"] = failReason
        }

        if let switchData = switchData {
            var switchMap: [String: Any] = [:]
            let payment = switchData.paymentMethod
            var paymentMap: [String: Any] = [
                "id": payment.id,
                "title": payment.title,
                "type": payment.type.rawValue
            ]

            if let expiry = payment.expiry { paymentMap["expiry"] = expiry }
            if let brand = payment.brand { paymentMap["brand"] = brand }
            if let lastFour = payment.lastFour { paymentMap["lastFour"] = lastFour }
            if let routingNumber = payment.routingNumber { paymentMap["routingNumber"] = routingNumber }
            if let accountType = payment.accountType { paymentMap["accountType"] = accountType }
            if let lastFourAccount = payment.lastFourAccountNumber { paymentMap["lastFourAccountNumber"] = lastFourAccount }

            switchMap["paymentMethod"] = paymentMap
            result["switchData"] = switchMap
        }

        if let depositData = depositData {
            var depositMap: [String: Any] = [:]
            if let accountType = depositData.accountType { depositMap["accountType"] = accountType }
            if let distributionAmount = depositData.distributionAmount { depositMap["distributionAmount"] = distributionAmount }
            if let distributionType = depositData.distributionType { depositMap["distributionType"] = "\(distributionType)" }
            if let lastFour = depositData.lastFour { depositMap["lastFour"] = lastFour }
            if let routingNumber = depositData.routingNumber { depositMap["routingNumber"] = routingNumber }
            if let title = depositData.title { depositMap["title"] = title }
            result["depositData"] = depositMap
        }

        if let managedBy = managedBy {
            result["managedBy"] = ["company": managedBy.company.toDictionary()]
        }

        return result
    }
}
