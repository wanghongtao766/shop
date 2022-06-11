<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" @click="chooseAddress">请选择收获地址+</button>
    </view>
    <!-- 收货信息的盒子 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">收货人: {{ address.userName }}</view>
        <view class="row-right">
          <view class="phone">电话：{{ address.telNumber }}</view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-address">收货地址: {{addressStr}} </view>
      </view>
    </view>
    <!-- 底部的边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'
  
  export default {    
    name: "my-address",
    data() {
      return {
      }
    },
    computed: {
      // 从vuex中取出地址信息，在页面上使用
      ...mapState('m_user', ['address']),
      ...mapGetters('m_user', ['addressStr'])
      // addressStr() {
      //   if (!this.address.provinceName) return ''
      //   return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
      // }
    },
    methods: {
      ...mapMutations('m_user', ['updateAddress']),
      // 选择收货地址
      async chooseAddress() {
        const [err, succ] = await uni.chooseAddress().catch(err => err)
        // 用户成功选择了收货地址
        if (err === null && succ.errMsg === 'chooseAddress:ok') {
          // 将地址信息存储到vuex中
          this.updateAddress(succ)
          // console.log(succ);
        }
      }
    }
  }
</script>

<style lang="scss">
  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .address-border {
    display: block;
    height: 5px;
    width: 100%;
  }
  
  .address-info-box {
    box-sizing: border-box;
    font-size: 12px;
    height: 90px;
    padding: 15px 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    
    .row1 {
      display: flex;
      justify-content: space-between;
      
      .row-right {
        display: flex;
        align-items: center;
        .phone {
          margin-right: 5px;
        }
      }
    }
  }
</style>
