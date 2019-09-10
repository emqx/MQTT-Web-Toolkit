<template>
  <div class="leftbar">
    <LeftbarTop/>
  </div>
</template>


<script>
import LeftbarTop from './LeftbarTop.vue';

export default {
  name: 'Leftbar',
  props: {
    msg: String,
  },
  components: {
    LeftbarTop,
  },
};
</script>


<style scoped lang="scss">
@import '@/assets/scss/variable.scss';

.leftbar {
  position: fixed;
  width: 300px;
  top: 0;
  bottom: 0;
  overflow-x: hidden;
  z-index: 1000;
  background-color: $color-black-bg;
}
</style>
