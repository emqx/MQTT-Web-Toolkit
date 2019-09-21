<template>
  <my-dialog
    title="Subscriptions"
    width="600px"
    :footer="false"
    :visible.sync="showDialog"
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
    <el-table border style="width: 100%" :data="activeConnection.subscriptions">
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
import { mapActions } from 'vuex'
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
    activeConnection() {
      return this.$store.state.activeConnection
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
        this.CHANGE_SUBSCRIPTIONS({ name: this.activeConnection.name, subscriptions })
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
          name: this.activeConnection.name,
          subscriptions: this.activeConnection.subscriptions.filter($ => $.topic !== topic),
        }
        this.CHANGE_SUBSCRIPTIONS(payload)
        return true
      })
      return true
    },
    close() {
      this.$refs.form.resetFields()
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
