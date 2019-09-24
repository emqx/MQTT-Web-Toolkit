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
          <el-form-item label="Path" prop="path">
            <el-input size="mini" placeholder="/mqtt" v-model="connection.path"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Client ID" prop="clientId">
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
import { validateConnectionName, validateClientId } from '@/utils/validateForm'
import MyDialog from '@/components/MyDialog.vue'

export default {
  name: 'connection-dialog',
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
        client: { connected: false },
        subscriptions: [],
        messages: [],
        unreadMessageCount: 0,
      },
      oldConnectionName: '',
      oldClientId: '',
      rules: {
        name: [
          { required: true, message: 'Name is required' },
          {
            validator: (rule, value, callback, source) => {
              const options = { oldValue: this.oldConnectionName, edit: this.edit }
              validateConnectionName(rule, value, callback, source, options)
            },
          },
        ],
        host: [
          { required: true, message: 'Host is required' },
        ],
        path: [
          { required: true, message: 'Path is required' },
        ],
        clientId: [
          { required: true, message: 'Client ID is required' },
          {
            validator: (rule, value, callback, source) => {
              const options = { oldValue: this.oldClientId, edit: this.edit }
              validateClientId(rule, value, callback, source, options)
            },
          },
        ],
      },
    }
  },
  methods: {
    ...mapActions(['CREATE_CONNECTION', 'EDIT_CONNECTION', 'CHANGE_ACTIVE_CONNECTION']),
    confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.edit) {
          this.EDIT_CONNECTION({ ...this.connection })
          this.CHANGE_ACTIVE_CONNECTION({ ...this.connection })
        } else {
          this.CREATE_CONNECTION({ ...this.connection })
          this.$router.push({ path: `/connections/${this.connection.clientId}` })
        }
        this.close()
        return true
      })
    },
    close() {
      this.$refs.form.resetFields()
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
        this.connection = { ...this.activeConnection }
        this.oldConnectionName = this.connection.name
        this.oldClientId = this.connection.clientId
      } else {
        this.connection.clientId = this.getClientId()
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
