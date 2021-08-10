import Vue from 'vue'
import Router from 'vue-router'
import proxyNetwork from '../components/network.vue'
import proxyRule from '../components/rule.vue'
import proxyMock from '../components/mock.vue'
import proxyMonitor from '../components/monitor.vue'

Vue.use(Router);

const routes = [
    {path: '/', redirect: '/network'},
    {path: '/network', component: proxyNetwork},
    {path: '/rule', component: proxyRule},
    {path: '/mock', component: proxyMock},
    {path: '/monitor', component: proxyMonitor},
];

export default new Router({
    mode: 'history',
    routes
});