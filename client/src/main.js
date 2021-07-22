import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import store from './store'
import router from './router'
// import * as types from './store/mutation-types'
// import _ from 'lodash'
import 'element-ui/lib/theme-chalk/index.css';
import VueI18n from 'vue-i18n'
import locales from './lang'


//全局插件
Vue.use(VueI18n);
Vue.use(ElementUI);
Vue.use({
    install (Vue) {
        //添加实例方法
        Vue.prototype.$ipc = global.ipcRenderer || {};
        Vue.prototype.$remoteApi = global.remoteApi;
    }
});

//language setting
console.log(global.setting)
// Vue.config.lang = global.setting.lang || 'en';
Vue.config.lang = 'zh-CN';


// const i18n = new VueI18n({
//     locale: 'ja', // 设置地区
//     ap, // 设置地区信息
// })

const i18nConfig = {
    locale: Vue.config.lang,
    messages: locales
}

// console.log(locales)
// console.log('local',Vue.locale )
// Object.keys(locales).forEach((lang) => {
    // i18nConfig[lang] = locales[lang]
// });

console.log(11, i18nConfig)

const i18n = new VueI18n(i18nConfig)

new Vue({
    el: '#app',
    store,
    router,
    i18n,
    render: h => h(App)
})