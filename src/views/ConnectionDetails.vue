<template>
  <div class="connection-details" v-if="activeConnection">
    <div class="top-bar">
      <div :class="['connection-status', { 'online': activeConnection.client.connected }]"></div>
      <span :class="['client-name', { 'online': activeConnection.client.connected }]">
        {{ activeConnection.name  }}
      </span>
      <a href="javascript:;" class="client-name" title="Edit Connection"
        v-if="!activeConnection.client.connected"
        @click="showConnectionDialog=true">
        <span class="iconfont icon-edit"></span>
      </a>
      <a href="javascript:;"
        :class="{ 'connect': !activeConnection.client.connected, 'loading': connectLoading }"
        v-if="!activeConnection.client.connected"
        @click="connect">
        <i class="icon el-icon-loading" v-if="connectLoading"></i>
        <span class="iconfont icon-connect" v-else></span>
        Connect
      </a>
      <a href="javascript:;"
        :class="{ disconnect: activeConnection.client.connected }"
        v-else
        @click="disconnect">
        <i class="icon el-icon-switch-button"></i>Disconnect
      </a>
    </div>
    <div class="filter-bar">
      <span class="subs-title">
        Subscriptions
        <a class="collapse-btn" href="javascript:;" @click="setSubsWidth(300)">
          <i class="el-icon-s-unfold"></i>
        </a>
      </span>
      <el-radio-group size="mini" v-model="messageType" @change="messageTypeChanged">
        <el-radio-button label="All"></el-radio-button>
        <el-radio-button label="Received"></el-radio-button>
        <el-radio-button label="Published"></el-radio-button>
      </el-radio-group>
    </div>
    <el-aside width="marginLeft" :style="{ marginLeft: `${marginLeft}px` }">
      <Subscriptions @handleClick="setSubsWidth(0)"/>
    </el-aside>
    <el-main :style="{ marginLeft: `${marginLeft}px` }">
      <div :class="['message-list', { 'publish-focus': publishFocus }]">
        <div v-for="(message, index) in messages" :key="index">
          <ConnectionMsgLeft
            v-if="!message.out"
            v-bind="message"/>
          <ConnectionMsgRight
            v-else
            v-bind="message"/>
        </div>
      </div>
      <ConnectionMsgPublish :left-width="!marginLeft ? '300px' : '578px'"/>
    </el-main>
    <connection-dialog :visible.sync="showConnectionDialog" edit>
    </connection-dialog>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import mqtt from 'mqtt'
import getNowDate from '@/utils/time'
import ConnectionMsgLeft from '@/components/ConnectionMsgLeft.vue'
import ConnectionMsgRight from '@/components/ConnectionMsgRight.vue'
import ConnectionMsgPublish from '@/components/ConnectionMsgPublish.vue'
import Subscriptions from '@/components/Subscriptions.vue'
import ConnectionDialog from '@/components/ConnectionDialog.vue'

