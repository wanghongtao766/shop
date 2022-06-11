import Vue from 'vue'
import App from './App'

// 导入网络请求的包
import { $http } from "@escook/request-miniprogram"
// 将$http挂载到 顶级对象 uni身上
uni.$http = $http

// 配置请求根路径
$http.baseUrl = 'http://www.uinav.com'
// 请求开始之前做的事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...'
  })
}
// 请求完成之后做的事情
$http.afterRequest = function () {
  uni.hideLoading()
}

// 封装消息提示的方法
uni.$showMsg = function(title='数据加载失败！', duration=1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

// 导入store实例对象
import store from '@/store/store.js'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
  // 将store挂载到Vue实例上
  store,
})
app.$mount()
