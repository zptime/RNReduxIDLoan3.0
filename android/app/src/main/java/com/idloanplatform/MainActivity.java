package com.idloanplatform;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import org.devio.rn.splashscreen.SplashScreen;

import com.facebook.accountkit.Account;
import com.facebook.accountkit.AccountKit;
import com.facebook.accountkit.AccountKitCallback;
import com.facebook.accountkit.AccountKitError;
import com.facebook.accountkit.AccountKitLoginResult;
import com.facebook.accountkit.PhoneNumber;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import ai.advance.liveness.lib.http.entity.ResultEntity;

import static com.idloanplatform.AppInfoModule.EXTRA_DATA;

public class MainActivity extends ReactActivity {
    static public ReactContext reactContext = null;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "IDLoanPlatform";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == AppInfoModule.APP_REQUEST_CODE) { // confirm that this response matches your request
            AccountKitLoginResult loginResult = data.getParcelableExtra(AccountKitLoginResult.RESULT_KEY);
            String toastMessage;
            WritableMap retData = new WritableNativeMap();
            if (loginResult.getError() != null) {
                toastMessage = loginResult.getError().getErrorType().getMessage();
                retData.putString("code", "-1");
                retData.putString("msg", toastMessage);
                retData.putString("data", "");
            } else if (loginResult.wasCancelled()) {
                retData.putString("code", "-2");
                retData.putString("msg", "user cancelled login");
                retData.putString("data", "");
            } else {
                String authCode = loginResult.getAuthorizationCode();
                retData.putString("code", "0");
                retData.putString("msg", "success");
                retData.putString("data", authCode);
            }

            // Surface the result to your user in an appropriate way.
            if (reactContext != null){
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("LoginData", retData);
            }
        }else if (requestCode == AppInfoModule.APP_LIVENESS_CODE){
            if (resultCode == RESULT_OK) {
                ResultEntity entity = data.getParcelableExtra(EXTRA_DATA);
                boolean isSuccess = entity.success;
                WritableMap retData = new WritableNativeMap();
                if (isSuccess) {

                    Bitmap bestBitMap = data.getParcelableExtra("bitmap");
                    String imgData = bitmapToBase64(bestBitMap);
                    if (imgData == null) {
                        retData.putString("code", "-1");
                        retData.putString("msg", "get image fail");
                        retData.putString("data", "");
                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("FaceData", retData);
                    } else {
                        retData.putString("code", "0");
                        retData.putString("msg", "success");
                        retData.putString("data", imgData);
                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("FaceData", retData);
                    }
                } else {
                    retData.putString("code", "-2");
                    retData.putString("msg", "detect fail");
                    retData.putString("data", "");
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("FaceData", retData);
                }
            }
        }
    }


    /**
     * bitmap转为base64
     * @param bitmap
     * @return
     */
    public String bitmapToBase64(Bitmap bitmap) {
        String result = null;
        ByteArrayOutputStream baos = null;
        try {
            if (bitmap != null) {
                baos = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);

                baos.flush();
                baos.close();

                byte[] bitmapBytes = baos.toByteArray();
                result = "data:image/jpeg;base64," + Base64.encodeToString(bitmapBytes, Base64.DEFAULT);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (baos != null) {
                    baos.flush();
                    baos.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }
}
