<template>
  <div class="leftbar-top">
    <div class="logo" @click="linkToWebsite">
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
  methods: {
    linkToWebsite() {
      window.open('https://emqx.io', '_blank')
    },
  },
};
</script>


<style scoped lang="scss">
@import '@/assets/scss/variable.scss';

.leftbar-top {
  text-align: center;
  height: 176px;
  border-bottom: 1px solid $color-white-border;

  .logo {
    padding-top: 24px;
    img {
      width: 52px;
    }
    .site-title {
      color: $color-main-green;
      margin-top: 6px;
      font-size: $font-size--subtitle;
    }
    cursor: pointer;
    &:hover {
      .site-title {
        color: $color-second-green;
      }
    }
  }

  .links {
    margin-top: 24px;
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
