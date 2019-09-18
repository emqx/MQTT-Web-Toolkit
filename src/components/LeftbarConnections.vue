<template>
  <div class="leftbar-connections">
    <div class="connection-item"
      v-for="connection in connections"
      :class="{ active: connection.name == activeConnection }"
      :key="connection.clientID"
      @click="changeActiveConnection(connection.name)">
      <div class="item-left">
        <div class="connection-status" :class="{ online: connection.connected }"></div>
        <div class="client-info">
          <div class="client-name">{{ connection.name  }}</div>
          <div class="client-id">ClientID: {{ connection.clientID  }}</div>
        </div>
      </div>
      <div class="new-msg-count" v-if="connection.messageCount > 0">
        {{ connection.messageCount }}
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions } from 'vuex'

export default {
  name: 'LeftbarConnections',
  computed: {
    connections() {
      return this.$store.state.connections
    },
    activeConnection() {
      return this.$store.state.activeConnection
    },
  },
  methods: {
    ...mapActions(['CHANGE_ACTIVE_CONNECTION']),
    changeActiveConnection(connectionName) {
      this.CHANGE_ACTIVE_CONNECTION(connectionName)
    },
  },
};
</script>


<style scoped lang="scss">
@import '@/assets/scss/variable.scss';

.leftbar-connections {
  margin-top: $height--leftbar-top;
  margin-bottom: $height--new-connection-btn;
  .connection-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    padding: 0 16px;
    cursor: pointer;
    &.active, &:hover {
      background-color: $color-bg--black-active;
    }
    .client-info {
      display: inline-block;
      margin-left: 8px;
      .client-name {
        font-size: $font-size--body;
        font-weight: 500;
        color: $color-font--white-title;
      }
      .client-id {
        font-size: $font-size--tips;
        color: $color-font--white-tips;
      }
    }
    .new-msg-count {
      min-width: 18px;
      height: 18px;
      line-height: 18px;
      background: $color-main-green;
      border-radius: 9px;
      padding: 0 6px;
      color: $color-font--white-title;
      font-size: $font-size--tips;
      text-align: center;
    }
    .connection-status {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background-color: $color-bg--connection-status;
      vertical-align: top;
      margin-top: 7px;
      &.online {
        background: $color-main-green;
      }
    }
  }
}
</style>
