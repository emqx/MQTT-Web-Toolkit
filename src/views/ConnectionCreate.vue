<template>
  <div class="connection-create">
    <div class="top-bar">
      <h1>New</h1>
      <el-button
        type="outline"
        size="mini"
        @click="save">
        Connect
      </el-button>
    </div>
    <el-form
      ref="form"
      class="connection-form"
      label-position="right"
      label-width="160px"
      :model="record"
      :rules="rules">
      <div class="client-create__body">
        <div class="info-header">
          <h3>General</h3>
        </div>
        <el-card
          shadow="never"
          class="info-body item-card">
          <el-row :gutter="10">
            <el-col :span="22">
              <el-form-item label-width="93px" label="Name" prop="name">
                <el-input size="mini" v-model="record.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="22">
              <el-form-item label-width="93px" label="Client ID" prop="clientId">
                <el-input size="mini" v-model="record.clientId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <a href="javascript:;" class="icon-oper" @click="setClientID">
                <i class="el-icon-refresh-right"></i>
              </a>
            </el-col>
            <el-col :span="22">
              <el-form-item
                class="host-item"
                label-width="93px" label="Host" prop="host">
                <el-col :span="6">
                  <el-select size="mini" v-model="record.protocol">
                    <el-option label="ws://" value="ws" :disabled="record.ssl"></el-option>
                    <el-option label="wss://" value="wss"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="18">
                  <el-input size="mini" v-model="record.host">
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="22">
              <el-form-item label-width="93px" label="Port" prop="port">
                <el-input size="mini" type="number" v-model.number="record.port"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="22">
              <el-form-item label-width="93px" label="Path" prop="path">
                <el-input size="mini" v-model="record.path"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>

            <el-col :span="2"></el-col>
            <el-col :span="22">
              <el-form-item label-width="93px" label="Username" prop="username">
                <el-input size="mini" v-model="record.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="22">
              <el-form-item label-width="93px" label="Password" prop="password">
                <el-input type="password" size="mini" v-model="record.password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="22">
              <el-form-item label-width="93px" label="SSL/TLS" prop="ssl">
                <el-radio-group v-model="record.ssl" @change="handleSSL">
                  <el-radio :label="true">true</el-radio>
                  <el-radio :label="false">false</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="2"></el-col>
          </el-row>
        </el-card>

        <div class="info-header">
          <h3>Advanced</h3>
        </div>
        <el-collapse-transition>
          <el-card
            shadow="never"
            class="info-body item-card">
            <el-row :gutter="10">
              <el-col :span="22">
                <el-form-item
                  label="Connect Timeout (s)"
                  prop="connectTimeout">
                  <el-input
                    size="mini" type="number" v-model.number="record.connectTimeout"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2"></el-col>
              <el-col :span="22">
                <el-form-item label="Keep Alive (s)" prop="keepalive">
                  <el-input size="mini" type="number" v-model.number="record.keepalive"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
              </el-col>
              <el-col :span="22">
                <el-form-item label="Clean Session" prop="clean">
                  <el-radio-group v-model="record.clean">
                    <el-radio :label="true"></el-radio>
                    <el-radio :label="false"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="2"></el-col>
              <el-col :span="22">
                <el-form-item label="Auto Reconnect" prop="reconnect">
                  <el-radio-group v-model="record.reconnect">
                    <el-radio :label="true"></el-radio>
                    <el-radio :label="false"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="2"></el-col>
              <el-col :span="22">
                <el-form-item label="MQTT Version" prop="mqttVersion">
                  <el-select size="mini" v-model="record.mqttVersion">
                    <el-option value="3.1.1" label="3.1.1"></el-option>
                    <el-option value="5.0" label="5.0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2"></el-col>

              <!-- MQTT v5.0 -->
              <template v-if="record.mqttVersion === '5.0'">
                <el-col :span="22">
                  <el-form-item
                    label="Session Expiry Interval" prop="sessionExpiryInterval">
                    <el-input
                      size="mini" type="number" v-model.number="record.sessionExpiryInterval">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"></el-col>
                <el-col :span="22">
                  <el-form-item label="Receive Maximum" prop="receiveMaximum">
                    <el-input size="mini" type="number" v-model.number="record.receiveMaximum">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"></el-col>
                <el-col :span="22">
                  <el-form-item
                    label="Topic Alias Maximum" prop="topicAliasMaximum">
                    <el-input size="mini" type="number" v-model.number="record.topicAliasMaximum">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2"></el-col>
              </template>
            </el-row>
          </el-card>
        </el-collapse-transition>

        <!-- Last-Will Message -->
        <div class="info-header">
          <h3>Last Will and Testament</h3>
        </div>
        <el-collapse-transition>
          <el-card
            shadow="never"
            class="info-body item-card">
            <el-row :gutter="10">
              <el-col :span="22">
                <el-form-item
                  label="Last-Will Topic"
                  prop="will.lastWillTopic">
                  <el-input size="mini" v-model="record.will.lastWillTopic"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2"></el-col>
              <el-col :span="22">
                <el-form-item
                  label="Last-Will QoS"
                  prop="will.lastWillQos">
                  <el-radio-group v-model="record.will.lastWillQos">
                    <el-radio :label="0"></el-radio>
                    <el-radio :label="1"></el-radio>
                    <el-radio :label="2"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="2"></el-col>
              <el-col :span="22">
                <el-form-item
                  label="Last-Will Retain"
                  prop="will.lastWillRetain">
                  <el-radio-group v-model="record.will.lastWillRetain">
                    <el-radio :label="true"></el-radio>
                    <el-radio :label="false"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="2"></el-col>
              <el-col :span="22">
                <el-form-item
                  label="Last-Will Payload"
                  prop="will.lastWillPayload">
                  <el-input
                    size="mini" type="textarea" rows="3" v-model="record.will.lastWillPayload">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2"></el-col>
            </el-row>
          </el-card>
        </el-collapse-transition>
      </div>
    </el-form>
  </div>
