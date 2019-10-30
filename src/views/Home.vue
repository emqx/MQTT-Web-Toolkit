<template>
  <div class="home">
    <Leftbar/>
    <div class="right-content">
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
import Leftbar from '@/components/Leftbar.vue'

export default {
  name: 'home',
  components: {
    Leftbar,
  },
  computed: {
    connections() {
      return this.$store.state.connections
    },
  },
}
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';

.home {
  .right-content {
    margin-left: $width-leftbar;
  }
  .el-button {
    padding: 6px 15px;
    color: $color-main-green;
    border-color: $color-main-green;
    border-width: 2px;
    border-radius: 0;
  }
}
</style>
