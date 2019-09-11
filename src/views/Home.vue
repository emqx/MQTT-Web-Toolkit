<template>
  <div class="home">
    <Leftbar msg="Welcome to Your Vue.js App"/>
    <div class="right-content">
      <EmptyPage/>
    </div>
  </div>
</template>


<script>
import Leftbar from '@/components/Leftbar.vue'
import EmptyPage from '@/components/EmptyPage.vue'

export default {
  name: 'home',
  components: {
    Leftbar,
    EmptyPage,
  },
};
</script>


<style lang="scss">
.home {
  .right-content {
    margin-left: 300px;
  }
}
</style>
