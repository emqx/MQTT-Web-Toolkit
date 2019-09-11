<template>
  <div class="empty-page">
    <div>
      <img src="@/assets/images/no-connection.png">
    </div>
    <el-button plain>+ New Connection</el-button>
  </div>
</template>


<script>
export default {
  name: 'EmptyPage',
};
</script>


<style scoped lang="scss">
@import '@/assets/scss/variable.scss';

.empty-page {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: $width-leftbar;
  top: 40%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  text-align: center;
  img {
    width: 400px;
  }
  .el-button {
    margin-top: 32px;
    border: 2px solid $color-main-green;
    color: $color-main-green;
    border-radius: 0;
    &:hover, &:focus {
      border-color: $color-second-green;
      color: $color-second-green;
    }
  }
}
</style>
