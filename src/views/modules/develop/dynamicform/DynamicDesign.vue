<template>
  <vxe-modal
    fullscreen
    transfer
    v-model="visible"
    :title="title"
    :esc-closable="false"
    :show-footer="false"
    :show-header="false"
    @close="handleCancel"
  >
    <div>
      <k-form-design
        title="动态表单设计"
        :show-head="false"
        @close="close"
        @save="save"
      />
    </div>
  </vxe-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
export default {
  name: 'DynamicDesign',
  mixins: [FormMixin],
  data () {
    return {
    }
  },
  methods: {
    /**
     * 保存回调
     */
    save (values) {
      console.log(values)
    },
    /**
     * 关闭回调
     */
    close () {
      console.log(111)

      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
