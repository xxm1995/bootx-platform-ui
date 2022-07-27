<template>
  <vxe-modal
    fullscreen
    v-model="visible"
    :title="title"
    :esc-closable="false"
    :show-footer="false"
    :show-header="false"
    @close="handleCancel"
  >
    <k-form-design
      title="动态表单设计"
      @save="save"
    />
  </vxe-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'

export default {
  name: 'DynamicDesign',
  mixins: [FormMixin],
  data () {
    return {
      visible: true
    }
  },
  methods: {
    save (values) {
      console.log(values)
    }
  }
}
</script>

<style scoped>

</style>
