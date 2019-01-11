// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from "jquery"
import axios from "axios"
import Cookies from "vue-cookies"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
axios.defaults.withCredentials=true;
Vue.prototype.$axios = axios
Vue.prototype.$Cookies = Cookies
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

router.beforeEach(function(to,from,next){
  if(to.meta.requireAuth){
    if(Cookies.get("token")){
      console.log("ok")
      next()
    }else{
      next({name:"login",query:{backUrl:to.fullPath}})
    }
    
  }else{
    next()
  }
})