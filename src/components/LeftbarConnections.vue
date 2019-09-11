<template>
  <div class="leftbar-connections">
    <div class="connection-item">
      <div class="item-left">
        <div class="connection-status online"></div>
        <div class="client-info">
          <div class="client-name">Device 1</div>
          <div class="client-id">ClientID: 1111111111111</div>
        </div>
      </div>
      <div class="new-msg-count">12</div>
    </div>

    <div class="connection-item active">
      <div class="item-left">
        <div class="connection-status"></div>
        <div class="client-info">
          <div class="client-name">Device 2</div>
          <div class="client-id">ClientID: 2222222222222</div>
        </div>
      </div>
      <div class="new-msg-count">2</div>
    </div>

    <div class="connection-item">
      <div class="item-left">
        <div class="connection-status"></div>
        <div class="client-info">
          <div class="client-name">Device 1</div>
          <div class="client-id">ClientID: 1111111111111</div>
        </div>
      </div>
      <div class="new-msg-count">12</div>
    </div>

    <div class="connection-item">
      <div class="item-left">
        <div class="connection-status"></div>
        <div class="client-info">
          <div class="client-name">Device 3</div>
          <div class="client-id">ClientID: 1111111111111</div>
        </div>
      </div>
      <div class="new-msg-count">12</div>
    </div>

    <div class="connection-item">
      <div class="item-left">
        <div class="connection-status"></div>
        <div class="client-info">
          <div class="client-name">Device 4</div>
          <div class="client-id">ClientID: 1111111111111</div>
        </div>
      </div>
      <div class="new-msg-count">12</div>
    </div>

    <div class="connection-item">
      <div class="item-left">
        <div class="connection-status"></div>
        <div class="client-info">
          <div class="client-name">Device 5</div>
          <div class="client-id">ClientID: 1111111111111</div>
        </div>
      </div>
      <div class="new-msg-count">12</div>
    </div>

    <div class="connection-item">
      <div class="item-left">
        <div class="connection-status"></div>
        <div class="client-info">
          <div class="client-name">Device 6</div>
          <div class="client-id">ClientID: 1111111111111</div>
        </div>
      </div>
      <div class="new-msg-count">12</div>
    </div>

    <div class="connection-item">
      <div class="item-left">
        <div class="connection-status"></div>
        <div class="client-info">
          <div class="client-name">Device 7</div>
          <div class="client-id">ClientID: 1111111111111</div>
        </div>
      </div>
      <div class="new-msg-count">12</div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'LeftbarConnections',
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
