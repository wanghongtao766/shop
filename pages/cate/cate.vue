<template>
  <view>
    <!-- 自定义的搜索组件 -->
    <my-search @click.native="gotoSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view scroll-y="true" class="left-scroll" :style="{height: wh + 'px'}">
        <view v-for="(item, i) in cateList" :key="i" :class="['left-scroll-item', i === active? 'active' : '']"
          @click="changeActive(i)">
          {{ item.cat_name }}
        </view>
      </scroll-view>
      <!-- 右侧滑动区域 -->
      <scroll-view scroll-y="true" class="right-scroll" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item, i) in cateLevel2" :key="i">
          <!-- 二级分类标题 -->
          <view class="cate-lv2-title">{{ item.cat_name }}</view>
          <!-- 三级分类列表 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item2, i2) in item.children" :key="i2"
              @click="gotoGoodsList(item2.cat_id)">
              <image :src="item2.cat_icon"></image>
              <text>{{ item2.cat_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  // 引入封装的mixins模块
  import badgeMix from '@/mixins/tabber_badge.js'

  export default {
    data() {
      return {
        // 存储窗口可用高度
        wh: 0,
        // 左侧分类名数据
        cateList: [],
        // 当前选中项的索引
        active: 0,
        // 右侧二级分类数据
        cateLevel2: [],
        // 切换一级分类后重置滚动条的位置
        scrollTop: 0
      }
    },
    // 使用自己封装的mixins
    mixins: [badgeMix],
    onLoad() {
      // 获取当前设备信息
      const sysInfo = uni.getSystemInfoSync()
      // 获取可使用窗口的高度    减去自定义组件 my-search的高度
      this.wh = sysInfo.windowHeight - 50
      // 获取分类名的数据
      this.getCateList()
    },
    methods: {
      // 获取分类数据的方法
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        console.log(res);
        if (res.meta.status != 200) return uni.$showMsg()
        this.cateList = res.message
        // 为二级分类数据赋值
        this.cateLevel2 = res.message[0].children
      },
      // 选中项改变的事件处理函数
      changeActive(i) {
        this.active = i
        // 对二级分类列表重新赋值
        this.cateLevel2 = this.cateList[i].children
        // 让 scrollTop 的值在 0 与 1 之间切换
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 点击my-search组件
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      },
      // 点击三级分类item项 跳转到商品列表页
      gotoGoodsList(cid) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + cid
        })
      }
    }
  }
</script>

<style lang="scss">
  // 最外层父盒子
  .scroll-view-container {
    display: flex;
  }

  // 左侧
  .left-scroll {
    width: 120px;
  }

  .left-scroll-item {
    background-color: #f7f7f7;
    line-height: 60px;
    text-align: center;
    font-size: 12px;

    &.active {
      background-color: #ffffff;
      position: relative;

      &::before {
        content: '';
        width: 3px;
        height: 30px;
        background-color: #c00000;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  // 右侧 二级分类标题
  .cate-lv2-title {
    text-align: center;
    margin: 15px 0;
    font-weight: bold;
    font-size: 12px;
  }

  // 右侧 三级分类列表
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    image {
      width: 60px;
      height: 60px;
    }

    text {
      font-size: 12px
    }
  }
</style>
