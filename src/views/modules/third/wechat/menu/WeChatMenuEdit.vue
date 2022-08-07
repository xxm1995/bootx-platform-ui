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
        v-model="menu"
      />
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </vxe-modal>
</template>

<script>
import WxMenuEditor from '@/components/WechatMenu/WxMenuEditor'
import { FormMixin } from '@/mixins/FormMixin'
import { get } from '@/api/demo/dataSensitiveDemo'
import { getMenus, publish } from '@/api/third/weChatMenu'

export default {
  name: 'WeChatMenuEdit',
  components: { WxMenuEditor },
  mixins: [FormMixin],
  data () {
    return {
      visible: true,
      title: '自定义菜单',
      // 获取到菜单数据之前不可以传入空, 否则报错
      menu: {
        buttons: []
      }
    }
  },
  methods: {
    get () {
      this.confirmLoading = true
      getMenus().then(res => {
        this.menu = res.data.menu
        console.log(this.menu)
        this.confirmLoading = false
      })
    },
    edit (id, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          this.rawForm = { ...res.data }
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
      const form = {
        menu: this.menu
      }
      this.confirmLoading = true
      publish(form).then(() => {
        this.$message.success('发布菜单成功')
        this.confirmLoading = false
      })

      console.log(this.menu)
    },
    /**
     * 关闭
     */
    handleCancel () {
      if (this.showable) {
        this.visible = false
      } else {
        this.$confirm({
          title: '警告',
          content: '是否退出自定义菜单编辑，内容将不会被保存?',
          onOk: () => {
            this.visible = false
          }
        })
      }
    }
  },
  mounted () {
    this.get()
  }
}
</script>

<style scoped>

</style>
