import DeviceInfo from 'react-native-device-info'; // 设备信息组件
import axios from 'axios';

import { AppConfig } from './../assets/js/AppConfig'; // 配置模块
import Global from './../assets/js/Global';

const instance = axios.create({
    baseURL: AppConfig.apiOrigin,
    timeout: 3000,
    headers: {
        'user-agent': DeviceInfo.getUserAgent(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    // transformResponse: [
    //     (data) => {
    //         console.log(data);
    //         return data;
    //     }
    // ]
});

//请求拦截处理
instance.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

//返回拦截处理
instance.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response;
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});

let apiHead = {
    mdkey: 'wBbXlItl99d8xWxnSYNai9iR4EackX78',
    version: DeviceInfo.getVersion(),
    partner: 'android',
    utm_source: 'android_official',
}

const AxiosPost = async (api, body = {}) => {
    apiHead = Object.assign(apiHead, {
        ip: Global.ip,
        utm_source: Global.utm_source,
        token: Global.token,
    });

    return new Promise((resolve, reject) => {
        instance.post(api, {
            head: Object.assign(apiHead, body.head),
            para: body.para
        }).then(res => {
            resolve(res.data)
        }).catch(error => {
            reject(error)
        })
    })
}

export { AxiosPost }