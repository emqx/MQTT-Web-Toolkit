<template>
  <div class="home" @click="unFocusPublish">
    <Leftbar/>
    <div class="right-content">
      <ConnectionContent v-if="connections.length > 0"/>
      <EmptyPage v-else/>
    </div>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
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
  methods: {
    ...mapActions(['CHANGE_PUBLISH_FOCUS']),
    unFocusPublish() {
      this.CHANGE_PUBLISH_FOCUS(false)
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
