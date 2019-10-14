<template>
  <div class="leftbar-connections">
    <div class="connection-item"
      v-for="connection in connections"
      :class="{ active: connection.name === activeConnection.name }"
      :key="`${connection.id}`"
      @click="changeActiveConnection(connection)">
      <div class="item-left">
        <div class="connection-status" :class="{ online: connection.client.connected }"></div>
        <div class="client-info">
          <div class="client-name">
            {{ connection.name  }}@{{ connection.host }}:{{connection.port}}
          </div>
        </div>
      </div>
      <div class="new-msg-count" v-if="connection.unreadMessageCount > 0">
        {{ connection.unreadMessageCount }}
      </div>
      <a href="javascript:;" class="delete-connection" @click.stop="deleteConnection(connection)">
        <i class="el-icon-close"></i>
      </a>
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
  watch: {
    '$route.params.id': 'routeChanged',
  },
  methods: {
    ...mapActions([
      'UNREAD_MESSAGE_COUNT_INCREMENT', 'CHANGE_ACTIVE_CONNECTION', 'DELETE_CONNECTION',
    ]),
    routeChanged() {
      const { id } = this.$route.params
      const activeConnection = this.$store.state.connections.find($ => $.id === id)
      this.CHANGE_ACTIVE_CONNECTION(activeConnection)
    },
    changeActiveConnection(connection) {
      this.UNREAD_MESSAGE_COUNT_INCREMENT({ id: connection.id, count: 0 })
      this.CHANGE_ACTIVE_CONNECTION(connection)
      this.$router.push({ path: `/connections/${connection.id}` })
    },
    deleteConnection(connection) {
      let changeRoute = false
      if (connection.name === this.activeConnection.name) {
        this.CHANGE_ACTIVE_CONNECTION(this.$store.state.connections[0])
        changeRoute = true
      }
      this.DELETE_CONNECTION(connection.id)
      if (changeRoute) {
        this.$router.push({ path: '/' })
      }
    },
  },
  created() {
    if (!this.activeConnection) {
      this.$router.push({ path: '/' })
    }
    this.routeChanged()
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
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    padding: 0 16px;
    cursor: pointer;
    &.active, &:hover {
      background-color: $color-bg--black-active;
    }
    &:hover {
      .delete-connection {
        display: block;
      }
    }
    .client-info {
      display: inline-block;
      .client-name {
        font-size: $font-size--body;
        font-weight: 500;
        color: $color-font--white-title;
      }
      .client-id {
        margin-top: 2px;
        font-size: $font-size--tips;
        color: $color-font--white-tips;
        width: 216px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
    .delete-connection {
      display: none;
      position: absolute;
      right: 16px;
      top: 8px;
      color: #fff;
      &:hover {
        color: $color-main-green;
      }
      .el-icon-close {
        font-weight: 600;
      }
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
