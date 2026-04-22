import XCTest
@testable import TransactPluginPlugin

class TransactPluginTests: XCTestCase {
    func testPluginMethodsRegistered() {
        let plugin = TransactPluginPlugin()
        let methodNames = plugin.pluginMethods.map { $0.name }

        XCTAssertTrue(methodNames.contains("presentTransact"))
        XCTAssertTrue(methodNames.contains("presentAction"))
        XCTAssertTrue(methodNames.contains("hideTransact"))
        XCTAssertTrue(methodNames.contains("pauseTransact"))
        XCTAssertTrue(methodNames.contains("resumeTransact"))
        XCTAssertTrue(methodNames.contains("resolveDataRequest"))
    }
}
