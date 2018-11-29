import axios from 'axios'
import router from '@/router'
import store from '@/store'
import config from '@/config'
import { filterNull } from '@/libs/utils'

// 基础path
axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.NODE_ENV === 'development'
  ? config.baseUrl.dev
  : config.baseUrl.pro

// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//配置请求头
// axios.defaults.headers.delete['Content-Type'] = 'application/json;charset=UTF-8'
// 添加一个请求拦截器
axios.interceptors.request.use(
  config => {
    if (store.state.token) {
      config.headers.Authorization = store.state.token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 添加一个响应拦截器
axios.interceptors.response.use(
  response => {
  // store.state.loading = false
    if (response.data && response.data.code) {
      if (parseInt(response.data.code) === 401) {
      // 401 跳转到登录页面
        router.currentRoute.path !== 'login' &&
          router.replace({
            path: 'login',
            query: {
              redirect: router.currentRoute.path
            }
          })
      }
    }
    return response
  },
  err => {
  // Do something with response error
    return Promise.reject(err)
  })

function _succ (res) {
  console.log(res)
}

function _fail (err) {
  console.error(err)
}

// 通用方法
export const POST = (url, params, succ = _succ, fail = _fail) => {
  if (params) {
    params = filterNull(params)
  }
  return axios.post(url, params)
    .then(res => res.data)
    .then(data => {
      if (parseInt(data.code) === 200 || parseInt(data.code) === 304) {
        succ(data)
      } else {
        fail(data)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

export const GET = (url, params, succ = _succ, fail = _fail) => {
  if (params) {
    params = filterNull(params)
  }
  return axios.get(url, {
    params: params
  })
    .then(res => res.data)
    .then(data => {
      if (parseInt(data.code) === 200 || parseInt(data.code) === 304) {
        succ(data)
      } else {
        fail(data)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

export const PUT = (url, params, succ = _succ, fail = _fail) => {
  if (params) {
    params = filterNull(params)
  }
  return axios.put(url, params)
    .then(res => res.data)
    .then(data => {
      if (parseInt(data.code) === 200 || parseInt(data.code) === 304) {
        succ(data)
      } else {
        fail(data)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

export const DELETE = (url, params, succ = _succ, fail = _fail) => {
  if (params) {
    params = filterNull(params)
  }
  return axios.delete(url, {
    data: params
  })
    .then(res => res.data)
    .then(data => {
      if (parseInt(data.code) === 200 || parseInt(data.code) === 304) {
        succ(data)
      } else {
        fail(data)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

export const PATCH = (url, params, succ = _succ, fail = _fail) => {
  if (params) {
    params = filterNull(params)
  }
  return axios.patch(url, params)
    .then(res => res.data)
    .then(data => {
      if (parseInt(data.code) === 200 || parseInt(data.code) === 304) {
        succ(data)
      } else {
        fail(data)
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}
