<template>
  <view>
    <view class="goods-list" v-for="(goods, i) in goodsList" :key="i">
      <view class="goods-item" @click="gotoDetail(goods.goods_id)">
        <!-- 左侧图片区域 -->
        <view class="goods-left">
          <image :src="goods.goods_small_logo || defaultPic"></image>
        </view>
        <!-- 右侧标题和价格 -->
        <view class="goods-right">
          <view class="goods-title">{{ goods.goods_name }}</view>
          <view class="goods-prise">￥{{ goods.goods_price | tofixed }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 获取商品列表数据 事先定义一个请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 分类id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 保存商品列表数据
        goodsList: [],
        // 总条数
        total: 0,
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
        // 节流阀
        isloading: false
      }
    },
    onLoad(option) {
      // 将页面跳转时携带的参数传递给参数对象
      this.queryObj.cid = option.cid || ''
      this.queryObj.query = option.query || ''
      // 调用获取goodsList数据的方法
      this.getGoodsList()
    },
    methods: {
      async getGoodsList(cb) {
        // 发起请求前开启节流阀
        this.isloading = true
        const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 请求结束后关闭节流阀
        this.isloading = false
        // 按需调用cb函数
        cb && cb()
        // console.log(res);
        if (res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
      },
      // 点击商品列表的item项 去往商品详情页
      gotoDetail(goodsId) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goodsId
        })
      }
    },
    // 上拉触底的事件
    onReachBottom() {
      // 判断数据是否加载完毕
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕')
      // 节流阀开启状态，表示正在请求数据，则不发起额外的请求
      if (this.isloading) return 
      this.queryObj.pagenum += 1
      this.getGoodsList()
    },
    // 下拉刷新
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.goodsList = []
      this.isloading = false
      // 重新发起请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
    },
    filters: {
      // 处理价格的过滤器  将数字处理为带两位小数点的数字
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #efefef;
    
    .goods-left {
      margin-right: 5px;
      
      image {
        width: 100px;
        height: 100px;
        display: block;
      }
    }
    
    .goods-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .goods-title {
        font-size: 13px;
      }
      
      .goods-prise {
        font-size: 16px;
        color: #c00000;
      }
    }
  }

</style>
