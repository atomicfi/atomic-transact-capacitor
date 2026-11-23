import Foundation
import Capacitor
import AtomicTransact

/// The Capacitor app this plugin runs in, as the native SDK reports it in telemetry.
enum CapacitorHost {
    /// The SDK's platform for a Capacitor app: the `capacitor-<wrapper version>` suffix plus the
    /// Capacitor details, encoded for the config's `platform` key.
    static func platform(wrapperVersion: String) -> Any? {
        AtomicConfig.Platform(suffixed: "capacitor-\(wrapperVersion)", hostFramework: hostFramework).encode()
    }

    static var hostFramework: AtomicConfig.Platform.HostFramework {
        AtomicConfig.Platform.HostFramework(name: "capacitor", version: version, packageManager: packageManager)
    }

    /// How this plugin's iOS code was built: Swift Package Manager defines `SWIFT_PACKAGE`, and
    /// CocoaPods doesn't.
    #if SWIFT_PACKAGE
    static let packageManager = "swiftpm"
    #else
    static let packageManager = "cocoapods"
    #endif

    /// The Capacitor version the app was built with, or nil when it can't be known.
    ///
    /// Capacitor has no version constant. CocoaPods builds the Capacitor pod from `@capacitor/ios`
    /// and writes the pod's version, which comes from that package's `package.json`, to the
    /// framework's Info.plist. The prebuilt framework from capacitor-swift-pm always says `1.0`, so
    /// SwiftPM builds send nil.
    static let version: String? = {
        #if SWIFT_PACKAGE
        return nil
        #else
        return bundleVersion(Bundle(for: CAPBridgeViewController.self))
        #endif
    }()

    /// The version in `bundle`'s Info.plist. Nil for the app's own bundle, which is what
    /// `Bundle(for:)` returns when Capacitor is linked statically and has no Info.plist of its own.
    static func bundleVersion(_ bundle: Bundle) -> String? {
        guard bundle != Bundle.main else { return nil }
        return bundle.infoDictionary?["CFBundleShortVersionString"] as? String
    }
}
