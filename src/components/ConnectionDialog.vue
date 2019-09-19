<template>
  <my-dialog
    width="600px"
    :title="edit ? 'Edit Connection' : 'New Connection'"
    :confirmLoading="confirmLoading"
    :visible.sync="showDialog"
    @confirm="confirm"
    @open="open"
    @close="close">
    <el-form class="new-connection-form" label-position="top" ref="form"
      :model="connection" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Name" prop="name">
            <el-input size="mini" v-model="connection.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Host" prop="host">
            <el-input size="mini" placeholder="127.0.0.1" v-model="connection.host">
              <el-input placeholder="8083" size="mini" slot="append" type="number"
                v-model.number="connection.port"></el-input>
            </el-input>
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
            <el-input size="mini" v-model="connection.clientId">
              <i slot="suffix" title="Refresh" class="el-icon-refresh"
                @click="refreshClientId">
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
            <el-input size="mini" type="number" v-model.number="connection.keepalive"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-checkbox v-model="connection.clean">Clean Session</el-checkbox>
          <el-checkbox v-model="connection.ssl">SSL</el-checkbox>
        </el-col>
      </el-row>
    </el-form>
  </my-dialog>
</template>


<script>
import { mapActions } from 'vuex'
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
    edit: {
      type: Boolean,
      default: false,
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
      confirmLoading: false,
      showDialog: this.visible,
      connection: {
        name: '',
        host: '127.0.0.1',
        port: 8083,
        path: '/mqtt',
        clientId: this.getClientId(),
        username: '',
        password: '',
        keepalive: 60,
        clean: false,
        ssl: false,
        messageCount: 0,
        client: { connected: false },
      },
      rules: {
        name: [
          { required: true },
        ],
        host: [
          { required: true },
        ],
      },
    }
  },
  methods: {
    ...mapActions(['CREATE_CONNECTION', 'EDIT_CONNECTION']),
    confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.edit) {
          this.EDIT_CONNECTION({ ...this.connection })
        } else {
          this.CREATE_CONNECTION({ ...this.connection })
        }
        this.close()
        return true
      })
    },
    close() {
      this.$emit('update:visible', false)
    },
    getClientId() {
      return `mqttjs_${Math.random().toString(16).substr(2, 8)}`
    },
    refreshClientId() {
      this.connection.clientId = this.getClientId()
    },
    open() {
      if (this.edit) {
        this.connection = this.activeConnection
      }
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
    .el-input-group {
      vertical-align: initial;
    }
    .el-input-group__append {
      padding: 0;
      border-radius: 0;
      border: none;
      width: 80px;
      .el-input__inner {
        padding-right: 8px;
      }
    }
  }
  .el-checkbox {
    margin-top: 40px;
  }
}
</style>
