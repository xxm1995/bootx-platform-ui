import { findAllItem } from '@/api/system/dict'
const dict = {
  state: {
    dictList: []
  },

  mutations: {
    SET_DICT_LIST: (state, dictList) => {
      state.dictList = dictList
    }
  },

  actions: {
    // 登录
    InitDictList ({ commit }) {
      return new Promise((resolve, reject) => {
        findAllItem().then(response => {
          const dictList = response.data.map(response => {
            return {
              dictCode: response.dictCode,
              code: response.code,
              name: response.name
            }
          })
          commit('SET_DICT_LIST', dictList)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default dict
