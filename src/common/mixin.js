import {debounce} from './utils'
export const itemListenerMixin = {
  data() {
    return {
      newRefresh: null
    }
  },
  mounted() {
    this.newRefresh = debounce(this.$refs.scroll.refresh, 100)
  }
}
