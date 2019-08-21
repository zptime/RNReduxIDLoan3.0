import  {
    SET_IP,
    SET_TOKEN,
    SET_IS_LOGIN,
    SET_BASIC_AUTH,
    SET_APP_CHANNEL,
    SET_CITY_DATA
} from '../actions/types'

export const setIp = (state = '', action) => {
    let { type, ip } = action;
    switch (type) {
        case SET_IP:
            return ip;
        default:
            return state;
    }
}

export const setToken = (state = '', action) => {
    let { type, token } = action;
    switch (type) {
        case SET_TOKEN:
            return token;
        default:
            return state;
    }
}

export const setIsLogin = (state = 0, action) => {
    let { type, login } = action;
    switch (type) {
        case SET_IS_LOGIN:
            return login;
        default:
            return state;
    }
}

export const setBasicAuth = (state = 0, action) => {
    let { type, auth } = action;
    switch (type) {
        case SET_BASIC_AUTH:
            return auth;
        default:
            return state;
    }
}

export const setAppChannel = (state = {}, action) => {
    let { type, channel } = action;
    switch (type) {
        case SET_APP_CHANNEL:
            return channel;
        default:
            return state;
    }
}

export const setCityData = (state = [], action) => {
    let { type, city } = action;
    switch (type) {
        case SET_CITY_DATA:
            return city;
        default:
            return state;
    }
}
