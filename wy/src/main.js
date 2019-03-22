import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import axios from 'axios'
Vue.prototype.axios = axios

import jQuery from 'jquery'
Vue.prototype.jQuery = jQuery
Vue.prototype.$ = jQuery

import moment from 'moment'
Vue.prototype.moment = moment

Vue.config.productionTip = false

router.beforeEach(function (to, from, next) {
  if (to.name == 'login') {
    next();
    return;
  }
  if (!store.state.isLogin) {
    router.push({name: 'login'});
  } else {
    next();
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
