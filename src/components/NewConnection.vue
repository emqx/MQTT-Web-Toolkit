<template>
  <my-dialog
    title="New Connection"
    width="600px"
    :confirmLoading="confirmLoading"
    :visible.sync="showDialog"
    @confirm="confirm"
    @close="close">
    <el-form class="new-connection-form" label-position="top" :model="connection">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Host">
            <el-input size="mini" placeholder="127.0.0.1" v-model="connection.host"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Port">
            <el-input size="mini" placeholder="8083" v-model="connection.port"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Path">
            <el-input size="mini" placeholder="/mqtt" v-model="connection.path"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Client ID">
            <el-input size="mini" v-model="connection.clientID">
              <i slot="suffix" title="Refresh" class="el-icon-refresh"
                @click="refreshClientID">
              </i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Username">
            <el-input size="mini" v-model="connection.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Password">
            <el-input size="mini" v-model="connection.password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Keepalive">
            <el-input size="mini" v-model="connection.keepalive"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-checkbox v-model="connection.cleanSession">Clean Session</el-checkbox>
          <el-checkbox v-model="connection.ssl">SSL</el-checkbox>
        </el-col>
      </el-row>
    </el-form>
  </my-dialog>
</template>


<script>
import MyDialog from '@/components/MyDialog.vue'

export default {
  name: 'new-connection',
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
      confirmLoading: false,
      showDialog: this.visible,
      connection: {
        host: '127.0.0.1',
        port: 8083,
        path: '/mqtt',
        clientID: this.getClientID(),
        username: '',
        password: '',
        keepalive: 60,
        cleanSession: false,
        ssl: false,
      },
    }
  },
  methods: {
    confirm() {

    },
    close() {
      this.$emit('update:visible', false)
    },
    getClientID() {
      return `mqttjs_${Math.random().toString(16).substr(2, 8)}`
    },
    refreshClientID() {
      this.connection.clientID = this.getClientID()
    },
  },
};
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';

.new-connection-form {
  .el-form-item {
    margin-bottom: 16px;
    .el-form-item__label {
      padding: 0;
      line-height: 32px;
    }
    .el-input__inner {
      border-radius: 0;
    }
    .el-icon-refresh {
      cursor: pointer;
      color: $color-main-green;
    }
  }
  .el-checkbox {
    margin-top: 40px;
  }
}
</style>
