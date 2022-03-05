<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'

export default {
  name: 'RefundModel',
  mixins: [FormMixin]
}
</script>

<style scoped>

</style>