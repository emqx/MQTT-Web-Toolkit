<template>
  <div class="leftbar-connections">
    <div class="connection-item"
      v-for="connection in connections"
      :class="{ active: connection.name === activeConnection.name }"
      :key="connection.clientId"
      @click="changeActiveConnection(connection)">
      <div class="item-left">
        <div class="connection-status" :class="{ online: connection.client.connected }"></div>
        <div class="client-info">
          <div class="client-name">{{ connection.name  }}</div>
          <div class="client-id">ClientID: {{ connection.clientId  }}</div>
        </div>
      </div>
      <div class="new-msg-count" v-if="connection.unreadMessageCount > 0">
        {{ connection.unreadMessageCount }}
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
      const clientId = this.$route.params.id
      return this.$store.state.connections.find($ => $.clientId === clientId)
    },
  },
  methods: {
    ...mapActions(['UNREAD_MESSAGE_COUNT_INCREMENT', 'CHANGE_ACTIVE_CONNECTION']),
    changeActiveConnection(connection) {
      this.UNREAD_MESSAGE_COUNT_INCREMENT({ name: connection.name, count: 0 })
      this.CHANGE_ACTIVE_CONNECTION(connection)
      this.$router.push({ path: `/connections/${connection.clientId}` })
    },
  },
  created() {
    if (!this.activeConnection) {
      this.$router.push({ path: '/' })
    }
    this.CHANGE_ACTIVE_CONNECTION(this.activeConnection)
  },
};
</script>


<style scoped lang="scss">
@import "@/assets/scss/mixins.scss";
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
    @include connection-status;
    .connection-status {
      vertical-align: top;
      margin-top: 8px;
      background-color: $color-bg--main-status;
    }
  }
}
</style>
