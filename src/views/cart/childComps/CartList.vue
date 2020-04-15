<template>
  <div class="cart-list">
    <cart-list-item v-for="(item,index) in cartList" :key="index"
    :itemInfo="item">
    </cart-list-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'


import CartListItem from './CartListItem'
export default {
  name: 'CartList',
  computed: {
    ...mapGetters(['cartList'])
  },
  components: {
    CartListItem
  }
}
</script>

<style scoped>
  
</style>