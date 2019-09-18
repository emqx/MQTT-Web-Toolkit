<template>
  <div class="home">
    <Leftbar msg="Welcome to Your Vue.js App"/>
    <div class="right-content">
      <ConnectionContent v-if="connections"/>
      <EmptyPage v-else/>
    </div>
  </div>
</template>


<script>
import Leftbar from '@/components/Leftbar.vue'
import EmptyPage from '@/components/EmptyPage.vue'
import ConnectionContent from '@/components/ConnectionContent.vue'

export default {
  name: 'home',
  components: {
    Leftbar,
    EmptyPage,
    ConnectionContent,
  },
  computed: {
    connections() {
      return this.$store.state.connections
    },
  },
};
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';

.home {
  .right-content {
    margin-left: $width-leftbar;
  }
}
</style>
