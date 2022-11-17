<template>
  <vxe-modal
    resize
    fullscreen
    v-model="visible"
    title="发布系统通知消息"
    :esc-closable="false"
    @close="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        layout="vertical"
        :model="form"
        :rules="rules">
        <a-form-model-item label="标题" prop="title">
          <a-input v-model="form.title" placeholder="请输入标题"/>
        </a-form-model-item>
        <a-form-model-item ref="content" label="内容" prop="content">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="{ }"
              mode="simple"
            />
            <Editor
              style="height: 300px;max-height: 650px;"
              v-model="form.content"
              :defaultConfig="{ placeholder: '请输入内容...' }"
              mode="simple"
              @onBlur="() => {$refs.content.onFieldBlur()}"
              @onChange="() => {$refs.content.onFieldChange()}"
              @onCreated="onCreated"
            />
          </div>
        </a-form-model-item>
        <a-form-model-item label="截止有效期" prop="efficientTime">
          <a-date-picker
            style="width: 100%"
            :defaultValue="efficientTime"
            placeholder="请选择消息截止有效期"
            valueFormat="yyyy-MM-DD"
            v-model="form.efficientTime"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button :loading="confirmLoading" type="primary" @click="handleOk(false)">保存</a-button>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
      </a-space>
    </template>
  </vxe-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { saveOrUpdate, findById } from '@/api/notice/siteMessage'
import '@wangeditor/editor/dist/css/style.css'
import XEUtils from 'xe-utils'

export default {
  name: 'SiteMessageEdit',
  mixins: [FormMixin],
  components: { Editor, Toolbar },
  data () {
    return {
      editor: null,
      efficientTime: '',
      form: {
        title: '',
        content: '',
        receiveType: 'all',
        efficientTime: null
      },
      rules: {
        title: [{ required: true, message: '标题不可为空!' }],
        content: [{ required: true, message: '内容不可为空!' }],
        efficientTime: [{ required: true, message: '截止有效期不可为空!' }]
      }
    }
  },
  methods: {
    /**
     * 富文本编辑
     */
    onCreated (editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    edit (id, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        findById(id).then(res => {
          this.form = res.data
          this.rawForm = { ...res.data }
          this.confirmLoading = false
        })
      } else {
        this.form.efficientTime = this.efficientTime
        this.confirmLoading = false
      }
    },
    /**
     * 保存为草稿
     */
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          await saveOrUpdate(this.form)
          this.confirmLoading = false
          this.$emit('ok')
          this.visible = false
        } else {
          return false
        }
      })
    },
    /**
     * 发布
     */
    publish () {
      console.log(this.form)
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    }
  },
  mounted () {
    const date = XEUtils.getWhatDay(new Date(), 30)
    this.efficientTime = XEUtils.toDateString(date, 'yyyy-MM-dd')
  }
}
</script>

<style lang="less" scoped>
.w-e-text-container{
  .ant-form-item-control{
    line-height: 20px !important;
  }
}
</style>
