import Vue from 'vue'
import Router from 'vue-router'
import register from '@/components/register'
import login from '@/components/login'
import index from "@/components/index"
import homepage from "@/components/homepage"
Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: homepage,
      meta:{
        requireAuth:true
      }
    },
  ]
})