export default {
  name: 'connection-details',
  components: {
    Subscriptions,
    ConnectionMsgLeft,
    ConnectionMsgRight,
    ConnectionMsgPublish,
    ConnectionDialog,
  },
  computed: {
    connectUrl() {
      const {
        host, port, ssl, path,
      } = this.activeConnection
      const protocol = ssl ? 'wss://' : 'ws://'
      return `${protocol}${host}:${port}${path.startsWith('/') ? '' : '/'}${path}`
    },
    publishFocus() {
      return this.$store.state.publishFocus
    },
    activeConnection() {
      return this.$store.state.activeConnection
    },
    marginLeft() {
      return this.$store.state.subsWidth
    },
  },
  watch: {
    '$route.params.id': 'getMessages',
  },
  data() {
    return {
      connectLoading: false,
      showConnectionDialog: false,
      messageType: 'All',
      showSubscription: false,
      messages: [],
    }
  },
  methods: {
    ...mapActions([
      'PUSH_MESSAGE', 'CHANGE_CLIENT', 'UNREAD_MESSAGE_COUNT_INCREMENT',
      'CHANGE_SUBSCRIPTIONS', 'CHANGE_SUBS_WIDTH',
    ]),
    getMessages() {
      this.messageType = 'All'
      if (this.activeConnection) {
        this.messages = this.activeConnection.messages
      }
    },
    messageTypeChanged(messageType) {
      if (messageType === 'Received') {
        this.messages = this.activeConnection.messages.filter($ => $.out === false)
      } else if (messageType === 'Published') {
        this.messages = this.activeConnection.messages.filter($ => $.out)
      } else {
        this.messages = this.activeConnection.messages
      }
    },
    connect() {
      if (this.connectLoading || this.activeConnection.client.connected) {
        return false
      }
      const reconnectPeriod = 4000
      const connectTimeout = 4000
      const {
        clientId, username, password, keepalive, clean,
      } = this.activeConnection
      this.connectLoading = true
      const client = mqtt.connect(this.connectUrl, {
        clientId,
        username,
        password,
        keepalive,
        clean,
        connectTimeout,
        reconnectPeriod,
      })
      this.CHANGE_CLIENT({ id: this.activeConnection.id, client })
      this.activeConnection.client.on('connect', this.onConnect)
      this.activeConnection.client.on('error', this.onError)
      this.activeConnection.client.on('reconnect', this.onReConnect)
      this.activeConnection.client.on('message', this.messageArrived(this.activeConnection.id))
      return true
    },
    disconnect() {
      if (this.activeConnection.client.connected) {
        this.CHANGE_SUBSCRIPTIONS({
          id: this.activeConnection.id,
          subscriptions: [],
        })
        this.activeConnection.client.end()
        this.$message.success('Disconnected')
      }
    },
    onConnect() {
      this.connectLoading = false
      this.$message.success('Connected')
    },
    onError() {
      this.connectLoading = false
      this.$message.error('Connect Failed!')
    },
    onReConnect() {
      this.activeConnection.client.end()
      this.connectLoading = false
      this.$message.error('Connect Failed!')
    },
    messageArrived(id) {
      return (topic, payload, packet = {}) => {
        const message = {
          out: false,
          createAt: getNowDate(),
          topic,
          payload: payload.toString(),
          qos: packet.qos,
          retain: packet.retain,
        }
        this.PUSH_MESSAGE({ id, message })
        if (id !== this.activeConnection.id) {
          this.UNREAD_MESSAGE_COUNT_INCREMENT({ id })
        }
      }
    },
    setSubsWidth(val) {
      this.CHANGE_SUBS_WIDTH(val)
    },
  },
  created() {
    this.getMessages()
  },
}
</script>


<style lang="scss">
@import "@/assets/scss/mixins.scss";
@import '@/assets/scss/variable.scss';

.connection-details {
  .top-bar, .filter-bar {
    position: fixed;
    left: $width-leftbar;
    right: 0;
    z-index: 3;
    .subs-title {
      color: $color-font-black-title;
      .collapse-btn {
        font-size: 20px;
        position: relative;
        top: 3px;
      }
    }
  }
  .top-bar {
    padding: 0 $spacing--connection-details;
    height: $height--connection-topbar;
    line-height: $height--connection-topbar;
    border-bottom: 1px solid $color-border--black;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    @include connection-status;
    .client-name {
      color: $color-bg--second-status;
      font-size: $font-size--subtitle;
      font-weight: 500;
    }
    .client-name.online {
      color: $color-font-black-title;
    }
    .icon-edit {
      color: $color-main-green;
      margin-left: 16px;
    }
    a.connect, a.disconnect {
      float: right;
      .iconfont {
        vertical-align: middle;
        margin-right: 4px;
      }
    }
    a.disconnect {
      color: $color-main-red;
      &:hover {
        color: $color-second-red;
      }
    }
    a.connect.loading {
      cursor: not-allowed;
    }
    .icon {
      font-weight: 600;
      margin-right: 4px;
    }
  }
  .filter-bar {
    padding: 16px $spacing--connection-details;
    top: $height--connection-topbar + 1;
    z-index: 1;
    background: $color-bg--main;
    .el-button {
      font-size: 12px;
      width: 96px;
      border-radius: 0px;
      padding: 6px 0;
      border: 2px solid $color-main-green;
      color: $color-main-green;
      &:hover, &:focus {
        border-color: $color-second-green;
        color: $color-second-green;
      }
    }
    .el-radio-group {
      float: right;
      .el-radio-button__inner {
        padding: 6px 15px;
        border-radius: 0;
        width: 100px;
        border-width: 2px;
        background: $color-bg--main;
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        color: $color-main-green;
      }
    }
  }
  .message-list {
    padding: 0px $spacing--connection-details 0;
    margin-bottom: 90px;
  }
  .message-list.publish-focus {
    margin-bottom: 240px;
  }
  .el-aside {
    margin-top: 49px;
    transition: margin-left .5s;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 100;
    background: #fff;
    z-index: 3;
  }
  .el-main {
    transition: margin-left .5s;
    position: relative;
    top: 110px;
    padding: 0px;
  }
}
</style>
