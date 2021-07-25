import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import store from './store'
import router from './router'
// import * as types from './store/mutation-types'
// import _ from 'lodash'
import 'element-ui/lib/theme-chalk/index.css';
import 'codemirror/lib/codemirror.css'

//全局插件
Vue.use(ElementUI);
Vue.use({
    install (Vue) {
        //添加实例方法
        Vue.prototype.$ipc = global.ipcRenderer || {};
        Vue.prototype.$remoteApi = global.remoteApi;
    }
});

//language setting
console.log('globalSetting', global.setting)

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})