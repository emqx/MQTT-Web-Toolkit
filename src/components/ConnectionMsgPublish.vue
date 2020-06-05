<template>
  <div
    class="connection-msg-publish"
    :style="{'margin-left': leftWidth}"
    @click="focusPublish">
    <div class="connections-input message">
      <el-input
        placeholder="Topic"
        v-model="message.topic">
      </el-input>
      <div class="qos-retain">
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
        ref="payload"
        type="textarea"
        rows="4"
        placeholder="Payload"
        v-model="message.payload">
      </el-input>
      <a
        href="javascript:;"
        class="send-btn"
        @click="publishMessage">
        <i class="iconfont icon-send"></i>
      </a>
    </div>
  </div>
</template>


<script>
import jump from 'jump.js'
import { mapActions } from 'vuex'
import time from '@/utils/time'

export default {
  name: 'ConnectionMsgPublish',
  props: {
    leftWidth: {
      type: String,
      default: '300px',
    },
  },
  computed: {
    activeConnection() {
      return this.$store.state.activeConnection || { client: {} }
    },
  },
  data() {
    return {
      message: {
        topic: '',
        qos: 0,
        retain: false,
        payload: JSON.stringify({ msg: 'hello' }, null, 2),
      },
    }
  },
  methods: {
    ...mapActions(['PUSH_MESSAGE']),
    publishMessage(event) {
      event.stopPropagation()
      if (!this.activeConnection.client.connected) {
        this.$message.error('Client Not Connected')
        return false
      }
      const {
        topic, qos, payload, retain,
      } = this.message
      const notSend = retain ? !topic : !topic || !payload
      if (notSend) {
        return false
      }
      this.activeConnection.client.publish(topic, payload, { qos, retain }, (error) => {
        if (error) {
          this.$message.error(error)
          return false
        }
        const publishedMessage = {
          out: true,
          createAt: time.getNowDate(),
          topic,
          payload,
          qos,
          retain,
        }
        this.PUSH_MESSAGE({ id: this.activeConnection.id, message: publishedMessage })
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight + 190)
        }, 100)
        return true
      })
      return true
    },
    focusPublish(event) {
      event.stopPropagation()
      jump(document.body.scrollHeight)
    },
  },
}
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';
@import '@/assets/scss/mixins.scss';

.connection-msg-publish {
  transition: all .5s;
  position: fixed;
  width: inherit;
  bottom: 0;
  left: 0;
  right: 0;
  .connections-input {
    background: $color-bg--main;
    border-top: 1px solid $color-border--black;
    padding: 0px $spacing--connection-details;
    transition: .3s height;
    .el-input__inner {
      border: 0px;
      border-radius: 0px;
      padding: 0px;
      background: $color-bg--main;
    }
    .qos-retain {
      position: absolute;
      top: 1px;
      right: $spacing--connection-details;
      padding-left: 32px;
      text-align: right;
      width: 300px;
      line-height: 40px;
      background: $color-bg--main;
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
      background: $color-bg--main;
      border-color: $color-border--black;
      border-left: 0px;
      border-right: 0px;
      border-bottom: 0px;
      border-radius: 0px;
      padding: 8px 0px;
    }
    .send-btn {
      position: fixed;
      right: $spacing--connection-details;
      bottom: 10px;
      color: $color-main-green;
      text-decoration: none;
      .icon-send {
        font-size: $font-size--send;
      }
    }
  }
}
</style>
