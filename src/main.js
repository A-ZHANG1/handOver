import Vue from 'vue'

import BaiduMap from 'vue-baidu-map'
import Cookies from 'js-cookie'

import axios from 'axios'
Vue.prototype.$axios = axios

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

// import * as filters from './filters' // global filters


// Vue.use(ElementUI, { locale })
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium'// set element-ui default size
  ,locale
  // i18n: (key, value) => i18n.t(key, value)
})

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'K73Dbc6A1dKd3dLI0ikN5p83u5rKnGmy'
})

// register global utility filters.
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
