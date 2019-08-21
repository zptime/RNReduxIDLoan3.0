import  {
    SET_IP,
    SET_TOKEN,
    SET_IS_LOGIN,
    SET_BASIC_AUTH,
    SET_APP_CHANNEL,
    SET_CITY_DATA
} from './types'

/*
 * action 创建函数 就是生成 action 的方法
 */
export const setIp = ip => ({
    type: SET_IP,
    ip
});

export const setToken = token => ({
    type: SET_TOKEN,
    token
});

export const setIsLogin = login => ({
    type: SET_IS_LOGIN,
    login
});

export const setBasicAuth = auth => ({
    type: SET_BASIC_AUTH,
    auth
});

export const setAppChannel = channel => ({
    type: SET_APP_CHANNEL,
    channel
});

export const setCityData = city => ({
    type: SET_CITY_DATA,
    city
});