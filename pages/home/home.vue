<template>
  <view>
    <!-- my-search组件 -->
    <view class="search-box">
      <my-search @click.native="gotoSearch"></my-search>
    </view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1500">
      <swiper-item v-for="(item, index) in swiperList" :key="index">
        <navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, index) in navList" :key="index" @click="handleNavClick(item)">
        <image :src="item.image_src"></image>
      </view>
    </view>
    <!-- 楼层区域 -->
    <view class="floot-list">
      <view class="floor-item" v-for="(item, index) in floorList" :key="index">
        <!-- 楼层标题 -->
        <view class="floor-title">
          <image :src="item.floor_title.image_src" class="floor-title"></image>
        </view>
        <!-- 楼层图片 -->
        <view class="floor-img-box">
          <!-- 左侧大盒子 -->
          <navigator class="left-img" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" mode="widthFix"
              :style="{width: item.product_list[0].image_width + 'rpx'}"></image>
          </navigator>
          <!-- 右侧四个小盒子 -->
          <view class="right-img">
            <navigator class="right-img-item" v-for="(rimg, index) in item.product_list" :key="index" v-if="index != 0"
              :url="rimg.url">
              <image :src="rimg.image_src" mode="widthFix" :style="{width: rimg.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  // 引入封装的mixins模块
  import badgeMix from '@/mixins/tabber_badge.js'

  export default {
    data() {
      return {
        // 轮播图数据
        swiperList: [],
        // 分类导航的数据
        navList: [],
        // 楼层数据列表
        floorList: []
      };
    },
    // 使用自己封装的mixins
    mixins: [badgeMix],
    onLoad() {
      // 页面刚加载调用获取轮播图数据的方法
      this.getSwiperList()
      // 获取分类导航数据
      this.getNavList()
      // 获取楼层数据列表
      this.getFloorList()
    },
    methods: {
      // 获取轮播图数据的方法
      async getSwiperList() {
        // 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // console.log(res)
        // 请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        this.swiperList = res.message
      },
      // 请求分类导航数据
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
      },
      // 点击分类导航第一项 切换到分类页面
      handleNavClick(item) {
        if (item.name == "分类") {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 获取楼层数据的方法
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        console.log(res);
        if (res.meta.status != 200) return uni.$showMsg()
        // 对原来的url进行处理
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      // 点击my-search组件
      gotoSearch() {
        uni.navigateTo({
          url: "/subpkg/search/search"
        })
      }
    }
  }
</script>

<style lang="scss">
  // my-search组件
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  // 轮播图区域
  swiper {
    height: 330rpx;
  }

  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }

  // 分类导航区
  .nav-list {
    display: flex;
    justify-content: space-between;
    margin: 15rpx 0;
  }

  .nav-item image {
    width: 128rpx;
    height: 140rpx;
  }

  // 楼层区域
  .floor-title {
    height: 60rpx;
    width: 100%;
  }

  .floor-img-box {
    display: flex;
    justify-content: space-between;
    padding-left: 10rpx;
  }

  .right-img {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
</style>
