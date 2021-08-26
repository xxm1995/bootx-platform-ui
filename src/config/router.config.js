// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '主页' },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard/analysis',
        name: 'dashboard',
        redirect: '/dashboard/analysis/welcome',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse },
        children: [
          {
            path: '/dashboard/analysis/welcome',
            name: 'Welcome',
            component: () => import('@/views/Welcome'),
            meta: { title: '欢迎页', keepAlive: false }
          },
          // 外部链接
          {
            path: 'https://www.baidu.com/',
            hidden: true,
            name: 'Monitor',
            meta: { title: '监控页', target: '_blank' }
          },
          {
            path: '/dashboard/workplace',
            hidden: true,
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true }
          }
        ]
      },
      // 系统管理
      {
        path: '/system',
        redirect: '/system/user',
        component: RouteView,
        meta: { title: '系统管理', icon: 'form' },
        children: [
          {
            path: '/system/dict',
            name: 'Dict',
            component: () => import('@/views/modules/system/dict/DictList'),
            meta: { title: '字典管理' }
          },
          {
            path: '/system/user',
            name: 'User',
            component: () => import('@/views/modules/system/user/UserList'),
            meta: { title: '用户管理', keepAlive: true }
          },
          {
            path: '/system/role',
            name: 'Role',
            component: () => import('@/views/modules/system/role/RoleList'),
            meta: { title: '角色管理' }
          },
          {
            path: '/system/depart',
            name: 'Depart',
            component: () => import('@/views/modules/system/depart/DepartList'),
            meta: { title: '部门管理' }
          },
          {
            path: '/system/3',
            name: '3',
            component: () => import('@/views/exception/Dev'),
            meta: { title: '在线管理(对接中)' }
          },
          {
            path: '/system/client',
            name: 'Client',
            component: () => import('@/views/modules/system/client/ClientList'),
            meta: { title: '终端管理' }
          },
          {
            path: '/system/menu',
            name: 'Menu',
            component: () => import('@/views/modules/system/menu/MenuList'),
            meta: { title: '菜单权限管理' }
          },
          {
            path: '/system/path',
            name: 'Path',
            component: () => import('@/views/modules/system/path/PathList'),
            meta: { title: '请求权限管理' }
          }
        ]
      },
      {
        path: '/monitor',
        component: RouteView,
        meta: { title: '系统监控', icon: 'form' },
        children: [
          {
            path: 'http://gateway.dev.bootx.cn:9000/doc.html',
            name: 'ApiSwagger',
            meta: { title: '接口文档', target: '_blank' }
          },
          {
            path: 'http://sentinel.dev.bootx.cn:8080/',
            name: 'ApiSwagger',
            meta: { title: '流量监控', target: '_blank' }
          },
          {
            path: 'http://admin.dev.bootx.cn:8081/',
            name: 'ApiSwagger',
            meta: { title: '服务监控', target: '_blank' }
          },
          {
            path: 'http://elk.dev.bootx.cn:5601/',
            name: 'ApiSwagger',
            meta: { title: 'ELK日志', target: '_blank' }
          },
          {
            path: 'http://zipkin.dev.bootx.cn:9411/zipkin/',
            name: 'ApiSwagger',
            meta: { title: '链路追踪', target: '_blank' }
          }
        ]
      },
      // 通知中心(notice)
      {
        path: '/notice',
        redirect: '//notice/1',
        component: RouteView,
        meta: { title: '通知中心', icon: 'form' },
        children: [
          {
            path: '/notice/1',
            name: '1',
            component: () => import('@/views/exception/Dev'),
            meta: { title: '站内信配置(对接中)' }
          },
          {
            path: '/notice/email',
            name: 'email',
            component: () => import('@/views/exception/Dev'),
            meta: { title: '邮件通知配置(对接中)' }
          },
          {
            path: '/notice/sms',
            name: 'sms',
            component: () => import('@/views/exception/Dev'),
            meta: { title: '短信通知配置(对接中)' }
          },
          {
            path: '/notice/wechat',
            name: 'wechat',
            component: () => import('@/views/exception/Dev'),
            meta: { title: '微信通知配置(对接中)' }
          },
          {
            path: '/notice/wechat2',
            name: 'wechat2',
            component: () => import('@/views/exception/Dev'),
            meta: { title: '企业微信通知配置(对接中)' }
          },
          {
            path: '/notice/dingtalk',
            name: 'dingtalk',
            component: () => import('@/views/exception/Dev'),
            meta: { title: '钉钉通知配置(对接中)' }
          }
        ]
      },
      // 支付中心
      {
        path: '/payment',
        redirect: '/payment/1',
        component: RouteView,
        meta: { title: '支付中心', icon: 'form' },
        children: [
          {
            path: '/payment/merchant',
            name: 'merchant',
            component: RouteView,
            redirect: '/payment/merchant/list',
            meta: { title: '商户管理' },
            children: [
              {
                path: '/payment/merchant/list',
                name: 'MerchantList',
                component: () => import('@/views/payment/merchant/MerchantList'),
                meta: { title: '商户列表' }
              },
              {
                path: '/payment/merchant/apps',
                name: 'MerchantAppList',
                component: () => import('@/views/payment/merchant/app/MerchantAppList'),
                meta: { title: '应用列表' }
              },
              {
                path: '/payment/merchant/payConfig',
                component: RouteView,
                redirect: '/payment/merchant/payConfig/alipay',
                meta: { title: '支付配置' },
                children: [
                  {
                    path: '/payment/merchant/config/alipay',
                    name: 'AliPayConfig',
                    component: () => import('@/views/payment/merchant/config/alipay/AliPayConfigList'),
                    // component: () => import('@/views/exception/Dev'),
                    meta: { title: '支付宝配置' }
                  },
                  {
                    path: '/payment/merchant/payConfig/wxPay',
                    name: 'WxPayConfig',
                    component: () => import('@/views/exception/Dev'),
                    meta: { title: '微信支付配置' }
                  },
                  {
                    path: '/payment/merchant/payConfig/wallet',
                    name: 'WalletPayConfig',
                    component: () => import('@/views/exception/Dev'),
                    meta: { title: '钱包支付配置' }
                  },
                  {
                    path: '/payment/merchant/payConfig/cash',
                    name: 'CashPayConfig',
                    component: () => import('@/views/exception/Dev'),
                    meta: { title: '现金支付配置' }
                  }
                ]
              }
            ]
          },
          {
            path: '/payment/config',
            name: 'PaymentConfig',
            component: RouteView,
            meta: { title: '支付配置' },
            children: [
              {
                path: '/payment/config/channel',
                name: 'PayChannelList',
                component: () => import('@/views/payment/config/channel/ChannelList'),
                meta: { title: '支付通道' }
              },
              {
                path: '/payment/config/way',
                name: 'PayChannelWayList',
                component: () => import('@/views/payment/config/way/ChannelWayList'),
                meta: { title: '支付方式' }
              }
            ]
          },
          {
            path: '/payment/payment',
            name: 'PaymentPayment',
            component: RouteView,
            meta: { title: '交易记录' },
            children: [
              {
                path: '/payment/payment/list',
                name: 'PaymentList',
                component: () => import('@/views/payment/payment/PaymentList'),
                meta: { title: '支付记录' }
              },
              {
                path: '/payment/callbackList',
                name: 'CallbackList',
                component: () => import('@/views/payment/payment/callback/PayNotifyRecordList'),
                meta: { title: '回调记录' }
              }
            ]
          }
        ]
      },
      // 销售中心
      {
        path: '/sales',
        redirect: '/sales/strategy',
        component: RouteView,
        meta: { title: '销售中心', icon: 'form' },
        children: [
          {
            path: '/sales/strategy',
            name: 'strategy',
            redirect: '/sales/strategy',
            component: RouteView,
            meta: { title: '策略管理' },
            children: [
              {
                path: '/sales/strategy/list',
                name: 'strategyList',
                component: () => import('@/views/exception/Dev'),
                meta: { title: '策略定义管理(对接中)' }
              },
              {
                path: '/sales/strategy/Registered',
                name: 'strategyRegistered',
                component: () => import('@/views/exception/Dev'),
                meta: { title: '策略注册管理(对接中)' }
              }
            ]
          },
          {
            path: '/sales/activity',
            name: 'SalesActivity',
            component: () => import('@/views/exception/Dev'),
            meta: { title: '活动管理(对接中)' }
          },
          {
            path: '/sales/coupon',
            name: 'coupon',
            redirect: '/sales/coupon/template/',
            component: RouteView,
            meta: { title: '优惠券' },
            children: [
              {
                path: '/sales/coupon/template/',
                name: 'CouponTemplate',
                component: () => import('@/views/exception/Dev'),
                meta: { title: '优惠券模板(对接中)' }
              },
              {
                path: '/sales/coupon',
                name: 'strategyCoupon',
                component: () => import('@/views/exception/Dev'),
                meta: { title: '优惠券(对接中)' }
              }
            ]
          }
        ]
      },
      // forms
      {
        path: '/form',
        redirect: '/form/base-form',
        hidden: true,
        component: RouteView,
        meta: { title: 'menu.form', icon: 'form' },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/form/basicForm'),
            meta: { title: 'menu.form.basic-form', keepAlive: true }
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: 'menu.form.step-form', keepAlive: true }
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: 'menu.form.advanced-form', keepAlive: true }
          }
        ]
      },
      // list
      {
        path: '/list',
        name: 'list',
        component: RouteView,
        hidden: true,
        redirect: '/list/table-list',
        meta: { title: 'menu.list', icon: 'table' },
        children: [
          {
            path: '/list/table-list/:pageNo([1-9]\\d*)?',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: 'menu.list.table-list', keepAlive: true }
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/list/BasicList'),
            meta: { title: 'menu.list.basic-list', keepAlive: true }
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: 'menu.list.card-list', keepAlive: true }
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: 'menu.list.search-list', keepAlive: true },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('../views/list/search/Article'),
                meta: { title: 'menu.list.search-list.articles' }
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('../views/list/search/Projects'),
                meta: { title: 'menu.list.search-list.projects' }
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('../views/list/search/Applications'),
                meta: { title: 'menu.list.search-list.applications' }
              }
            ]
          }
        ]
      },

      // profile
      {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        hidden: true,
        redirect: '/profile/basic',
        meta: { title: 'menu.profile', icon: 'profile' },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic'),
            meta: { title: 'menu.profile.basic' }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: 'menu.profile.advanced' }
          }
        ]
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: RouteView,
        hidden: true,
        redirect: '/result/success',
        meta: { title: 'menu.result', icon: 'check-circle-o' },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: 'menu.result.success', keepAlive: false, hiddenHeaderContent: true }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: 'menu.result.fail', keepAlive: false, hiddenHeaderContent: true }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        hidden: true,
        redirect: '/exception/403',
        meta: { title: 'menu.exception', icon: 'warning' },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission' }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find' }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error' }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        hidden: true,
        redirect: '/account/center',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: 'menu.account.center', keepAlive: true }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true },
            hidden: true,
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.basic', hidden: true }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['user']
                }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'account.settings.menuMap.notification',
                  hidden: true,
                  keepAlive: true,
                  permission: ['user']
                }
              }
            ]
          }
        ]
      }

    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
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
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/demo/DemoIndex'),
    meta: { title: '结算台' }
  },
  {
    path: '/cashier',
    name: 'cashier',
    component: () => import('@/views/pay/cashier/PayPage'),
    meta: { title: '简单支付演示' }
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
