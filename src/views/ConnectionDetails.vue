<template>
  <div class="connection-details">
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
        :class="{ connect: !activeConnection.client.connected }"
        v-if="!activeConnection.client.connected"
        @click="connect">
        <span class="iconfont icon-connect"></span>Connect
      </a>
      <a href="javascript:;"
        :class="{ disconnect: activeConnection.client.connected }"
        v-else
        @click="disconnect">
        <span class="iconfont icon-disconnect"></span>Disconnect
      </a>
    </div>
    <div class="filter-bar">
      <el-button plain
        v-if="activeConnection.client.connected"
        @click="showSubscription=true">+ New Sub</el-button>
      <el-radio-group size="mini" v-model="messageType" @change="messageTypeChanged">
        <el-radio-button label="All"></el-radio-button>
        <el-radio-button label="Received"></el-radio-button>
        <el-radio-button label="Published"></el-radio-button>
      </el-radio-group>
    </div>
    <div :class="['message-list', { 'publish-focus': publishFocus }]">
      <div v-for="(message, index) in messages" :key="index">
        <ConnectionMsgLeft v-if="!message.out"
          :topic="message.topic"
          :payload="message.payload"
          :time="message.createAt"/>
        <ConnectionMsgRight v-else
          :topic="message.topic"
          :payload="message.payload"
          :time="message.createAt"/>
      </div>
    </div>
    <ConnectionMsgPublish/>
    <subscription-dialog :visible.sync="showSubscription"></subscription-dialog>
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
import SubscriptionDialog from '@/components/SubscriptionDialog.vue'
import ConnectionDialog from '@/components/ConnectionDialog.vue'

export default {
  name: 'connection-details',
  components: {
    SubscriptionDialog,
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
  },
  watch: {
    '$route.params.id': 'getMessages',
  },
  data() {
    return {
      showConnectionDialog: false,
      messageType: 'All',
      showSubscription: false,
      messages: [],
    }
  },
  methods: {
    ...mapActions([
      'PUSH_MESSAGE', 'CHANGE_CLIENT', 'UNREAD_MESSAGE_COUNT_INCREMENT',
      'CHANGE_SUBSCRIPTIONS',
    ]),
    getMessages() {
      this.messages = this.activeConnection.messages
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
      const reconnectPeriod = 4000
      const connectTimeout = 4000
      const {
        clientId, username, password, keepalive, clean,
      } = this.activeConnection
      const client = mqtt.connect(this.connectUrl, {
        clientId,
        username,
        password,
        keepalive,
        clean,
        connectTimeout,
        reconnectPeriod,
      })
      this.CHANGE_CLIENT({ name: this.activeConnection.name, client })
      this.activeConnection.client.on('connect', this.onConnect)
      this.activeConnection.client.on('message', this.messageArrived(this.activeConnection.name))
    },
    disconnect() {
      if (this.activeConnection.client.connected) {
        this.CHANGE_SUBSCRIPTIONS({
          name: this.activeConnection.name,
          subscriptions: [],
        })
        this.activeConnection.client.end()
        this.$message.success('Disconnected')
      }
    },
    onConnect() {
      this.$message.success('Connected')
    },
    messageArrived(connectionName) {
      return (topic, payload, packet = {}) => {
        const message = {
          out: false,
          createAt: getNowDate(),
          topic,
          payload: payload.toString(),
          qos: packet.qos,
          retain: packet.retain,
        }
        this.PUSH_MESSAGE({ name: connectionName, message })
        if (connectionName !== this.activeConnection.name) {
          this.UNREAD_MESSAGE_COUNT_INCREMENT({ name: connectionName })
        }
      }
    },
  },
  created() {
    this.getMessages()
  },
};
</script>


<style lang="scss">
@import "@/assets/scss/mixins.scss";
@import '@/assets/scss/variable.scss';

.connection-details {
  .top-bar, .filter-bar {
    position: fixed;
    left: $width-leftbar;
    right: 0;
  }
  .top-bar {
    padding: 0 $spacing--connection-details;
    height: $height--connection-topbar;
    line-height: $height--connection-topbar;
    border-bottom: 1px solid $color-border--black;
    background-color: #fff;
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
        margin-right: 4px;
      }
    }
    a.disconnect {
      color: $color-main-red;
      &:hover {
        color: $color-second-red;
      }
    }
  }
  .filter-bar {
    padding: 16px $spacing--connection-details;
    top: $height--connection-topbar + 1;
    background-color: #fff;
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
        width: 80px;
        border-width: 2px;
      }
    }
  }
  .message-list {
    padding: 120px $spacing--connection-details 0;
    margin-bottom: 100px;
  }
}
</style>
