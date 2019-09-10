<template>
  <div class="leftbar-top">
    <div class="logo">
      <img src="@/assets/logo.svg">
      <div class="site-title">MQTT Web Toolkit</div>
    </div>
    <div class="links">
      <a href="https://docs.emqx.io">Docs</a>
      <el-divider direction="vertical"></el-divider>
      <a href="https://github.com/emqx/emqx">Github</a>
    </div>
  </div>
</template>


<script>
export default {
  name: 'LeftbarTop',
};
</script>


<style scoped lang="scss">
@import '@/assets/scss/variable.scss';

.leftbar-top {
  text-align: center;
  height: 180px;
  border-bottom: 1px solid $color-white-border;

  .logo {
    margin-top: 20px;
    img {
      width: 56px;
    }
    .site-title {
      color: $color-main-green;
      margin-top: 6px;
      font-size: $font-size--title;
    }
  }

  .links {
    margin-top: 32px;
    a {
      color: $color-white-font;
      text-decoration: none;
      &:hover {
        color: $color-main-green;
      }
    }
  }
}
</style>
