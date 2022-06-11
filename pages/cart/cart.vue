<template>
  <view>
    <view class="cart-container" v-if="cart.length !== 0">
      <!-- 购物车收货地址区域 -->
      <my-address></my-address>
      <!-- 购物车列表的标题区域 -->
      <view class="cart-title">
        <!-- 左侧的图标 -->
        <uni-icons type="shop" size="18"></uni-icons>
        <!-- 右侧文字 -->
        <text class="cart-title-text">购物车</text>
      </view>
      <!-- 购物车商品列表区域 -->
      <uni-swipe-action>
        <block v-for="(goods, i) in cart" :key="i">
          <uni-swipe-action-item :options="options" @click="swipeActionClickHandler(goods)">
            <my-goods :goods="goods" @radioChange="handleRadioChange" @numChange="handleNumChange"></my-goods>
          </uni-swipe-action-item>
        </block>
      </uni-swipe-action>
      <!-- 结算区域 -->
      <my-settle></my-settle>
    </view>
    <!-- 空白购物车区域 -->
    <view class="empty-cart" v-else>
      <image src="/static/cart_empty@2x.png" class="empty-img"></image>
      <text class="tip-text">空空如也~</text>
    </view>
  </view>
</template>

<script>
  // 引入封装的mixins模块
  import badgeMix from '@/mixins/tabber_badge.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'

  export default {
    data() {
      return {
        options: [{
          text: '删除', // 显示的文本内容
          style: {
            backgroundColor: '#c00000' // 按钮背景色
          }
        }]
      }
    },
    // 使用自己封装的mixins
    mixins: [badgeMix],
    computed: {
      // 将仓库中的cart数据映射到页面去
      ...mapState('m_cart', ['cart'])
    },
    methods: {
      // 将仓库的Mutation中的方法映射到页面
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      // 更新商品选中状态
      handleRadioChange(goodsData) {
        this.updateGoodsState(goodsData)
      },
      // 加入购物车商品数量改变
      handleNumChange(e) {
        this.updateGoodsCount(e)
      },
      // 点击滑动删除按钮
      swipeActionClickHandler(goods) {
        this.removeGoodsById(goods)
      }
    },
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }

  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;

    .cart-title-text {
      margin-left: 10px;
    }
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;

    .empty-img {
      width: 90px;
      height: 90px;
    }

    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
