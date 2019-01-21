import Vue from 'vue'
import Router from 'vue-router'
import register from '@/components/register'
import login from '@/components/login'
import index from "@/components/index"
import homepage from "@/components/homepage"
import todayList from "@/components/today_list"
import planList from "@/components/plan_list"
import today from "@/components/today"
import plan from "@/components/plan"
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
      component: homepage,
      meta:{
        requireAuth:true
      },
      children:[{
        path: '/',
        name: 'todayList',
        component: todayList,
        meta:{
          requireAuth:true
        }
      },
      {
        path: '/homepage/today/:id',
        name: 'today',
        component: today,
        meta:{
          requireAuth:true
        }
      },      
      {
        path: '/homepage/plan_list',
        name: 'planList',
        component: planList,
        meta:{
          requireAuth:true
        }
      },
      {
        path: '/homepage/plan',
        name: 'plan',
        component: plan,
        meta:{
          requireAuth:true
        }
      },  
    ]
    },
  ]
})
