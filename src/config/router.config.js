// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
import Welcome from '@/views/Welcome'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

/**
 * 登陆后基础路由, 与后端返回路由进行合并
 * @type {*[]}
 */
export const loginBaseRouterMap = [
  // 首页
  {
    path: '/dashboard',
    name: 'Welcome',
    component: Welcome,
    meta: { title: '首页', keepAlive: true, icon: bxAnaalyse }
  },
  {
    path: '/account',
    component: RouteView,
    hidden: true,
    redirect: '/account/center',
    name: 'account',
    meta: { title: '个人页', icon: 'user', keepAlive: true },
    children: [
      {
        path: '/account/center',
        name: 'center',
        component: () => import('@/views/account/center'),
        meta: { title: '个人中心', keepAlive: true }
      },
      {
        path: '/account/settings',
        name: 'settings',
        component: () => import('@/views/account/settings/Index'),
        meta: { title: '个人设置', keepAlive: true, hideHeader: true }
      }
    ]
  }

]

/**
 * 未登录基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Index')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },
  {
    path: '/settlement',
    name: 'settlement',
    component: () => import('@/views/demo/DemoIndex'),
    meta: { title: '结算台' }
  },
  {
    path: '/cashier',
    name: 'cashier',
    component: () => import('@/views/payment/cashier/Cashier'),
    meta: { title: '高级结算台' }
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
