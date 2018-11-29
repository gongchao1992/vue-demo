import Vue from 'vue'
import Vuex from 'vuex'
import {
  setToken,
  getToken,
  setUser,
  getUser,
  setModules,
  getModules,
  clearLocalStorage,
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  formatRoute,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled
} from '@/libs/utils'
import router from '@/router'
import routes from '@/router/routes'
import config from '@/config'

Vue.use(Vuex)

const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default new Vuex.Store({
  state: {
    token: getToken(),
    userInfo: getUser(),
    modules: getModules(),
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {}
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(formatRoute(routes, getModules()), [])
  },
  mutations: {
    login (state, resp) {
      let { token, user, modules } = resp
      state.token = token
      state.userInfo = user
      state.modules = modules
      setToken(token)
      setUser(user)
      setModules(modules)
    },
    logout (state) {
      state.token = false
      state.userInfo = {}
      state.modules = []
      clearLocalStorage()
    },
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute, state.modules)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    // 自定义关闭tag
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route, state.modules)
      console.log(router)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    }
  },
  actions: {

  }
})
