import { Platform } from 'react-native';
import { version } from './../../package.json';

const apiOrigin = 'https://console.hengyaruiyi.com/api';
const updateOrigin = `https://apkdown.beikeqianbao.com/gopinjaman-bundle-update-config-${Platform.OS}-pro.json`;

// 相关配置
const AppConfig = {
    apiOrigin,
};

// Bundle更新配置
const BundleConfig = {
    bundleVersion: version,
    updateOrigin,
};

// 印尼货币金额格式化
const FormatNumber = (n) => {
    if (n) {
        let b = parseInt(n).toString();
        let len = b.length;
        if (len <= 3) { return b };
        let r = len % 3;
        return r > 0 ? b.slice(0, r) + '.' + b.slice(r, len).match(/\d{3}/g).join('.') : b.slice(r, len).match(/\d{3}/g).join('.');
    }
    return 0;
};

// 时间戳格式化
const FormatDate = (date, fmt) => {
    if (!date) {
        return ''
    }

    const padLeftZero = (str) => {
        return ('00' + str).substr(str.length)
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
};

// 用户名格式化
const FormatName = (name) => {
    if (name && name.length > 4) {
        name = '******' + name.substr(-4, 4)
    }
    return name
};

export { AppConfig, BundleConfig, FormatNumber, FormatDate, FormatName }