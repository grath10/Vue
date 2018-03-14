import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权
import { Message } from 'element-ui'

// 鉴权
function hasPermission(roles, permissionRoles) {
  // admin权限
  if (roles.indexOf('admin') >= 0) 
    return true 
  if (!permissionRoles) 
    return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// register global progress
// 不重定向白名单
const whiteList = ['/login', '/authredirect']
router.beforeEach((to, from, next) => {
  // 开启Progress
  NProgress.start() 
  // 判断是否有token
  if (getToken()) { 
    if (to.path === '/login') {
      // router在hash模式下手动改变hash，重定向回来不会触发afterEach，暂时hack方案 
      // ps：history模式下无问题，可删除该行！
      next({ path: '/' })
      NProgress.done() 
    } else {
      // 判断当前用户是否已拉取完user信息
      if (store.getters.roles.length === 0) { 
        store.dispatch('GetUserInfo').then(res => { 
          // 拉取user信息
          const roles = res.data
          // store.dispatch('GenerateRoutes', { roles }).then(() => { 
            store.dispatch('GenerateRoutesFromMenu', { roles }).then(() => { 
            // 生成可访问路由表
            router.addRoutes(store.getters.addRouters) 
            // 动态添加可访问路由表
            next({ ...to }) 
            // hack方法 确保addRoutes已完成
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断
        if (hasPermission(store.getters.roles, to.meta.role)) {
          next()
        } else {
          next({ path: '/401', query: { noGoBack: true }})
          NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
      }
    }
  } else {
    // 在免登录白名单，直接进入
    if (whiteList.indexOf(to.path) !== -1) { 
      next()
    } else {
      // 全部重定向至登录页面
      next('/login') 
      NProgress.done() 
    }
  }
})

router.afterEach(() => {
  // 结束Progress
  NProgress.done() 
})
