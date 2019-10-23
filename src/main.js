import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueRouter from 'vue-router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

const ser = Vue.prototype.axios = axios.create({
  baseURL: 'http://localhost:8088/api/'
})

//防止报Uncaught
var originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(localtion,onResolve,onReject){
  if (onReject || onReject) return originalPush.call(this,localtion,onReject,onResolve)
  return originalPush.call(this,localtion).catch(err=>err)
}

ser.interceptors.request.use(config => {
  // 每次提交携带token，2019-9-6 携带token后台被拦截
  // console.log(sessionStorage.getItem('loginToken'))
   /*if (sessionStorage.getItem('loginToken')) {
    config.headers.Authorization = `${sessionStorage.getItem('loginToken')}`
    // console.log('123')
  }*/
  return config
}, error => {
  return Promise.reject(error)
})

ser.interceptors.response.use((response) => {
  // console.log(response)
  return response
}, error => {
  console.log(error)
  if (error.response.status) {
    switch (error.response.status) {
      case 404:
        ElementUI.Message({
          title: '出问题啦',
          message: '服务器已挂',
          type:'error'
        })
        break
      case 500:
        ElementUI.Message({
          title: '出问题啦',
          message: '客户端无法修复服务器',
          type:'error'
        })
        break
      case 301:
        ElementUI.Message({
          title: '出问题啦',
          message: '禁止浏览器重定向',
          type:'error'
        })
        break
      case 406:
        ElementUI.Message({
          title: '出问题啦',
          message: '我解析不了',
          type:'error'
        })
        break
      case 400:
        ElementUI.Message({
          title: '出问题啦',
          message: '服务器解析错误',
          type:'error'
        })
        break
      case 401:
        ElementUI.Message({
          title: '出问题啦',
          message: '请使用正确的认证正数',
          type:'error'
        })
        break
      case 101:
        ElementUI.Message({
          title: '出问题啦',
          message: '请切换到http的新版本',
          type:'error'
        })
        break
      case 405:
        ElementUI.Message({
          title: '出问题啦',
          message: '接口出错',
          type:'error'
        })
    }
  }
  return Promise.reject(error)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
