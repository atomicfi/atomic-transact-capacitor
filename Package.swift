// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "AtomicfiTransactCapacitor",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "AtomicfiTransactCapacitor",
            targets: ["TransactPluginPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")
    ],
    targets: [
        .target(
            name: "TransactPluginPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/TransactPluginPlugin"),
        .testTarget(
            name: "TransactPluginPluginTests",
            dependencies: ["TransactPluginPlugin"],
            path: "ios/Tests/TransactPluginPluginTests")
    ]
)