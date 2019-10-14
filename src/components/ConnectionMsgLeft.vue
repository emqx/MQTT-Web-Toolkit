<template>
  <div class="connection-msg-left">
    <div class="left-payload payload">
      <p class="left-info">
        <span class="topic">Topic: {{ topic }}</span>
        <span class="qos">QoS: {{ qos }}</span>
      </p>
      <pre>{{ payload }}</pre>
    </div>
    <p class="left-time time">{{ createAt }}</p>
  </div>
</template>


<script>
export default {
  name: 'ConnectionMsgLeft',
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

.connection-msg-left {
  text-align: left;
  @include msg-item;
  .left-payload {
    background: $color-main-grey;
    border-radius: 0px 12px 12px 12px;
  }
}
</style>
