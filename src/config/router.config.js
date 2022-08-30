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
    name: 'Dashboard',
    hidden: true,
    redirect: '/dashboard/welcome',
    component: RouteView,
    meta: { title: '首页', keepAlive: true, icon: bxAnaalyse },
    children: [
      {
        path: '/dashboard/welcome',
        name: 'Welcome',
        component: Welcome,
        meta: { title: '欢迎', keepAlive: true }
      }
    ]
  },
  {
    path: '/account',
    component: RouteView,
    hidden: true,
    redirect: '/account/center',
    name: 'Account',
    meta: { title: '个人页', icon: 'user', keepAlive: true },
    children: [
      {
        path: '/account/center',
        name: 'AccountCenter',
        component: () => import('@/views/account/center'),
        meta: { title: '个人中心', keepAlive: true }
      },
      {
        path: '/account/settings',
        name: 'AccountSettings',
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
        meta: { title: '登录', ignoreLogin: true },
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Index')
      },
      {
        path: 'forget',
        name: 'forget',
        meta: { title: '忘记密码', ignoreLogin: true },
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/ForgetPassword')
      },
      {
        path: 'register',
        name: 'register',
        meta: { title: '注册', ignoreLogin: true },
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      }
    ]
  },
  {
    path: '/cashier',
    name: 'cashier',
    component: () => import('@/views/payment/cashier/Cashier'),
    meta: { title: '结算台支付演示', ignoreLogin: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
