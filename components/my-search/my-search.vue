<template>
  <view class="my-search-container" :style="{'background-color': bgColor}">
    <view class="my-search-box" :style="{'border-radius': radius + 'px'}">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    data() {
      return {
        
      }
    },
    // 增强组件的通用性，自定义组件的背景颜色以及圆角尺寸
    props: {
      bgColor: {
        type: String,
        default: '#C00000'
      },
      radius: {
        type: Number,
        // 单位是 px
        default: 18
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    height: 50px;
    // background-color: #C00000;
    padding: 0 10px;
    // border: 1px solid blue;
    display: flex;
    align-items: center;
    
    .my-search-box {
      height: 36px;
      line-height: 36px;
      width: 100%;
      // border-radius: 18px;
      background-color: #fff;
      display: flex;
      justify-content: center;
      
      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>