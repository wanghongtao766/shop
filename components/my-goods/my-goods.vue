<template>
  <view>
    <view class="goods-item">
      <!-- 左侧图片区域 -->
      <view class="goods-left">
        <radio :checked="goods.goods_state" color="#c00000" @click="radioClickHandler"></radio>
        <image :src="goods.goods_small_logo || defaultPic" class="goods-left-img"></image>
      </view>
      <!-- 右侧标题和价格 -->
      <view class="goods-right">
        <view class="goods-title">{{ goods.goods_name }}</view>
        <view class="goods-info-box">
          <!-- 商品价格 -->
          <view class="goods-prise">￥{{ goods.goods_price }}</view>
          <!-- 商品数量 -->
          <uni-number-box :min="1" :value="goods.goods_count" @change="numChangeHandler"></uni-number-box>
        </view>
      </view>
    </view>
  </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      }
    },
    props: {
      goods: {
        type: Object,
        default: {}
      }
    },
    methods: {
      // 点击radio勾选框
      radioClickHandler() {
        this.$emit('radioChange', {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        })
      },
      // 更改加入购物车商品数量
      numChangeHandler(val) {
        // console.log(val);
        this.$emit('numChange', {
          goods_id: this.goods.goods_id,
          goods_count: +val // val是字符串类型 +val将其转化为数值型
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    // 让 goods-item 项占满整个屏幕的宽度
    width: 750rpx;
    // 设置盒模型为 border-box
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #efefef;

    .goods-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-left-img {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .goods-title {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .goods-prise {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
</style>
