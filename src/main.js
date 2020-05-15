import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import ElementUI from 'element-ui' //可通过提示导入
import 'element-ui/lib/theme-chalk/index.css'

import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.config.productionTip = false
Vue.use(ElementUI, {
  size: 'small'
})
// import {
//   postRequst,
//   logoutRequest
// } from '@/util/api'



new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')