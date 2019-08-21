import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'

const configureStore = preloadedState => {
    const middlewares = [thunk]
    /** 在开发者模式下开启打印日志功能**/
    if (process.env.NODE_ENV === 'development') {
        const logger = createLogger();
        //redux 日志打印
        middlewares.push(logger);
    }
    const middlewareEnhancer = applyMiddleware(...middlewares)

    const store = createStore(rootReducer, preloadedState, middlewareEnhancer)

    return store
}

// 原始默认state
const defaultState = {
    ip: '',
    token: '',
    isLogin: 0,
    basicAuth: 0,
    appChannel: {
        utm_source: 'android_official',
        utm_medium: 'cpi',
        utm_term: '',
        utm_content: 'apk',
        utm_campaign: '',
    },
    cityData: []
}
const store = configureStore(defaultState)

export default store