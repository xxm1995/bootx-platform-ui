<template>
  <vxe-modal
    v-model="visible"
    title="渲染测试"
    :width="modalWidth"
    :position="vxePosition"
    @close="handleCancel"
  >
    <k-form-build ref="kfb" :value="jsonValue" />
    <template #footer>
      <a-button type="primary" @click="handleOk">获取数据</a-button>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </vxe-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get } from '@/api/develop/dynamicForm'
import { toStringJSON } from 'xe-utils'

export default {
  name: 'DynamicPreview',
  mixins: [FormMixin],
  data () {
    return {
      jsonValue: {}
    }
  },
  methods: {
    edit (id) {
      this.confirmLoading = true
      get(id).then(res => {
        this.jsonValue = toStringJSON(res.data.value)
        this.confirmLoading = false
      })
    },
    handleOk () {
      console.log(this.$refs.kfb.getData())
    }
  }
}
</script>

<style scoped>

</style>
