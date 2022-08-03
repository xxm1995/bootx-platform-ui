<template>
  <a-spin :spinning="confirmLoading">
    <a-form-model
      layout="vertical"
      ref="form"
      :model="form"
      :rules="rules"
    >
      <a-form-model-item label="标题" prop="subject">
        <a-input v-model="form.subject" placeholder="请输入邮件名称"/>
      </a-form-model-item>
      <a-form-model-item label="发送人" prop="email">
        <a-input v-model="form.email" placeholder="请输入用户账号"/>
      </a-form-model-item>
      <a-form-model-item ref="message" label="内容" prop="message">
        <div style="border: 1px solid #ccc">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="{ }"
            mode="simple"
          />
          <Editor
            style="height: 300px;max-height: 550px;"
            v-model="form.message"
            :defaultConfig="{ placeholder: '请输入内容...' }"
            mode="simple"
            @onBlur="() => {$refs.message.onFieldBlur()}"
            @onChange="() => {$refs.message.onFieldChange()}"
            @onCreated="onCreated"
          />
        </div>
      </a-form-model-item>
      <a-form-model-item>
        <a-space>
          <a-button @click="restForm">重置</a-button>
          <a-button :loading="confirmLoading" type="primary" @click="send">发送</a-button>
        </a-space>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script>
import { sentSimpleMail } from '@/api/demo/emailSenderDemo'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { validateEmail } from '@/utils/validate'
import { renderHtml } from '@/components/WangEditor/WangEditorCss'
export default {
  name: 'SimpleEmailSender',
  components: { Editor, Toolbar },
  data () {
    return {
      confirmLoading: false,
      editor: null,
      form: {
        subject: '',
        email: '',
        message: ''

      },
      rules: {
        subject: [{ required: true, message: '请输入标题' }],
        email: [
          { required: true, message: '请输入要发送的邮箱地址' },
          { validator: this.validateEmail }
        ],
        message: [{ required: true, message: '请输入邮件内容' }]
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
    /**
     * 发送
     */
    send () {
      this.$refs.form.validate(valid => {
        // 渲染邮件样式
        const message = renderHtml(this.form.message)
        if (valid) {
            this.confirmLoading = true
            sentSimpleMail({
              ...this.form,
              message
            }).then(() => {
              this.$message.success('发送成功')
              this.restForm()
            }).catch(() => {
              this.confirmLoading = false
            })
          }
        }
      )
    },
    restForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.confirmLoading = false
      })
    },
    /**
     * 校验邮箱
     */
    validateEmail (rule, value, callback) {
      const { msg, result } = validateEmail(value)
      result ? callback() : callback(msg)
    }

  }
}
</script>

<style lang="less" scoped>
.ant-form-item{
  margin-bottom: 10px;
}
</style>
