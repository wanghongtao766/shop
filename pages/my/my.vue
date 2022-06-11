<template>
  <view class="my-container">
    <!-- <view>{{ Object.keys(token).length }}</view> -->
    <!-- 用户信息 -->
    <!-- 若有token 则显示用户信息页 否则显示用户登录页 -->
    <my-userinfo v-if="Object.keys(token).length !== 0"></my-userinfo>
    <!-- 用户登录 -->
    <my-login v-else></my-login>
    
  </view>
</template>

<script>
  // 引入封装的mixins模块
  import badgeMix from '@/mixins/tabber_badge.js'
  import { mapState } from 'vuex'

  export default {
    // 使用自己封装的mixins
    mixins: [badgeMix],
    data() {
      return {

      }
    },
    computed: {
      ...mapState('m_user', ['token'])
    }

  }
</script>

<style lang="scss">
  page,
  .my-container {
    height: 100%;
  }
</style>
