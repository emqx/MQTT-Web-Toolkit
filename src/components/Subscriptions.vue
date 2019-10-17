<template>
  <div class="subscriptions">
    <div class="subs-title">
      Subscriptions
      <a class="hide-btn" href="javascript:;" @click="$emit('handleClick')">
        <i class="el-icon-s-fold"></i>
      </a>
    </div>
    <div class="subs-body">
      <el-form
        class="new-sub-form"
        ref="form"
        label-width="50px"
        label-position="left"
        label-suffix=":"
        :hide-required-asterisk="true"
        :model="subscription"
        :rules="rules">
        <el-form-item label="Topic" prop="topic">
          <el-input size="mini" placeholder="Topic" v-model="subscription.topic"></el-input>
        </el-form-item>
        <el-form-item label="QoS">
          <el-radio-group v-model="subscription.qos">
            <el-radio :label="0"></el-radio>
            <el-radio :label="1"></el-radio>
            <el-radio :label="2"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button plain size="mini" class="sub-button"
          v-loading="SubscribeLoading"
          @click="subscribe">Subscribe</el-button>
        </el-form-item>
      </el-form>
      <transition-group name="el-fade-in-linear">
        <div
          v-for="(sub, index) in activeConnection.subscriptions"
          :key="`${sub.topic}-${index}`"
          class="subs-content__item">
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
      </transition-group>
    </div>
  </div>
</template>


<script>
import { mapActions } from 'vuex'

export default {
  name: 'subscriptions',
  computed: {
    activeConnection() {
      return this.$store.state.activeConnection || { client: {} }
    },
  },
  data() {
    return {
      SubscribeLoading: false,
      subscription: {
        topic: 'testtopic/#',
        qos: 0,
      },
      rules: {
        topic: [
          { required: true },
        ],
      },
    }
  },
  methods: {
    ...mapActions(['CHANGE_SUBSCRIPTIONS']),
    subscribe() {
      if (!this.activeConnection.client.connected) {
        return false
      }
      const { topic, qos } = this.subscription
      this.activeConnection.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          this.$message.error(error)
          return false
        }
        if (res.length < 1 || ![0, 1, 2].includes(res[0].qos)) {
          this.$message.error('Subscribe Failure!')
          return false
        }

        const subscriptions = [...this.activeConnection.subscriptions]
        const existTopicIndex = subscriptions.findIndex(item => item.topic === topic)
        if (existTopicIndex !== -1) {
          subscriptions[existTopicIndex].qos = qos
        } else {
          subscriptions.push({ ...this.subscription })
        }
        this.CHANGE_SUBSCRIPTIONS({ id: this.activeConnection.id, subscriptions })
        return true
      })
      return true
    },
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
    reset() {
      this.$refs.form.resetFields()
    },
  },
}
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';

.subscriptions {
  color: $color-font-black-title;
  .subs-title {
    height: 49px;
    line-height: 49px;
    border-bottom: 1px solid $color-border--black;
    padding: 0px $spacing--connection-details;
    margin-bottom: $spacing--connection-details;
    position: relative;
    .hide-btn {
      position: absolute;
      right: 0;
      font-size: 20px;
    }
  }
  .subs-body {
    padding: 0px $spacing--connection-details;
    .subs-content__item {
      background: $color-bg--third-status;
      padding: 10px 8px;
      margin-bottom: 16px;
      position: relative;
      clear: both;
      .subs-qos {
        float: right;
        color: $color-bg--second-status;
      }
      .subs-close {
        transition: all .5s;
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
    .new-sub-form .el-form-item {
      margin-bottom: 12px;
      .el-radio {
        margin-right: 16px;
        .el-radio__label {
          padding-left: 8px;
        }
      }
      .el-input__inner {
        border-width: 2px;
        border-radius: 0;
      }
    }
  }
}
</style>
