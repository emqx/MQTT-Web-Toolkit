<template>
  <div class="new-subscription">
    <my-dialog
      title="Subscriptions"
      width="600px"
      :footer="false"
      :confirmLoading="newSubConfirmLoading"
      :visible.sync="showDialog"
      @confirm="confirm"
      @close="close">
      <el-form class="new-sub-form" :inline="true" :model="subscription">
        <el-form-item label="Topic: ">
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
          <el-button plain size="mini" class="sub-button" @click="subscribe" >Subscribe</el-button>
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
  </div>
</template>


<script>
import MyDialog from '@/components/MyDialog.vue'

export default {
  name: 'new-subscription',
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
  data() {
    return {
      newSubConfirmLoading: false,
      showDialog: this.visible,
      subscription: {
        topic: '',
        qos: 0,
      },
      subscriptions: [
        { topic: 'topic1', qos: 0 },
        { topic: 'topic2', qos: 1 },
      ],
    }
  },
  methods: {
    confirm() {

    },
    close() {
      this.$emit('update:visible', false)
    },
    subscribe() {

    },
    unSubscribe(row) {
      console.log(row)
    },
  },
};
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';

.my-dialog {
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
}
</style>
