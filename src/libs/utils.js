import { forEach, objEqual, hasOneOf } from '@/libs/tools'
import md5 from 'js-md5'

export const encryptPwd = (userName, password) => md5(userName + password)

export const TOKEN_KEY = 'token'

export const USER_KEY = 'user'

export const MODULE_KEY = 'modules'

export const setToken = (token) => {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = () => {
  let token = window.localStorage.getItem(TOKEN_KEY)
  if (token) return token
  else return ''
}

export const setUser = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}

export const setModules = (modules) => {
  window.localStorage.setItem(MODULE_KEY, JSON.stringify(modules))
}

export const getModules = () => {
  return JSON.parse(window.localStorage.getItem(MODULE_KEY))
}

export const clearLocalStorage = () => {
  return window.localStorage.clear()
}

// 自定义判断元素类型JS
export const toType = (obj) => {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
export const filterNull = (o) => {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}

export const showTitle = (item, vm) => {
  let { title } = item.meta
  if (!title) return item.name
  return title
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute, modules) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) {
    return [homeItem]
  }
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hideInBread
  }).map(item => {
    let item2 = initRoute(item, modules)
    let meta = { ...item2.meta }
    if (meta.title && typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      meta.title = meta.title(route)
    }
    let obj = {
      icon: meta.icon || '',
      name: item2.name,
      meta: meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{ ...homeItem, to: homeRoute.path }, ...res]
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  list.forEach(item => delete item.component)
  localStorage.tagNaveList = JSON.stringify(list)
}

/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      // if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
      if (hasChild(item) && showThisMenuEle(item, access)) {
        item.meta.showAlways = true
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

export const formatRoute = (list, modules) => {
  if (!modules) {
    return
  }
  let forFn = (tree, obj, change) => {
    for (let index = 0; index < tree.length; index++) {
      if (change) {
        return
      }
      let el = tree[index]
      if (el.name === obj.name && el.path === obj.path) {
        change = true
        el.meta = initMeta({}, obj)
      } else {
        if (el.children && el.children.length > 0) {
          forFn(el.children, obj)
        }
      }
    }
  }
  modules.forEach(element => {
    forFn(list, element, false)
  })
  return list
}

export const initRoute = (route, modules) => {
  let _route = { meta: {}, ...route }
  if (modules && modules.length > 0) {
    modules.forEach(obj => {
      if (route.name === obj.name) {
        _route.meta = initMeta(_route.meta, obj)
      }
    })
  }
  return _route
}

export const initMeta = (srcMeta, destModule) => {
  return {
    ...srcMeta,
    title: destModule.title,
    hideInBreadd: !!parseInt(destModule.hideInBreadd),
    hideInMenu: !!parseInt(destModule.hideInMenu),
    notCache: !!parseInt(destModule.notCache),
    access: null,
    icon: destModule.icon,
    beforeCloseName: parseInt(destModule.closeConfirm) ? 'before_close_normal' : ''
  }
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let res = tagNavList.filter(item => routeEqual(item, routeItem))
  return res.length > 0
}

export const getRouteTitleHandled = (route, modules) => {
  route = initRoute(route, modules)
  let router = { ...route }
  let meta = { ...route.meta }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  let { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

export const toTree = (data) => {
  let maxLev = 0
  data.forEach(item => {
    item.lev = item.nodePath.split('-').length
    if (item.lev > maxLev) {
      maxLev = item.lev
    }
  })
  // 获取最高级kids
  let treeData = data.filter(item => item.lev === maxLev)
    .map(item => ({ expand: true, title: item.title, name: item.name, id: item.id, nodePath: item.nodePath, parentId: item.parent && item.parent.id }))
  for (let i = maxLev - 1; i > 0; i--) {
    let kids = treeData
    let parents = data.filter(item => item.lev === i)
      .map(item => ({ expand: true, title: item.title, name: item.name, id: item.id, nodePath: item.nodePath, parentId: item.parent && item.parent.id }))
    parents.forEach(parent => {
      parent.children = []
      kids.forEach(kid => {
        if (kid.parentId === parent.id) {
          parent.children.push(kid)
        }
      })
    })
    if (parents.length > 0) {
      // 下一等级kids
      treeData = parents
    }
  }
  return treeData
}
