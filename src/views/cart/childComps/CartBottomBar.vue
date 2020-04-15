<template>
  <div class="bottom-bar">
    <div class="content">
      <checked-button class="checked-button" :is-checked="isSelectAll" @click.native="checkClick"></checked-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate">
      去计算({{checkedLength}})
    </div>
  </div>
</template>

<script>
import CheckedButton from 'components/content/checkButton/CheckButton'
export default {
  name: 'CartBottomBar',
  components: {
    CheckedButton
  },
  computed: {
    totalPrice() {
      return '￥' + this.$store.state.cartList.filter(item =>{
         return item.checked
      }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
    },
    checkedLength() {
      return this.$store.state.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if(this.$store.state.cartList.length) {
        return !(this.$store.state.cartList.filter(item => !item.checked).length)
      }else {
        return false
      }
    }
  },
  methods: {
    checkClick() {
      // 全部选中
      if(this.isSelectAll) {
        this.$store.state.cartList.forEach(item => item.checked = false);
      }else {
        this.$store.state.cartList.forEach(item => item.checked = true);
      }
      // this.$store.state.cartList.forEach(item => item.checked = !this.isSelectAll);
    }
  },
}
</script>

<style scoped>
  .bottom-bar {
    display: flex;
    position: relative;
    height: 40px;
    background-color: #eee;
    line-height: 40px;
  }
  .content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-right: 30px;
    width: 60px;
  }
  .checked-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price {
    flex: 1;
  }
  .calculate {
    width: 100px;
    background-color: var(--color-tint);
    text-align: center;
    color: #fff;
  }
</style>