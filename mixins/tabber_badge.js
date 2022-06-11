import { mapGetters } from 'vuex'

// 导出一个mixins对象
export default {
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  watch: {
    total() {
      this.setBadge()
    }
  },
  methods: {
    // 设置购物车tabbar的数字徽标方法
    setBadge() {
      uni.setTabBarBadge({
        index: 2,
        text: this.total + ''
      })
    }
  },
  onShow() {
    // 页面刚展示的时候 设置购物车tabber数字徽标
    this.setBadge()
  }
}
