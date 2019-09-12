<template>
  <div class="connection-msg-right">
    <p class="right-topic">{{ topic }}</p>
    <div class="right-payload payload">
      <pre>{{ payload }}</pre>
    </div>
    <p class="right-time time">{{ time }}</p>
  </div>
</template>


<script>
export default {
  name: 'ConnectionMsgRight',
  props: {
    topic: String,
    payload: String,
    time: String,
  },
}
</script>


<style lang="scss" scoped>
@import "@/assets/scss/mixins.scss";
@import '@/assets/scss/variable.scss';

.connection-msg-right {
  text-align: right;
  @include msg-item;
  .right-payload {
    color: #fff;
    background: $color-main-green;
    border-radius: 12px 0 12px 12px;
    text-align: left;
  }
}
</style>
