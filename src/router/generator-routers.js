// eslint-disable-next-line
import * as loginService from '@/api/login/login'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView, IframeView } from '@/layouts'
import { loginBaseRouterMap } from '@/config/router.config'
// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  IframeView: IframeView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),
  'Dev': () => import(/* webpackChunkName: "error" */ '@/views/exception/Dev'),

  // 你需要动态引入的页面组件
  'Workplace': () => import('@/views/dashboard/Workplace'),
  'Analysis': () => import('@/views/dashboard/Analysis'),

  // account
  'AccountCenter': () => import('@/views/account/center'),
  'AccountSettings': () => import('@/views/account/settings/Index'),
  'BaseSettings': () => import('@/views/account/base/BasicSetting'),
  'SecuritySettings': () => import('@/views/account/security/Security'),
  'CustomSettings': () => import('@/views/account/settings/Custom'),
  'BindingSettings': () => import('@/views/account/settings/Binding'),
  'NotificationSettings': () => import('@/views/account/settings/Notification'),

}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  key: '',
  name: 'BasicLayout',
  path: '',
  component: BasicLayout,
  redirect: '/dashboard',
  meta: {
    title: '首页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param menus
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (menus) => {
  return new Promise((resolve, reject) => {
    try {
      const menuNav = []
      // 登录后基础路由和后端返回路由进行拼装
      rootRouter.children = loginBaseRouterMap.concat(menus)
      menuNav.push(rootRouter)
      const routers = generator(menuNav)
      routers.push(notFoundRouter)
      // console.log(r-outers)
      resolve(routers)
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {}
    // 该路由对应页面的 组件 :如果是组件对象或函数，直接赋值不做处理，如果是字符串，进行动态查找
    let component
    let componentName
    if (typeof item.component === 'object') {
      // 如果传入的就是组件, 跳过下面操作
      component = item.component
      componentName = component.name
    } else if (typeof item.component === 'function') {
      component = item.component
    } else if (constantRouterComponents[item.component || item.key]) {
      // 先查询是否在 常量路由器组件 中定义，未定义根据传入路径进行引入
      component = (constantRouterComponents[item.component || item.key])
    } else {
      // 注意,  import 导入的菜单组件需要是在 /views/modules/ 目录下，原因是如果不对 import 导入路径限制，打包时会将所有可能会被用的的
      // 组件进行编译, 造成打包制品异常庞大
      component = () => import(`@/views/modules/${item.component}`)
      // 组件名称
      const name = item.component
      componentName = name.substring(name.lastIndexOf('/') + 1)
    }
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件
      component: component,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title || item.title,
        componentName: componentName,
        keepAlive: item.keepAlive,
        icon: icon || item.icon || null,
        hiddenHeaderContent: hiddenHeaderContent || item.hiddenHeaderContent,
        target: target || item.targetOutside ? '_blank' : null,
        targetOutside: item.targetOutside,
        url: item.path,
        permission: item.name
      }
    }
    // 是否设置了隐藏菜单
    if (hideChildren || item.hidden) {
      currentRouter.hidden = item.hidden
    }
    if (hideChildren || item.hideChildrenInMenu) {
      // 是否设置了隐藏子菜单
      currentRouter.hideChildrenInMenu = hideChildren || item.hideChildrenInMenu
    }
    // 处理外部链接
    if (!currentRouter.path.startsWith('http')) {
      // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
      currentRouter.path = currentRouter.path.replace('//', '/')
    } else {
      // 如果是内部打开的外部链接, 对path进行哈希编码, 否则可能会打不开
      if (!currentRouter.meta.targetOutside) {
        currentRouter.path = hash(currentRouter.path)
      }
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

// 哈希函数
function hash (s) {
  let hash = 0
  let i
  let chr
  if (s.length === 0) return hash
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return String(Math.abs(hash))
}
