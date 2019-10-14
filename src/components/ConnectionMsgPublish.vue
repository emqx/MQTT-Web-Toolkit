<template>
  <div class="connection-msg-publish">
    <el-form class="connections-form" :model="message" label-position="left" label-width="60px">
      <el-form-item label="Topic">
        <el-input
          size="mini"
          v-model="message.topic">
        </el-input>
      </el-form-item>
      <el-form-item label="QoS">
        <el-radio-group v-model="message.qos">
          <el-radio :label="0"></el-radio>
          <el-radio :label="1"></el-radio>
          <el-radio :label="2"></el-radio>
        </el-radio-group>
        <el-checkbox v-model="message.retain">Retain</el-checkbox>
      </el-form-item>
      <el-form-item label="Payload">
        <el-input
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
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import getNowDate from '@/utils/time'

export default {
  name: 'ConnectionMsgPublish',
  computed: {
    activeConnection() {
      return this.$store.state.activeConnection
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
      if (!topic || !payload) {
        return false
      }
      this.activeConnection.client.publish(topic, payload, { qos, retain }, (error) => {
        if (error) {
          this.$message.error(error)
          return false
        }
        const publishedMessage = {
          out: true,
          createAt: getNowDate(),
          topic,
          payload,
          qos,
          retain,
        }
        this.PUSH_MESSAGE({ id: this.activeConnection.id, message: publishedMessage })
        setTimeout(() => {
          window.scrollTo(0, 0)
        }, 1)
        return true
      })
      return true
    },
  },
}
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';

.connection-msg-publish {
  .connections-form {
    .el-form-item__label {
      color: $color-font-label;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-checkbox {
      float: right;
      .el-checkbox__inner {
        border-radius: 100%;
      }
    }
    textarea {
      resize: none;
    }
    .send-btn {
      position: absolute;
      right: 8px;
      bottom: -8px;
      color: $color-main-green;
      text-decoration: none;
      .icon-send {
        font-size: $font-size--send;
      }
    }
  }
}
</style>
