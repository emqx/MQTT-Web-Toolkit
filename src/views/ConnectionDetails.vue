<template>
  <div class="connection-details" v-if="activeConnection">
    <div class="top-bar">
      <div :class="['connection-status', { 'online': activeConnection.client.connected }]"></div>
      <span :class="['client-name', { 'online': activeConnection.client.connected }]">
        {{ activeConnection.name  }}
      </span>
      <a
        href="javascript:;"
        :class="['collapse-btn', showConnectionInfo ? 'top': 'bottom']"
        @click="handleCollapse">
        <i class="el-icon-d-arrow-left"></i>
      </a>
      <el-collapse-transition>
        <connection-form
          ref="connectionForm"
          v-show="showConnectionInfo"
          edit
          :btnLoading="connectLoading"
          @handleConnect="connect"
          @handleDisconnect="disconnect">
        </connection-form>
      </el-collapse-transition>
    </div>
    <div class="filter-bar" :style="{ top: showConnectionInfo ? '295px': '50px' }">
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
    <el-aside
      width="marginLeft"
      :style="{ marginLeft: `${marginLeft}px`, marginTop: showConnectionInfo ? '295px': '50px' }">
      <Subscriptions @handleClick="setSubsWidth(0)"/>
    </el-aside>
    <el-main
      :style="{
        marginLeft: `${marginLeft}px`,
        top: showConnectionInfo ? '398px': '110px',
      }">
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
import ConnectionForm from '@/components/ConnectionForm.vue'

export default {
  name: 'connection-details',
  components: {
    Subscriptions,
    ConnectionMsgLeft,
    ConnectionMsgRight,
    ConnectionMsgPublish,
    ConnectionForm,
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
      return this.$store.state.activeConnection || { client: {} }
    },
    marginLeft() {
      return this.$store.state.subsWidth
    },
    showConnectionInfo() {
      const { id } = this.$route.params
      return this.$store.state.showConnectionInfo[id]
    },
  },
  watch: {
    '$route.params.id': 'handleIdChanged',
  },
  data() {
    return {
      connectLoading: false,
      showSubscription: false,
      messageType: 'All',
      messages: [],
    }
  },
  methods: {
    ...mapActions([
      'PUSH_MESSAGE', 'CHANGE_CLIENT', 'UNREAD_MESSAGE_COUNT_INCREMENT',
      'CHANGE_SUBSCRIPTIONS', 'CHANGE_SUBS_WIDTH', 'SHOW_CONNECTION_INFO',
    ]),
    handleIdChanged() {
      this.getMessages()
      this.openConnectionForm()
    },
    connect() {
      if (this.connectLoading || this.activeConnection.client.connected) {
        return false
      }
      this.connectLoading = true
      const client = this.createClient()
      const { id } = this.activeConnection
      this.CHANGE_CLIENT({ id, client })
      this.activeConnection.client.on('connect', this.onConnect)
      this.activeConnection.client.on('error', this.onError)
      this.activeConnection.client.on('reconnect', this.onReConnect)
      this.activeConnection.client.on('message', this.messageArrived(id))
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
      setTimeout(() => {
        this.SHOW_CONNECTION_INFO({ id: this.$route.params.id, value: false })
      }, 500)
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
    createClient() {
      const reconnectPeriod = 4000
      const connectTimeout = 4000
      const {
        clientId, username, password, keepalive, clean,
      } = this.activeConnection
      this.connectLoading = true
      return mqtt.connect(this.connectUrl, {
        clientId,
        username,
        password,
        keepalive,
        clean,
        connectTimeout,
        reconnectPeriod,
      })
    },
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
        const currentId = this.$route.params.id
        if (id !== currentId) {
          this.UNREAD_MESSAGE_COUNT_INCREMENT({ id })
        }
      }
    },
    setSubsWidth(val) {
      this.CHANGE_SUBS_WIDTH(val)
    },
    handleCollapse() {
      this.SHOW_CONNECTION_INFO({ id: this.$route.params.id, value: !this.showConnectionInfo })
      this.openConnectionForm()
    },
    openConnectionForm() {
      if (this.$refs.connectionForm) {
        setTimeout(() => {
          this.$refs.connectionForm.open()
        }, 100)
      }
    },
  },
  mounted() {
    this.handleIdChanged()
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'connection-create') {
      next((vm) => {
        vm.connect()
      })
    } else {
      next()
    }
  },
}
</script>


<style lang="scss">
@import "@/assets/scss/mixins.scss";
@import '@/assets/scss/variable.scss';

.connection-details {
  .filter-bar {
    position: fixed;
    left: $width-leftbar;
    right: 0;
    z-index: 3;
  }
  @include top-bar;
  .top-bar {
    @include connection-status;
    .subs-title {
      color: $color-font-black-title;
    }
    .client-name {
      color: $color-bg--second-status;
      font-size: $font-size--subtitle;
      font-weight: 500;
    }
    .client-name.online {
      color: $color-font-black-title;
    }
    a.collapse-btn {
      font-size: 18px;
      float: right;
      transition: all .4s;
      &.top {
        transform: rotate(90deg);
      }
      &.bottom {
        transform: rotate(-90deg);
      }
    }
  }
  .collapse-btn {
    font-size: 20px;
    position: relative;
    top: 3px;
  }
  .filter-bar {
    padding: 16px $spacing--connection-details;
    top: $height--connection-topbar + 1;
    z-index: 1;
    background: $color-bg--main;
    transition: all .4s;
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
    transition: all .4s;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 100;
    background: #fff;
    z-index: 3;
  }
  .el-main {
    transition: all .4s;
    position: relative;
    top: 110px;
    padding: 0px;
  }
}
</style>
