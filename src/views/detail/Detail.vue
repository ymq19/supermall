<template>
  <div id="detail">
    <!--  -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probeType="3">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @itemLoad="imgLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-Info>
      <detail-comment-info ref="comment" :commentInfo="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>

  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'

import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'

import GoodsList from 'components/content/goods/GoodsList'

import {debounce} from 'common/utils'
import {itemListenerMixin} from 'common/mixin'

export default {
  name: 'Detail',
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: '',
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
    }
  },
  created() {
    this.iid = this.$route.params.iid
    getDetail(this.iid).then(res => {
      // console.log(res)
      const data = res.data.result
      this.topImages = data.itemInfo.topImages

      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 3.创建店铺信息对象
      this.shop = new Shop(data.shopInfo)

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo
      // console.log(this.detailInfo)

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // 6.获取评论信息
      if(data.rate.CRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      
    }),
    //请求推荐信息
    getRecommend().then( res => {
      this.recommends = res.data.data.list
    })
  },
  mounted() {
    // 1.图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 200)
      // 3.监听item中图片加载完成
    this.$bus.$on('itemImgLoad', () => {
        refresh()
    })
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop-44)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44)
      // console.log(this.themeTopYs)
    }, 100)
  },
  methods: {
    imgLoad() {
      // console.log('00')
      // debounce(this.$refs.scroll.refresh, 200)()
      this.newRefresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll(position) {
      // 获取y值
      const positionY = -position.y
      
      // 与主题里面中的值进行对比
      const length = this.themeTopYs.length
      for(let i = 0; i < length; i++) {
        if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY
          < this.themeTopYs[i+1]) || (i == length - 1 && positionY >= this.themeTopYs[i]))) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // 2.将商品添加到购物车
      // this.$store.commit('addCart', product)
      this.$store.dispatch('addCart', product).then(res => {
        this.$toast.show(res, 1500)
      })
    }
  },
  components: {
    Scroll,
    GoodsList,

    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar

  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 44px - 49px);
  }
</style>
