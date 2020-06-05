<template>
  <div class="connection-form">
    <el-form class="new-connection-form" label-position="top" ref="form"
      :model="connection" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Name" prop="name">
            <el-input size="mini" v-model="connection.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Host" prop="host">
            <el-input size="mini" placeholder="broker.emqx.io" v-model="connection.host">
              <el-input placeholder="8083" size="mini" slot="append" type="number"
                v-model.number="connection.port"></el-input>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Path" prop="path">
            <el-input size="mini" placeholder="/mqtt" v-model="connection.path"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Client ID" prop="clientId">
            <el-input size="mini" v-model="connection.clientId">
              <i slot="suffix" title="Refresh" class="el-icon-refresh"
                @click="refreshClientId">
              </i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Username">
            <el-input size="mini" v-model="connection.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Password">
            <el-input size="mini" v-model="connection.password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Keepalive">
            <el-input size="mini" type="number" v-model.number="connection.keepalive"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-checkbox v-model="connection.clean">Clean Session</el-checkbox>
          <el-checkbox v-model="connection.ssl">SSL</el-checkbox>
        </el-col>
        <el-col :span="8">
          <el-button
            v-if="!activeConnection.client.connected"
            type="outline"
            size="mini"
            :loading="btnLoading"
            @click="confirm">
            Connect
          </el-button>
          <el-button
            v-else
            plain
            class="disconnect"
            size="mini"
            :loading="btnLoading"
            @click="cancel">
            Disconnect
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import { validateConnectionName, validateClientId } from '@/utils/validateForm'
import { getClientId } from '@/utils/mqttUtils'

export default {
  name: 'connection-form',
  props: {
    edit: {
      type: Boolean,
      required: true,
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    activeConnection() {
      return this.$store.state.activeConnection || { client: {} }
    },
  },
  data() {
    return {
      confirmLoading: false,
      connection: {
        id: '',
        name: '',
        host: 'broker.emqx.io',
        port: 8083,
        path: '/mqtt',
        clientId: getClientId(),
        username: '',
        password: '',
        keepalive: 60,
        clean: false,
        ssl: document.location.protocol === 'https:',
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
              const options = {
                oldValue: this.oldClientId,
                edit: this.edit,
                connection: this.connection,
              }
              validateClientId(rule, value, callback, source, options)
            },
          },
        ],
      },
    }
  },
  methods: {
    ...mapActions([
      'CREATE_CONNECTION', 'EDIT_CONNECTION', 'CHANGE_ACTIVE_CONNECTION',
      'SHOW_CONNECTION_INFO',
    ]),
    confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }
        this.EDIT_CONNECTION({ ...this.connection })
        this.CHANGE_ACTIVE_CONNECTION({ ...this.connection })
        this.open()
        this.$emit('handleConnect')
      })
    },
    cancel() {
      this.$emit('handleDisconnect')
    },
    refreshClientId() {
      this.connection.clientId = getClientId()
    },
    open() {
      this.connection = { ...this.activeConnection }
      this.oldConnectionName = this.connection.name
      this.oldClientId = this.connection.clientId
    },
  },
}
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';

.connection-form {
  padding-bottom: 5px;
  .new-connection-form {
    position: relative;
    top: -10px;
    .el-form-item {
      margin-bottom: 0px;
      .el-form-item__label {
        padding: 0;
        height: 28px;
      }
      .el-form-item__content {
        line-height: 28px;
        height: 28px;
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
        border: none;
        width: 80px;
        .el-input__inner {
          padding-right: 8px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          border-top-left-radius: 0px;
          border-bottom-left-radius: 0px;
        }
      }
    }
    .el-checkbox {
      margin-top: 40px;
    }
    .el-button {
      margin-top: 50px;
      float: right;
    }
    .disconnect.el-button {
      color: $color-main-red;
      border: 2px solid $color-main-red;
    }
  }
}
</style>
