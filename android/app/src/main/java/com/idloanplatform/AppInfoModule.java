package com.idloanplatform;

import android.Manifest;
import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.net.Uri;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.view.View;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import com.facebook.accountkit.AccountKit;
import com.facebook.accountkit.AccessToken;
import com.facebook.accountkit.ui.AccountKitActivity;
import com.facebook.accountkit.ui.AccountKitConfiguration;
import com.facebook.accountkit.ui.LoginType;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import ai.advance.liveness.sdk.activity.LivenessActivity;

public class AppInfoModule extends ReactContextBaseJavaModule {

    private ReactContext mContext;
    public static int APP_REQUEST_CODE = 99;
    public static int APP_LIVENESS_CODE = 1000;
    public static final String EXTRA_DATA = "data";
    final private String preferenceName = "channel";


    public AppInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        MainActivity.reactContext = mContext;
    }

    @Override
    public String getName() {
        return "AppInfoModule";
    }

    @ReactMethod
    public void getAppChannel(Promise promise){
        SharedPreferences preferences =  mContext.getSharedPreferences(preferenceName, Context.MODE_PRIVATE);
        String utmSource = preferences.getString("utm_source", "");
        if (TextUtils.equals("", utmSource)){
            readDefaultChannel(promise);
        }else{
            String utmMedium = preferences.getString("utm_medium", "");
            String utmTerm = preferences.getString("utm_term", "");
            String utmContent = preferences.getString("utm_content", "");
            String utmCampaign = preferences.getString("utm_campaign", "");

            WritableMap map = new WritableNativeMap();
            map.putString("utm_source", utmSource);
            map.putString("utm_medium", utmMedium);
            map.putString("utm_term", utmTerm);
            map.putString("utm_content", utmContent);
            map.putString("utm_campaign", utmCampaign);

            promise.resolve(map);
        }
    }

    private void readDefaultChannel(Promise promise){
        try {
            InputStream input = mContext.getAssets().open("channel.txt");
            InputStreamReader reader = new InputStreamReader(input);
            BufferedReader bufReader = new BufferedReader(reader);
            String channel = bufReader.readLine();
            input.close();

            if (TextUtils.equals("", channel)){
                promise.reject("0", "Channel file content is empty.");
            }else{
                WritableMap map = new WritableNativeMap();
                final String[] pairs = channel.split("&");
                for (String pair : pairs) {
                    final int idx = pair.indexOf("=");
                    //如果等号存在且不在字符串两端，取出key、value
                    if (idx > 0 && idx < pair.length() - 1) {
                        final String key = URLDecoder.decode(pair.substring(0, idx), "UTF-8");
                        final String value = URLDecoder.decode(pair.substring(idx + 1), "UTF-8");
                        map.putString(key, value);
                    }
                }
                promise.resolve(map);
                writeAppChannel(map);
            }
        } catch (IOException e) {
            promise.reject("0", "No Channel File!");
            e.printStackTrace();
        }
    }
    @ReactMethod
    public void writeAppChannel(ReadableMap map){
        SharedPreferences preferences =  mContext.getSharedPreferences(preferenceName, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        ReadableMapKeySetIterator iterator = map.keySetIterator();
        while (iterator.hasNextKey()){
            String key = iterator.nextKey();
            if (ReadableType.Number.equals(map.getType(key))){
                editor.putInt(key, map.getInt(key));
            } else if (ReadableType.String.equals(map.getType(key))){
                editor.putString(key,map.getString(key));
            } else if (ReadableType.Boolean.equals(map.getType(key))){
                editor.putBoolean(key,map.getBoolean(key));
            }
        }
        editor.commit();
    }

    @ReactMethod
    public void showLoginDialog(){
        phoneLogin();
    }

    @ReactMethod
    public void getInstalledPackages(Promise promise){
        final PackageManager packageManager = mContext.getPackageManager();
        List<PackageInfo> pinfo = packageManager.getInstalledPackages(0);
        WritableNativeArray pnameArr = new WritableNativeArray();
        for (int i = 0; i < pinfo.size(); i++){
            pnameArr.pushString(pinfo.get(i).packageName);
        }
        promise.resolve(pnameArr);
    }

    @ReactMethod
    public void checkAppInstalled(String packageName, Promise promise){
        boolean find = isAvilible(packageName);
        promise.resolve(find);
    }

    public boolean isAvilible(String packageName){
        boolean find = true;
        if (packageName == null){
            find = false;
        }

        try {
            mContext.getPackageManager().getPackageInfo(packageName, PackageManager.GET_GIDS);
        }catch (PackageManager.NameNotFoundException e){
            find = false;
        }

        return find;
    }

    @ReactMethod
    public void openApp(String packageName, Promise promise){
        PackageManager packageManager = mContext.getPackageManager();
        Intent intent = new Intent();
        intent = packageManager.getLaunchIntentForPackage(packageName);
        if (intent == null){
            promise.reject("-1", "app not installed");
        }else{
            promise.resolve(true);
            mContext.startActivity(intent);
        }
    }

    @ReactMethod
    public void jumpToGooglePlay(String url, Promise promise){
        if (url == null){
            promise.reject("-1", "url empty");
            return;
        }

        Uri uri = Uri.parse(url);
        Set<String> names = uri.getQueryParameterNames();
        String packageName = "";
        for (String name : names) {
            if (TextUtils.equals(name, "id")){
                packageName = uri.getQueryParameter(name);
                break;
            }
        }

        if (TextUtils.equals(packageName, "")){
            promise.reject("-2", "url no package name");
            return;
        }

        Intent intent = new Intent(Intent.ACTION_VIEW);
        String newString = url.replace("https://play.google.com/store/apps/details?", "market://details?");
        intent.setData(Uri.parse(newString));
        if (intent.resolveActivity(mContext.getPackageManager()) != null) {
            intent.setPackage("com.android.vending");
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            mContext.startActivity(intent);
        }else {
            intent = new Intent(Intent.ACTION_VIEW);
            intent.setData(Uri.parse(url));
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            mContext.startActivity(intent);
        }
    }

    // facebook accountkit login
    public void phoneLogin() {
        final Intent intent = new Intent(mContext.getCurrentActivity(), AccountKitActivity.class);
        AccountKitConfiguration.AccountKitConfigurationBuilder configurationBuilder =
                new AccountKitConfiguration.AccountKitConfigurationBuilder(
                        LoginType.PHONE,
                        AccountKitActivity.ResponseType.CODE).setDefaultCountryCode("ID"); // or .ResponseType.TOKEN
        // ... perform additional configuration ...
        intent.putExtra(
                AccountKitActivity.ACCOUNT_KIT_ACTIVITY_CONFIGURATION,
                configurationBuilder.build());
        mContext.getCurrentActivity().startActivityForResult(intent, APP_REQUEST_CODE);
    }


    @ReactMethod
    public void showLivenessDetect(Promise promise){
        if (allPermissionsGranted()) {
            Intent intent =  new Intent(mContext.getCurrentActivity(), LivenessActivity.class);
            mContext.getCurrentActivity().startActivityForResult(intent, APP_LIVENESS_CODE);
        } else {
            promise.reject("-1", "no camera permissions");
        }
    }

    private boolean allPermissionsGranted() {
        for (String permission : getRequiredPermissions()) {
            if (ContextCompat.checkSelfPermission(mContext, permission)
                    != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }

    public String[] getRequiredPermissions() {
        return new String[]{Manifest.permission.CAMERA};
    }

}
