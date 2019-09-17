<template>
  <el-dialog
    class="my-dialog"
    :append-to-body="true"
    :center="true"
    :visible.sync="showDialog"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="open"
    @close="close">

    <slot></slot>

    <div slot="footer" class="dialog-footer" v-if="footer">
      <el-button class="cancel" type="text" size="small" @click="close">Cancel</el-button>
      <el-button
        class="confirm-button"
        type="text"
        :loading="confirmLoading"
        :disabled="btnDisabled"
        @click="confirmClick">Confirm
      </el-button>
    </div>

  </el-dialog>
</template>


<script>
export default {
  name: 'my-dialog',
  props: {
    title: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: '560px',
    },
    // Show dialog
    visible: {
      type: Boolean,
      default: false,
    },
    // Confirm button loading
    confirmLoading: {
      type: Boolean,
      default: false,
    },
    // Confirm button disabled status
    btnDisabled: {
      type: Boolean,
      default: false,
    },
    footer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showDialog: this.visible,
    }
  },
  watch: {
    visible(val) {
      this.showDialog = val
    },
  },
  methods: {
    confirmClick() {
      // Confirm event
      this.$emit('confirm')
    },
    open() {
      // Open the dialog event
      this.$emit('open')
    },
    close() {
      this.$emit('update:visible', false)
      // Close the dialog event
      this.$emit('close')
    },
  },
}
</script>


<style lang="scss">
@import "~@/assets/scss/variable.scss";

.my-dialog {
  .el-dialog__header {
    padding: 0 20px;
    line-height: 56px;
    border-bottom: 1px solid $color-border--black;
    .el-dialog__title {
      color: $color-font-black-title;
      font-size: $font-size--subtitle;
    }
  }
  .el-dialog--center .el-dialog__body {
    padding: 24px;
  }
  .el-dialog__footer {
    text-align: right !important;
    padding: 10px 24px;
    .el-button--text {
      font-size: 14px;
      color: $color-font-black-default;
      &:hover {
        color: $color-main-green;
      }
    }
    .confirm-button {
      margin-left: 24px;
      color: $color-main-green;
      &:hover {
        color: $color-second-green;
      }
    }
  }
}
</style>
