<template>
  <vxe-modal
    :resize="false"
    :width="1030"
    :position="{top: '100px',left: '300px'}"
    :title="title"
    :show-close="false"
    :esc-closable="false"
    v-model="visible"
    destroy-on-close
  >
    <a-spin :spinning="confirmLoading">
      <wx-menu-editor
        :showable="showable"
        v-model="form.menuInfo"
      />
    </a-spin>
    <template #footer>
      <a-button @click="handleClose">取消</a-button>
      <a-button v-if="!showable" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </vxe-modal>
</template>

<script>
import WxMenuEditor from '@/views/modules/third/wechat/menu/edit/WxMenuDesign'
import { FormMixin } from '@/mixins/FormMixin'
import { get, update } from '@/api/third/weChatMenu'

export default {
  name: 'WeChatMenuDesign',
  components: { WxMenuEditor },
  mixins: [FormMixin],
  data () {
    return {
      title: '自定义菜单',
      form: {
        // 获取到菜单数据之前不可以传入空, 否则报错
        menuInfo: {
          buttons: []
        }
      }
    }
  },
  methods: {
    edit (id, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          this.confirmLoading = false
        })
      } else {
        this.confirmLoading = false
      }
    },

    /**
     * 保存
     */
    handleOk () {
      const form = this.form
      this.confirmLoading = true
      update(form).then(() => {
        this.$message.success('保存自定义菜单设计内容成功')
        this.visible = false
        this.confirmLoading = false
      })
    },
    /**
     * 关闭
     */
    handleClose () {
      if (this.showable) {
        this.handleCancel()
      } else {
        this.$confirm({
          title: '警告',
          content: '是否退出自定义菜单编辑，内容将不会被保存?',
          onOk: () => {
            this.handleCancel()
          }
        })
      }
    }
  },
  mounted () {
    // this.get()
  }
}
</script>

<style scoped>

</style>
