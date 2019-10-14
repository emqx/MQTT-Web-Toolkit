<template>
  <div class="subscriptions">
    <div class="subs-title">
      Subscriptions
      <el-button
        plain
        :disabled="!activeConnection.client.connected"
        @click="$emit('add')">
        + New Sub
      </el-button>
    </div>
    <el-row class="subs-content" :gutter="16">
      <el-col
        v-for="(sub, index) in activeConnection.subscriptions"
        :key="index"
        :span="12">
        <div class="subs-content__item">
          <span class="subs-topic">
            {{ sub.topic }}
          </span>
          <span class="subs-qos">
            QoS {{ sub.qos }}
          </span>
          <a class="subs-close" href="javascript:;" @click="unSubscribe(sub)">
            <i class="el-icon-close"></i>
          </a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import { mapActions } from 'vuex'

export default {
  name: 'subscriptions',

  computed: {
    activeConnection() {
      return this.$store.state.activeConnection
    },
  },

  methods: {
    ...mapActions(['CHANGE_SUBSCRIPTIONS']),
    unSubscribe(row) {
      if (!this.activeConnection.client.connected) {
        return false
      }
      const { topic, qos } = row
      this.activeConnection.client.unsubscribe(topic, { qos }, (error) => {
        if (error) {
          this.$message.error(error)
          return false
        }
        const payload = {
          id: this.activeConnection.id,
          subscriptions: this.activeConnection.subscriptions.filter($ => $.topic !== topic),
        }
        this.CHANGE_SUBSCRIPTIONS(payload)
        return true
      })
      return true
    },
  },
}
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';

.subscriptions {
  color: $color-font-black-title;

  .subs-title {
    margin-bottom: 10px;
    .el-button {
      float: right;
    }
  }
  .subs-content {
    height: 128px;
    overflow: auto;
    padding-top: 16px;

    .subs-content__item {
      background: $color-bg--third-status;
      padding: 10px 8px;
      margin-bottom: 16px;
      position: relative;
      .subs-qos {
        float: right;
        color: $color-bg--second-status;
      }
      .subs-close {
        visibility: hidden;
        border-radius: 50%;
        background: $color-main-green;
        position: absolute;
        right: -7px;
        top: -10px;
        width: 18px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        .el-icon-close {
          color: #fff;
        }
      }
      &:hover {
        .subs-close {
          visibility: visible;
        }
      }
    }
  }
}
</style>
