// 导入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'

// 导入购物车模块的vuex模块
import moduleCart from './cart.js'
// 导入用户相关模块
import moduleUser from './user.js'

// 安装插件
Vue.use(Vuex)

// 创建store实例对象
const store = new Vuex.Store({
  modules: {
    // 挂载购物车模块的vuex
    m_cart: moduleCart,
    m_user: moduleUser,
  },
})

// 向外共享store实例
export default store