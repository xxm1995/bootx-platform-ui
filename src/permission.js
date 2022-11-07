import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { initWebSocket } from '@/websocket/userGlobalWebSocker'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  /* has token */
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // 检查登录 user.roles 是否为空
      if (store.getters.permissions.length === 0) {
        // 请求登录用户信息
        store
          .dispatch('GetUserPermission')
          .then(({ permissionList, menus }) => {
            // 连接全局websocket会话
            store.dispatch('GenerateRoutes', { permissionList, menus }).then(() => {
              // 动态添加可访问路由表
              const routers = store.getters.addRouters
              routers.forEach(r => router.addRoute(r))
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // 设置 replace: true 这样导航就不会留下历史记录
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
              // 不需要登录的页面不建立连接
              if ((!to?.meta?.ignoreLogin === true)) {
                initWebSocket().then()
              }
              // 字典初始化
              store.dispatch('InitDictList').then()
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // 判断组件是否可以免登陆
    if (to.meta && to.meta.ignoreLogin) {
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
