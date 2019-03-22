import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: sessionStorage.getItem('isLogin') || false,
    userInfo: sessionStorage.getItem('userInfo')
      ? JSON.parse(sessionStorage.getItem('userInfo'))
      : null
  },
  mutations: {
    login(state, user) {
      sessionStorage.setItem("isLogin", true);
      state.isLogin = true;
      sessionStorage.setItem("userInfo", JSON.stringify(user));
      state.userInfo = user;
    },
    logout(state) {
      sessionStorage.clear();
      state.isLogin = false;
      state.userInfo = null;
    }
  },
  actions: {}
})
