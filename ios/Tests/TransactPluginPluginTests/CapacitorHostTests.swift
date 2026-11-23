import XCTest
import AtomicTransact
import Capacitor
@testable import TransactPluginPlugin

class CapacitorHostTests: XCTestCase {
    func testPlatformKeepsTheWrapperSuffixAndAddsTheHostFramework() throws {
        let platform = try XCTUnwrap(CapacitorHost.platform(wrapperVersion: "1.2.3") as? [String: Any])

        let sdkVersion = try XCTUnwrap(platform["sdkVersion"] as? String)
        XCTAssertTrue(sdkVersion.hasSuffix("-capacitor-1.2.3"), sdkVersion)

        let hostFramework = try XCTUnwrap(platform["hostFramework"] as? [String: Any])
        XCTAssertEqual(hostFramework["name"] as? String, "capacitor")
        XCTAssertEqual(hostFramework["packageManager"] as? String, "swiftpm")
        // These tests build with SwiftPM, whose Capacitor framework has no real version. The SDK
        // leaves nil fields out.
        XCTAssertNil(hostFramework["version"])
    }

    // presentTransact puts the platform in the config JSON and decodes AtomicConfig from it, so
    // check the host framework survives that decode.
    func testAtomicConfigKeepsTheHostFramework() throws {
        let json: [String: Any] = [
            "publicToken": "token",
            "platform": try XCTUnwrap(CapacitorHost.platform(wrapperVersion: "1.2.3"))
        ]
        let config = try JSONDecoder().decode(AtomicConfig.self, from: JSONSerialization.data(withJSONObject: json))

        let encoded = try JSONSerialization.jsonObject(with: JSONEncoder().encode(config)) as? [String: Any]
        let platform = try XCTUnwrap(encoded?["platform"] as? [String: Any])
        let hostFramework = try XCTUnwrap(platform["hostFramework"] as? [String: Any])
        XCTAssertEqual(hostFramework["name"] as? String, "capacitor")
        XCTAssertEqual(hostFramework["packageManager"] as? String, "swiftpm")
    }

    func testBundleVersionIgnoresTheAppBundle() {
        XCTAssertNil(CapacitorHost.bundleVersion(.main))
    }

    func testBundleVersionReadsAFrameworkInfoPlist() {
        let bundle = Bundle(for: CAPBridgeViewController.self)
        XCTAssertNotEqual(bundle, .main)

        XCTAssertNotNil(CapacitorHost.bundleVersion(bundle))
        XCTAssertEqual(
            CapacitorHost.bundleVersion(bundle),
            bundle.infoDictionary?["CFBundleShortVersionString"] as? String
        )
    }
}
