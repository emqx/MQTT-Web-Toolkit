<template>
  <div class="home">
    <Leftbar msg="Welcome to Your Vue.js App"/>
  </div>
</template>


<script>
import Leftbar from '@/components/Leftbar.vue';

export default {
  name: 'home',
  components: {
    Leftbar,
  },
};
</script>