</template>


<script>
import uuidv1 from 'uuid/v1'
import { mapActions } from 'vuex'
import { getClientId } from '@/utils/mqttUtils'

export default {
  name: 'connection-create',

  data() {
    return {
      record: {
        clientId: getClientId(),
        name: '',
        clean: true,
        protocol: 'ws',
        host: 'broker.emqx.io',
        keepalive: 60,
        connectTimeout: 10,
        reconnect: false,
        username: '',
        password: '',
        path: '/mqtt',
        port: 8083,
        ssl: document.location.protocol === 'https:',
        rejectUnauthorized: false,
        mqttVersion: '3.1.1',
        client: {
          connected: false,
        },
        will: {
          lastWillTopic: '',
          lastWillPayload: '',
          lastWillQos: 0,
          lastWillRetain: false,
        },
        sessionExpiryInterval: undefined,
        receiveMaximum: undefined,
        topicAliasMaximum: undefined,
        subscriptions: [],
        messages: [],
        unreadMessageCount: 0,
      },
      rules: {
        name: [{ required: true, message: 'Please input' }],
        clientId: [{ required: true, message: 'Please input' }],
        path: [{ required: true, message: 'Please input' }],
        host: [{ required: true, message: 'Please input' }],
        port: [{ required: true, message: 'Please select' }],
      },
    }
  },

  methods: {
    ...mapActions([
      'CREATE_CONNECTION', 'SHOW_CONNECTION_INFO',
    ]),
    setClientID() {
      this.record.clientId = getClientId()
    },
    handleSSL(val) {
      const { protocol } = this.record
      this.changeProtocol(protocol, val)
      if (!val) {
        this.record.certType = ''
      }
    },
    changeProtocol(protocol, isSSL) {
      if (!protocol) {
        return
      }
      this.record.protocol = isSSL ? 'wss' : 'ws'
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }
        const id = uuidv1()
        this.CREATE_CONNECTION({ ...this.record, id })
        this.$router.push({ path: `/connections/${id}` })
        this.SHOW_CONNECTION_INFO({ id, value: true })
      })
    },
  },
}
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';
@import "@/assets/scss/mixins.scss";

.connection-create {
  padding: 0 24px;
  @include top-bar;
  .connection-form {
    margin: 60px 0px;
    .icon-oper {
      line-height: 43px;
      color: $color-font-label;
      &:hover,
      &:focus {
        color: $color-main-green;
      }
    }
    .el-form-item {
      margin-bottom: 8px;
    }
    .el-form-item__error {
      top: 80%;
    }
    .el-select {
      width: 100%;
    }
    .host-item {
      .el-col-6 {
        padding-left: 0px !important;
      }
      .el-col-18 {
        padding-right: 0px !important;
      }
    }
  }
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      font-size: 18px;
      margin: 0px;
    }
  }
  h3 {
    font-size: 16px;
  }
}
</style>
