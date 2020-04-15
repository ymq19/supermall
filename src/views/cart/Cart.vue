<template>
  <div class="cart">
    <nav-bar>
      <div slot="center">
        购物车({{ cartLength }})
      </div>
    </nav-bar>
    <scroll class="cart-content" ref="scroll">
      <cart-list></cart-list>
    </scroll>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import NavBar from 'components/common/navbar/NavBar'
import Scroll from 'components/common/scroll/Scroll'
import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'
export default {
  name: 'Cart',
  components: {
    NavBar,
    CartList,
    Scroll,
    CartBottomBar
  },
  computed: {
    // 两种语法
    ...mapGetters(['cartLength', 'cartList'])
  },
  activated() {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
  .cart-content {
    height: calc(100% - 49px - 44px - 40px);
    overflow: hidden;
  }
</style>
