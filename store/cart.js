export default {
  namespaced: true,
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
  }),
  mutations: {
    // mutations封装一个加入购物车的方法
    addToCart(state, goods) {
      // 判断购物车中是否已经存在此商品
      const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
      if (!findResult) {
        // 购物车中不存在此商品
        state.cart.push(goods)
      } else {
        // 购物车中已经存在此商品
        findResult.goods_count ++
      }
      // 将购物车数据持久化存储
      this.commit('m_cart/saveToStorage')
    },
    // 将购物车的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      // 找到需要更新状态的商品
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储
        this.commit('m_cart/saveToStorage')
      }
    },
    // 更新购物车的商品数量
    updateGoodsCount(state, goods) {
      // 找到需要更新数量的商品
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    // 根据id 从购物车删除商品
    removeGoodsById(state, goods) {
      state.cart = state.cart.filter(x => x.goods_id !== goods.goods_id)
      this.commit('m_cart/saveToStorage')
    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    },
    
  },
  getters: {
    // 统计购物车的总数量
    total(state) {
      let c = 0
      state.cart.forEach(goods => {
        c += goods.goods_count
      })
      return c
    },
    // 计算勾选商品的总数量
    checkedCount(state) {
      // 先过滤出已经被选中的商品
      // 再对选中的商品数量累加
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已勾选商品的总价
    checkedGoodsAmount(state) {
      return state.cart.filter(x => x.goods_state)
                       .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
                       .toFixed(2)
    }
  }
}
