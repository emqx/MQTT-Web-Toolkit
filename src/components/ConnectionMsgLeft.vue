<template>
  <div class="connection-msg-left">
    <p class="left-topic">{{ topic }}</p>
    <div class="left-payload payload">
      <pre>{{ payload }}</pre>
    </div>
    <p class="left-time time">{{ time }}</p>
  </div>
</template>


<script>
export default {
  name: 'ConnectionMsgLeft',
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

.connection-msg-left {
  text-align: left;
  @include msg-item;
  .left-payload {
    background: $color-main-grey;
    border-radius: 0px 12px 12px 12px;
  }
}
</style>
