<template>
  <div class="connection-content">
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
      <el-radio-group size="mini" v-model="messageType">
        <el-radio-button label="All"></el-radio-button>
        <el-radio-button label="Received"></el-radio-button>
        <el-radio-button label="Published"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="message-list">
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
    <connection-dialog :visible.sync="showConnectionDialog" edit></connection-dialog>
  </div>
</template>


<script>
import mqtt from 'mqtt'
import getNowDate from '@/utils/time'
import ConnectionMsgLeft from '@/components/ConnectionMsgLeft.vue'
import ConnectionMsgRight from '@/components/ConnectionMsgRight.vue'
import ConnectionMsgPublish from '@/components/ConnectionMsgPublish.vue'
import SubscriptionDialog from '@/components/SubscriptionDialog.vue'
import ConnectionDialog from '@/components/ConnectionDialog.vue'


export default {
  name: 'ConnectionContent',
  components: {
    SubscriptionDialog,
    ConnectionMsgLeft,
    ConnectionMsgRight,
    ConnectionMsgPublish,
    ConnectionDialog,
  },
  computed: {
    activeConnection() {
      return this.$store.state.activeConnection
    },
    connectUrl() {
      const {
        host, port, ssl, path,
      } = this.activeConnection
      const protocol = ssl ? 'wss://' : 'ws://'
      return `${protocol}${host}:${port}${path.startsWith('/') ? '' : '/'}${path}`
    },
    messages() {
      return this.activeConnection.messages
    },
  },
  data() {
    return {
      showConnectionDialog: false,
      messageType: 'All',
      showSubscription: false,
    }
  },
  methods: {
    connect() {
      const reconnectPeriod = 4000
      const connectTimeout = 4000
      const {
        clientId, username, password, keepalive, clean,
      } = this.activeConnection
      this.activeConnection.client = mqtt.connect(this.connectUrl, {
        clientId,
        username,
        password,
        keepalive,
        clean,
        connectTimeout,
        reconnectPeriod,
      })
      this.activeConnection.client.on('connect', this.onConnect)
      this.activeConnection.client.on('message', this.onMessage)
    },
    disconnect() {
      if (this.activeConnection.client.connected) {
        this.activeConnection.subscriptions = []
        this.activeConnection.client.end()
      }
    },
    onConnect() {
      console.log('connected')
    },
    onMessage(topic, payload, packet = {}) {
      const message = {
        out: false,
        createAt: getNowDate(),
        topic,
        payload: payload.toString(),
        qos: packet.qos,
        retain: packet.retain,
      }
      this.messages.push(message)
      // let { messageCount } = this
      // this.$emit('update:messageCount', messageCount += 1)
    },
  },
};
</script>


<style lang="scss">
@import "@/assets/scss/mixins.scss";
@import '@/assets/scss/variable.scss';

.connection-content {
  .top-bar, .filter-bar {
    position: fixed;
    left: $width-leftbar;
    right: 0;
  }
  .top-bar {
    padding: 0 $spacing--connection-content;
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
    padding: 16px $spacing--connection-content;
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
    padding: 120px $spacing--connection-content;
  }
}
</style>
