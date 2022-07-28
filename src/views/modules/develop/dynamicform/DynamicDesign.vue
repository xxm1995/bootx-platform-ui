<template>
  <vxe-modal
    fullscreen
    resize
    destroy-on-close
    v-model="visible"
    :title="title"
    :esc-closable="false"
    :show-footer="false"
    :show-header="false"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <k-form-design
        ref="kf"
        title="动态表单设计"
        :show-head="false"
        @close="close"
        @save="save"
      />
    </a-spin>
  </vxe-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, update } from '@/api/develop/dynamicForm'
import { toStringJSON } from 'xe-utils'
export default {
  name: 'DynamicDesign',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        value: null
      }
    }
  },
  methods: {
    /**
     * 设计表单
     */
    edit (id) {
      this.confirmLoading = true
      get(id).then(res => {
        this.form = res.data
        if (this.form.value) {
          this.$refs.kf.handleSetData(toStringJSON(this.form.value))
        }
        this.confirmLoading = false
      })
    },
    /**
     * 保存回调
     */
    save (values) {
      this.$confirm({
        title: '警告',
        content: '是否保存表单设计内容并退出?',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          this.handleOk(values)
        }
      })
    },
    /**
     * 保存
     */
    handleOk (values) {
      this.confirmLoading = true
      update({
        id: this.form.id,
        value: values
      }).then(() => {
        this.visible = false
      })
    },
    /**
     * 关闭回调
     */
    close () {
      this.$confirm({
        title: '警告',
        content: '是否退出表单设计，内容将不会被保存?',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          this.visible = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
