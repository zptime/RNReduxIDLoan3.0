package com.idloanplatform;

import android.os.Bundle;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class LogEventModule extends ReactContextBaseJavaModule {
    private ReactContext mContext;

    public LogEventModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "LogEventModule";
    }

    @ReactMethod
    public void logEvent(String eventName, String content){
        Bundle bundle = new Bundle();
    }
}
