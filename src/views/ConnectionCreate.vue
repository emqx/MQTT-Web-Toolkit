<template>
  <div class="connection-create">
    <div class="top-bar">
      <el-collapse-transition>
        <connection-form
          ref="connectionForm"
          :edit="false">
        </connection-form>
      </el-collapse-transition>
    </div>
  </div>
</template>


<script>
import ConnectionForm from '@/components/ConnectionForm.vue'

export default {
  name: 'connection-create',
  components: {
    ConnectionForm,
  },
}
</script>


<style lang="scss">
@import '@/assets/scss/variable.scss';
@import "@/assets/scss/mixins.scss";

.connection-create {
  @include top-bar;
}
</style>
