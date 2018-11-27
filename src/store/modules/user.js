import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Ajax } from '../../utils/myAjax'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      // return new Promise((resolve, reject) => {
      //   const url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/User/?User.phone_num=' + username
      //   Ajax.get(url, function(data) {
      //     const ajaxData = JSON.parse(data)
      //     if (!ajaxData['User'] || ajaxData['User'].length < 1) {
      //       alert('用户名或密码错误')
      //     } else {
      //       const user2login = ajaxData['User'][0]
      //       if (user2login['passwd'] !== password) {
      //         alert('用户名或密码错误')
      //       } else {
      //         setToken('admin')
      //         commit('SET_TOKEN', 'admin')
      //       }
      //     }
      //     resolve()
      //   })

      // })

           return new Promise((resolve, reject) => {
        const url = 'http://47.107.241.57:8080/Entity/U2b963dc3176f9/hand_pass/User/?User.phone_num=' + username
        Ajax.get(url, function(data) {
          const ajaxData = JSON.parse(data)
          if (!ajaxData['User'] || ajaxData['User'].length < 1) {
            alert('用户名或密码错误')
          } else {
            const user2login = ajaxData['User'][0]
            if (user2login['passwd'] !== password) {
              alert('用户名或密码错误')
            } else {
              if(user2login['user_type']=='owner'){
                setToken('admin')
                commit('SET_TOKEN', 'admin')
              }else{
                setToken('editor')
                commit('SET_TOKEN', 'editor')
              }
              
            }
          }
          resolve()
        })
      }).catch(error => {
          reject(error)
        })
      console.log(user2login['passwd'])
       console.log("login")
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
        // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }



  }
}

export default user
