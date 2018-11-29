import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
// 引用API文件
import * as api from './api'
import config from '@/config'
// 将API方法绑定到全局
Vue.prototype.$api = api

Vue.prototype.$config = config

Vue.config.productionTip = false

Vue.use(iView, {
  transfer: true,
  size: 'large'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
