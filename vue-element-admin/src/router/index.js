import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading, because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/**
* icon : the icon show in the sidebar
* hidden : if `hidden: true` will not show in the sidebar
* redirect : if `redirect: noredirect` will not redirect in the levelbar
* noDropdown : if `noDropdown: true` will have no submenu
* meta : { role: ['admin'] }  will control the page to be seen or not
**/
// 固定常量路由表
export const constantRouterMap = [
    { path: '/login', component: _import('login/index'), hidden: true },
    { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
    { path: '/404', component: _import('errorPage/404'), hidden: true },
    { path: '/401', component: _import('errorPage/401'), hidden: true },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      name: '首页',
      hidden: true,
      children: [{ path: 'dashboard', component: _import('pages/dashboard') }]
    }
]

export default new Router({
  // mode: 'history', // 后端支持可开,否则会报404等错误
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    name: '数据展示',
    path: '/history',
    component: Layout,
    children: [{
        name: '按设备查看',
        path: 'device',
        component: _import('pages/history-by-device')
      },{
        name: '按类型查看',
        path: 'type',
        component: _import('pages/history-by-type')
      }]
  },{
    name: '系统配置',
    path: '/management',
    component: Layout,
    children: [{
        name: '用户管理',
        path: 'user',
        component: _import('pages/user')
      },{
        name: '设备管理',
        path: 'hardware',
        component: _import('pages/device')
      },{
        name: '参数设置',
        path: 'parameter',
        component: _import('pages/parameter')
      }]
  }
]    