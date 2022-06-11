<template>
  <view v-if="goods_info.goods_name" class="goods-detail-box">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods_info_box">
      <!-- 商品价格 -->
      <view class="goods_prise">￥{{ goods_info.goods_price }}</view>
      <!-- 信息主体 -->
      <view class="goods_body">
        <!-- 商品名称 -->
        <view class="goods_name">{{ goods_info.goods_name }}</view>
        <!-- 收藏 -->
        <view class="colle">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递: 免运费</view>
    </view>
    <!-- 商品详情区域 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    <!-- 底部商品导航区域 -->
    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'

  export default {
    data() {
      return {
        // 商品详情对象
        goods_info: {},
        // 左侧按钮组的配置对象
        options: [{
          icon: 'shop',
          text: '店铺'
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        // 右侧按钮组的配置对象
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      }
    },
    computed: {
      // 将total映射到页面
      ...mapGetters('m_cart', ['total'])
    },
    watch: {
      // 监听total的变化
      total: {
        handler(newVal) {
          // 通过find方法 找到购物车按钮的配置对象
          const findResult = this.options.find((x) => x.text === '购物车')
          if (findResult) {
            // 动态为购物车按钮的徽标赋值 info
            findResult.info = newVal
          }
        },
        immediate: true
      }
    },
    onLoad(options) {
      this.getGoodsDetail(options.goods_id)
    },
    methods: {
      // 获取商品详情数据的方法
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        // console.log(res);
        if (res.meta.status != 200) return uni.$showMsg()
        // 解决图片底部空白间隙的问题
        // 解决 .webp 格式图片在 ios 设备上无法正常显示的问题
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ')
          .replace(/webp/g, 'jpg')
        this.goods_info = res.message
      },
      // 轮播图的预览效果
      preview(i) {
        uni.previewImage({
          current: i,
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      // 左侧按钮的点击事件处理函数
      onClick(e) {
        if (e.content.text === '购物车') {
          // 切换到购物车页面
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      // 将cart模块的mutation中的addToCart方法映射到页面中使用
      ...mapMutations('m_cart', ['addToCart']),
      // 右侧按钮点击事件处理函数
      buttonClick(e) {
        if (e.content.text === '加入购物车') {
          // 组织一个商品的信息对象
          const goods = {
            goods_id: this.goods_info.goods_id, // 商品的Id
            goods_name: this.goods_info.goods_name, // 商品的名称
            goods_price: this.goods_info.goods_price, // 商品的价格
            goods_count: 1, // 商品的数量
            goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
            goods_state: true
          }
          // 将商品信息对象存储到购物车
          this.addToCart(goods)
        }
      },
    },


  }
</script>

<style lang="scss">
  // 轮播图
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  // 商品信息区域
  .goods_info_box {
    padding: 20px 0 25px 10px;

    .goods_prise {
      color: #c00000;
      font-size: 18px;
      margin-bottom: 10px;
    }

    .goods_body {
      display: flex;
      justify-content: space-between;

      .goods_name {
        font-size: 13px;
        padding-right: 10px;
      }

      .colle {
        font-size: 12px;
        width: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }

    .yf {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }

  // 底部导航区
  .goods_nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  // 防止底部导航区遮盖页面原本的内容
  .goods-detail-box {
    padding-bottom: 50px;
  }
</style>
