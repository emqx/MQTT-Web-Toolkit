<template>
  <div class="connection-msg-publish">
    <div :class="['connections-input', isEdit ? 'message' : 'message-disabled']">
      <el-input
        :placeholder="isEdit ? 'Topic' : 'Write a message'"
        v-model="message.topic"
        @focus="isEdit = true">
      </el-input>
      <div class="qos-retain" v-if="isEdit">
        <span class="publish-label">QoS: </span>
        <el-radio-group v-model="message.qos">
          <el-radio :label="0"></el-radio>
          <el-radio :label="1"></el-radio>
          <el-radio :label="2"></el-radio>
        </el-radio-group>
        <span class="publish-label">Retain: </span>
        <el-checkbox v-model="message.retain"></el-checkbox>
      </div>
      <el-input
        v-if="isEdit"
        type="textarea"
        rows="4"
        placeholder="Payload"
        v-model="message.payload">
      </el-input>
      <a
        href="javascript:;"
        class="send-btn"
        @click="sendMsg">
        <i class="iconfont icon-send"></i>
      </a>
    </div>
  </div>
</template>


<script>
export default {
  name: 'ConnectionMsgPublish',
  data() {
    return {
      isEdit: false,
      message: {
        topic: '',
        qos: 0,
        retain: false,
        payload: JSON.stringify({ msg: 'hello' }, null, 2),
      },
    }
  },
  methods: {
    sendMsg() {
      if (!this.isEdit) {
        return
      }
      this.isEdit = false
    },
  },
}
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';
@import '@/assets/scss/mixins.scss';

.connection-msg-publish {
  position: fixed;
  width: inherit;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: 300px;
  .connections-input {
    background: #fff;
    border-top: 1px solid $color-border--black;
    padding: 0px $spacing--connection-content;
    transition: .3s height;
    .el-input__inner {
      border: 0px;
      border-radius: 0px;
      padding: 0px;
    }
    .qos-retain {
      position: absolute;
      top: 1px;
      right: $spacing--connection-content;
      padding-left: 32px;
      text-align: right;
      width: 300px;
      line-height: 40px;
      background: #fff;
      .publish-label {
        color: $color-font-label;
        margin-right: 16px;
      }
      .el-radio-group {
        margin-right: 32px;
      }
      .el-radio {
        margin-right: 16px;
        .el-radio__label {
          padding-left: 8px;
        }
      }
      .el-checkbox__inner {
        border-radius: 100%;
      }
    }
    textarea {
      resize: none;
    }
    .el-textarea__inner {
      border-color: $color-border--black;
      border-left: 0px;
      border-right: 0px;
      border-bottom: 0px;
      border-radius: 0px;
      padding: 8px 0px;
    }
    .send-btn {
      position: fixed;
      right: $spacing--connection-content;
      bottom: 10px;
      color: $color-main-green;
      text-decoration: none;
      .icon-send {
        font-size: $font-size--send;
      }
    }
    &.message {
      height: 200px;
    }
    &.message-disabled {
      @include flex-space-between;
      width: 100%;
      height: $height--new-connection-btn;
      padding-right: 16px;
      .send-btn {
        bottom: 6px;
        color: $color-font-black-time;
        cursor: not-allowed;
      }
    }
  }
}
</style>
