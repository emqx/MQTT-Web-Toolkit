<template>
  <div class="connection-msg-right">
    <div class="right-payload payload">
      <p class="right-info">
        <span class="topic">Topic: {{ topic }}</span>
        <span class="qos">QoS: {{ qos }}</span>
      </p>
      <pre>{{ payload }}</pre>
    </div>
    <p class="right-time time">{{ createAt }}</p>
  </div>
</template>


<script>
export default {
  name: 'ConnectionMsgRight',
  props: {
    topic: String,
    qos: Number,
    payload: String,
    createAt: String,
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
