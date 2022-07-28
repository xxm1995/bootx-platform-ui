/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 * multiTab - 多页签: boolean
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */

export default {
  // 主题色
  navTheme: 'light', // theme for nav menu
  // 默认主题色
  primaryColor: '#13C2C2', // primary color of ant design
  // 内容区布局
  layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  // 菜单栏是否固定
  fixedHeader: true, // sticky header
  // 菜单栏是否固定
  fixSiderbar: true, // sticky siderbar
  // 色弱模式(无效)
  colorWeak: false,
  // 多页签
  multiTab: true,
  // 标题
  title: 'Bootx Platform',
  iconfontUrl: '',
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
}
