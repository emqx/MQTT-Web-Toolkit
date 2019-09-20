<template>
  <my-dialog
    title="Subscriptions"
    width="600px"
    :footer="false"
    :visible.sync="showDialog"
    @open="open"
    @close="close">
    <el-form class="new-sub-form" ref="form" :inline="true" :model="subscription" :rules="rules">
      <el-form-item label="Topic: " prop="topic">
        <el-input size="mini" placeholder="Topic" v-model="subscription.topic"></el-input>
      </el-form-item>
      <el-form-item label="QoS: ">
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
    <el-table border style="width: 100%" :data="subscriptions">
      <el-table-column prop="topic" label="Topic"></el-table-column>
      <el-table-column prop="qos" label="QoS" width="80"></el-table-column>
      <el-table-column label="Oper" width="56">
        <template slot-scope="scope">
          <a href="javascript:;" @click="unSubscribe(scope.row)">
            <i class="iconfont icon-delete"></i>
          </a>
        </template>
      </el-table-column>
    </el-table>
  </my-dialog>
</template>


<script>
import MyDialog from '@/components/MyDialog.vue'

export default {
  name: 'subscription-dialog',
  components: {
    MyDialog,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    visible(val) {
      this.showDialog = val
    },
  },
  computed: {
    client() {
      return this.$store.state.activeConnection.client
    },
    subscriptions: {
      get() {
        return this.$store.state.activeConnection.subscriptions
      },
      set(newValue) {
        this.$store.state.activeConnection.subscriptions = newValue
      },
    },
  },
  data() {
    return {
      SubscribeLoading: false,
      showDialog: this.visible,
      subscription: {
        topic: '',
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
    subscribe() {
      if (!this.client.connected) {
        return false
      }
      const { topic, qos } = this.subscription
      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log(error)
          return false
        }
        if (res.length < 1 || ![0, 1, 2].includes(res[0].qos)) {
          console.log('Subscribe Failure!')
          return false
        }
        const existTopicIndex = this.subscriptions.findIndex(item => item.topic === topic)
        if (existTopicIndex !== -1) {
          this.subscriptions[existTopicIndex].qos = qos
        } else {
          this.subscriptions.push({ ...this.subscription })
        }
        return true
      })
      return true
    },
    unSubscribe(row) {
      if (!this.client.connected) {
        return false
      }
      const { topic, qos } = row
      this.client.unsubscribe(topic, { qos }, (error) => {
        if (error) {
          console.log(error)
          return false
        }
        this.subscriptions = this.subscriptions.filter($ => $.topic !== topic)
        return true
      })
      return true
    },
    open() {
      this.$refs.form.resetFields()
    },
    close() {
      this.$emit('update:visible', false)
    },
  },
};
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';

.new-sub-form .el-form-item {
  &:first-child {
    margin-right: 24px;
  }
  &:last-child {
    margin-right: 0;
    float: right;
  }
  .el-radio {
    margin-right: 16px;
    .el-radio__label {
      padding-left: 8px;
    }
  }
  .el-input__inner, .sub-button {
    border-width: 2px;
    border-radius: 0;
  }
  .sub-button {
    padding: 6px 15px;
    color: $color-main-green;
    border-color: $color-main-green;
  }
}
.el-table {
  margin-top: 8px;
  th, td {
    border-right: none;
  }
  a {
    color: $color-main-green;
    &:hover {
      color: $color-second-green;
    }
    .iconfont {
      font-size: 18px;
    }
  }
}
</style>
