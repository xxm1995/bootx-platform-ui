import storage from 'store'
import { login, getPermissions, getLoginAfterUserInfo, logout, loginOpenId } from '@/api/login/login'
import { ACCESS_TOKEN, CACHE_MULTI_TAB_COMPONENTS, USERINFO } from '@/store/mutation-types'
import { getFilePreviewUrl } from '@/api/common/fileUpload'

const user = {
  state: {
    token: '',
    welcome: '',
    permissions: [],
    info: {},
    avatarUrl: ''
  },

  mutations: {
    // 设置token
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    // 设置权限
    SET_PERMISSION: (state, permissions) => {
      state.permissions = permissions
    },
    // 设置用户信息
    SET_INFO: (state, info) => {
      state.info = info
    },
    // 设置头像
    SET_AVATAR_URL: (state, avatarUrl) => {
      state.avatarUrl = avatarUrl
    }
  },

  actions: {
    // 普通登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const token = response.data
          storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 三方登录
    loginOpenId ({ commit }, loginParam) {
      return new Promise((resolve, reject) => {
        loginOpenId(loginParam).then(response => {
          const token = response.data
          storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getLoginAfterUserInfo().then(response => {
          const result = response.data
          storage.set(USERINFO, result, 7 * 24 * 60 * 60 * 1000)
          commit('SET_INFO', result)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户菜单和按钮权限
    GetUserPermission ({ commit }) {
      return new Promise((resolve, reject) => {
        getPermissions(process.env.VUE_APP_ClIENT).then(response => {
          const result = response.data
          const resourcePerms = result.resourcePerms
          const menus = result.menus
          // 保存权限, 默认拥有访客权限,防止无权限情况下无限刷新
          resourcePerms.push('_GHOST')
          commit('SET_PERMISSION', resourcePerms)
          resolve({ permissionList: resourcePerms, menus })
          // 清除多标签缓存
          storage.remove(CACHE_MULTI_TAB_COMPONENTS)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户头像
    GetUserAvatarUrl ({ commit }, avatarId) {
      return new Promise((resolve, reject) => {
        getFilePreviewUrl(avatarId).then((result) => {
          const avatarUrl = result.data
          commit('SET_AVATAR_URL', avatarUrl)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout ({ commit, state }) {
      const resolve = new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
      resolve.then(() => {
        commit('SET_TOKEN', '')
        commit('SET_PERMISSION', [])
        commit('SET_INFO', {})
        storage.remove(ACCESS_TOKEN)
        storage.remove(USERINFO)
      })
      return resolve
    }

  }
}

export default user
