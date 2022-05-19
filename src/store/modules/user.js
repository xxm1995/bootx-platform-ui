import storage from 'store'
import { login, getPermissions, getLoginAfterUserInfo, logout, loginOpenId } from '@/api/login/login'
import { ACCESS_TOKEN, CACHE_MULTI_TAB_COMPONENTS } from '@/store/mutation-types'
import Vue from 'vue'
import { getFilePreviewUrl } from '@/api/common/fileUpload'

const user = {
  state: {
    token: '',
    welcome: '',
    roles: [],
    permissions: [],
    info: {},
    avatarUrl: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSION: (state, permissions) => {
      state.permissions = permissions
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_AVATAR_URL: (state, avatarUrl) => {
      state.avatarUrl = avatarUrl
    }
  },

  actions: {
    // 登录
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
          Vue.ls.remove(CACHE_MULTI_TAB_COMPONENTS)
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
        commit('SET_ROLES', [])
        storage.remove(ACCESS_TOKEN)
      })
      return resolve
    }

  }
}

export default user
