<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar :radius="100" :cancelButton="none" @input="input"></uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sug-box" v-if="searchResults.length !== 0">
      <view class="sug-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="search-history" v-else>
      <!-- 标题 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
      </view>
      <!-- 搜素历史列表区域 -->
      <view class="history-list">
        <uni-tag v-for="(item, i) in historys" :key="i" :text="item" @click="gotoGoodList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 防抖的延时器
        timer: null,
        // 搜索的关键字
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索关键词的历史记录
        historyList: []
      }
    },
    onLoad() {
      // 页面刚加载 就加载出本地存储的数据
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    computed: {
      // 将搜索历史翻转 利用翻转后的数据渲染页面
      historys() {
        return [...this.historyList].reverse()
      }
    },
    methods: {
      // 获取搜索结果列表的方法
      async getSearchList() {
        // 用户输入为空的情况
        if (this.kw === '') {
          this.searchResults = []
          return
        }
        const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch?query=' + this.kw)
        // console.log(res);
        if (res.meta.status != 200) return uni.$showMsg()
        // 将请求到的数据保存到组件中
        this.searchResults = res.message
        
        // 获取到搜索建议后，调用保存搜索关键词的方法
        this.saveSearchHistory()
      },
      // 保存搜索关键词的方法
      saveSearchHistory() {
        // 利用set去重
        // 将historyList数组转化为Set对象
        const set = new Set(this.historyList) 
        // 以下两步操作是为了：最新搜索的关键词会拍到最前面
        set.delete(this.kw) 
        set.add(this.kw)
        // 将Set对象转化为数组
        this.historyList = Array.from(set)
        // 将处理好的关键词持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      // 搜索框输入事件
      input(e) {
        // 搜索时的防抖处理
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.kw = e.value
          // console.log(this.kw);
          // 获取搜索结果数据
          this.getSearchList()
        }, 1000)
      },
      // 前往商品详情页
      gotoDetail(goodsId) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goodsId
        })
      },
      // 清除搜素历史数据
      clearHistory() {
        this.historyList = []
        uni.removeStorageSync('kw')
      },
      // 搜素历史的item项 点击前往商品列表页
      gotoGoodList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    },

  }
</script>

<style lang="scss">
  // 实现搜索框的吸顶效果
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }
  
  // 搜索建议列表
  .sug-box {
    padding: 0 5px;
    
    .sug-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
    }
    
    .goods-name {
      // 文字不换行
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
  
  // 历史搜索记录
  .search-history {
    padding: 0 5px;
    
    .history-title {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #efefef;
      
      text {
        font-size: 14px
      }
    }
    
    .history-list {
      display: flex;
      flex-wrap: wrap;
      
      .uni-tag {
        margin: 5px;
      }
    }
  }
  
</style>
