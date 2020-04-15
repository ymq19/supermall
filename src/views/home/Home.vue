<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">
        购物街
      </div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']"
      @tabClick="tabClick" ref="tabControl1" class="tab-control" v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll" :probe-type="3" :pull-up-load="true" @scroll="contentScroll" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']"
      @tabClick="tabClick" ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>  
    <back-top @click.native="backClick" v-show="isShowBackUp"></back-top>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import TabControl from 'components/content/tabControl/TabControl' 
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'

import {getHomeMultidata, getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'

export default {
  name: 'Home',
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: {page: 0, list: []},
        new: {page: 0, list: []},
        sell: {page: 0, list: []}
      },
      currentType: 'pop',
      isShowBackUp: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    Scroll,
    TabControl,
    GoodsList,
    BackTop
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata()
    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  methods: {
    /** 
      事件监听的方法
    */
   
    tabClick(index) {
      switch(index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    backClick() {
      // console.log('ddd')
      // console.log(this.$refs.scroll.scroll.scrollTo)
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position) {
      // 1.判断BackTop是否显示
      this.isShowBackUp = -position.y > 1000
      // 2.判断tabContorl是否吸顶
      this.isTabFixed = -position.y > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      // 获取tabOffsetTop的offsetTop
      // 所有的组件都有一个属性$el：用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      // console.log(this.$refs.tabControl.$el.offsetTop)
    },
    /**
      网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.data.banner.list,
        this.recommends = res.data.data.recommend.list
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // console.log(res.data.data.list)
        this.goods[type].page++ 
        // ...依次解析，一个一个塞入
        this.goods[type].list.push(...res.data.data.list)
        // console.log(this.goods[type].list)
        // 父传子，调用finishPullUp方法
        this.$refs.scroll.finishPullUp()
      })
    }
  },
  mounted() {
    // 1.图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 200)
      // 3.监听item中图片加载完成
      this.$bus.$on('itemImageLoad', () => {
        refresh()
    })
  },
  activated() {
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY()
  }
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: white;
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
   /* .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  } */
  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
