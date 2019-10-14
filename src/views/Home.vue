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
}
</style>
