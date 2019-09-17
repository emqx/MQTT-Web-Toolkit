<template>
  <div class="leftbar">
    <LeftbarTop/>
    <LeftbarConnections/>
    <a href="javascript:;" class="new-connection-btn" @click="showNewConnectionDialog=true">
      + New Connection
    </a>
    <new-connection :visible.sync="showNewConnectionDialog"></new-connection>
  </div>
</template>


<script>
import LeftbarTop from '@/components/LeftbarTop.vue'
import LeftbarConnections from '@/components/LeftbarConnections.vue'
import NewConnection from '@/components/NewConnection.vue'

export default {
  name: 'Leftbar',
  props: {
    msg: String,
  },
  components: {
    LeftbarTop,
    LeftbarConnections,
    NewConnection,
  },
  data() {
    return {
      showNewConnectionDialog: false,
    }
  },
};
</script>


<style scoped lang="scss">
@import '@/assets/scss/variable.scss';

.leftbar {
  position: fixed;
  width: $width-leftbar;
  top: 0;
  bottom: 0;
  overflow-x: hidden;
  z-index: 1000;
  background-color: $color-bg--black;
  .new-connection-btn {
    position: fixed;
    bottom: 0;
    width: $width-leftbar;
    height: $height--new-connection-btn;
    background-color: $color-main-green;
    color: $color-font--white-title;
    text-decoration: none;
    line-height: $height--new-connection-btn;
    text-align: center;
    font-size: $font-size--subtitle;
  }
}
</style>
