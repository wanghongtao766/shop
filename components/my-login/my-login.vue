<template>
  <view>
    <view class="login-container">
      <!-- 提示登录的图标 -->
      <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
      <!-- 登录按钮 -->
      <!--  按钮绑定 open-type="getUserInfo" 属性，表示点击按钮时，希望获取用户的基本信息： -->
      <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
      <!-- 登录提示 -->
      <view class="tips-text">登录后尽享更多权益</view>
    </view>
  </view>
</template>

<script>
  import {
    mapMutations
  } from 'vuex'

  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
      // 点击一键登录按钮 获取用户相关信息
      getUserInfo(e) {
        // 判断是否获取用户信息成功
        if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
        // 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
        console.log(e.detail.userInfo);
        // 将用户信息存储到vuex
        this.updateUserInfo(e.detail.userInfo)
        // 获取token字符串
        this.getToken(e.detail)
      },
      // 调用登录接口 换取token
      async getToken(info) {
        // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err)
        // 判断 uni.login()是否调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // 换取token
        const { data: loginResult } = await uni.$http.get('/api/public/v1/users/wxlogin', query)
        console.log(loginResult);
        if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！！')
        // 更新 vuex 中的 token
        this.updateToken(loginResult.message.token)
        uni.$showMsg('登录成功')
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f8f8f8;
    position: relative;
    // overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 40px;
      left: 0;
      bottom: 0;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
