import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
 import RNBootSplash

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure()
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()
     [[RCTI18nUtil, sharedInstance] allowRTL:YES];

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "MyInsta",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
 #if DEBUG
     return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
 #else
     return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
 #endif
   }
#if DEBUG
     RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
     Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

   
   override func createRootView(
     with bridge: RCTBridge,
     moduleName: String,
     initProps: [AnyHashable: Any]?
   ) -> UIView {
     let rootView = super.createRootView(with: bridge, moduleName: moduleName, initProps: initProps!)
     RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
     return rootView
   }

}
