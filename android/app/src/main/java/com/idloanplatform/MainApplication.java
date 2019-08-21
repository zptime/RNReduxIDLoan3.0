package com.idloanplatform;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.zmxv.RNSound.RNSoundPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.brentvatne.react.ReactVideoPackage;
import org.reactnative.camera.RNCameraPackage;

import com.reactnative.ivpusic.imagepicker.PickerPackage;

import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.rnziparchive.RNZipArchivePackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.rnfs.RNFSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import android.content.Context;
import android.support.annotation.Nullable;
import android.support.multidex.MultiDex;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import ai.advance.liveness.lib.GuardianLivenessDetectionSDK;
import ai.advance.liveness.lib.Market;

public class MainApplication extends Application implements ReactApplication {

  private final String accessKey = "054bad11b9982ee6";
  private final String secretKey = "5b453c297f8bc1f2";

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSoundPackage(),
            new ReactNativeAudioPackage(),
            new ReactVideoPackage(),
            new RNCameraPackage(),
            new PickerPackage(),
            new NetInfoPackage(),
            new RNCWebViewPackage(),
            new LinearGradientPackage(),
            new ReactSliderPackage(),
            new AsyncStoragePackage(),
            new RNZipArchivePackage(),
            new SplashScreenReactPackage(),
            new RNGestureHandlerPackage(),
            new RNFSPackage(),
            new RNDeviceInfo(),
            new ReactNativeContacts(),
            new AppReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Nullable
    @Override
    protected String getJSBundleFile() {
      if (BuildConfig.DEBUG) {
        return super.getJSBundleFile();
      } else {
        //判断sdcard中是否存在bundle，存在则加载，不存在则加载Assets中的bundle
        //路径 /storage/emulated/0/Android/data/包名/cache/bkddBundle/index.bundle
        File file = new File(FileConstant.get_JS_BUNDLE_LOCAL_PATH(getApplicationContext()));
        if(file != null && file.exists()) {
          return FileConstant.get_JS_BUNDLE_LOCAL_PATH(getApplicationContext());
        } else {
          return super.getJSBundleFile();
        }
      }
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    GuardianLivenessDetectionSDK.init(this, accessKey, secretKey, Market.Indonesia);
  }

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this);
  }
}
