package com.idloanplatform;

import android.content.Context;

import java.io.File;

public class FileConstant {
    //sdcard中bundle的加载路径
    public static String get_JS_BUNDLE_LOCAL_PATH(Context context){
        return context.getExternalCacheDir().getPath() + File.separator + "jsBundle/index.bundle";
    }
}