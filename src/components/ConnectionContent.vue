<template>
  <div class="connection-content">
    <div class="top-bar">
      <span class="client-name">Device XXX</span>
      <a href="javascript:;" title="Disconenct">
        <span class="iconfont icon-disconnect"></span>
      </a>
    </div>
    <div class="filter-bar">
      <el-button plain>+ New Sub</el-button>
      <el-radio-group size="mini" v-model="messageType">
        <el-radio-button label="All"></el-radio-button>
        <el-radio-button label="Received"></el-radio-button>
        <el-radio-button label="Published"></el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>


<script>
export default {
  name: 'ConnectionContent',
  data() {
    return {
      messageType: 'All',
    }
  },
};
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';

.connection-content {
  .top-bar, .filter-bar {
    position: fixed;
    left: $width-leftbar;
    right: 0;
  }
  .top-bar {
    padding: 0 32px;
    height: $height--connection-topbar;
    line-height: $height--connection-topbar;
    border-bottom: 1px solid $color-border--black;
    .client-name {
      color: $color-font-black-title;
      font-size: $font-size--subtitle;
      font-weight: 500;
    }
    .icon-disconnect {
      font-weight: 600;
      float: right;
      font-size: $font-size--title;
      color: $color-bg--black;
      &:hover {
        color: $color-main-green;
      }
    }
  }
  .filter-bar {
    padding: 16px 32px;
    top: $height--connection-topbar;
    .el-button {
      font-size: 12px;
      width: 96px;
      border-radius: 0px;
      padding: 6px 0;
      border: 2px solid $color-main-green;
      color: $color-main-green;
      &:hover, &:focus {
        border-color: $color-second-green;
        color: $color-second-green;
      }
    }
    .el-radio-group {
      float: right;
      .el-radio-button__inner {
        padding: 6px 15px;
        border-radius: 0;
        width: 80px;
        border-width: 2px;
      }
    }
  }
}
</style>
