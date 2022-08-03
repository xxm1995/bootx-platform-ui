<template>
  <a-drawer
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="主键" prop="id" hidden="true" >
          <a-input v-model="form.id" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="名称"
          prop="name"
        >
          <a-input v-model="form.name" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="编码"
          prop="code"
        >
          <a-input v-model="form.code" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="是否启用"
          prop="enable"
        >
          <a-tag color="green" v-if="form.enable">是</a-tag>
          <a-tag color="red" v-else>否</a-tag>
        </a-form-model-item>
        <a-form-model-item
          label="模板ID"
          prop="templateId"
        >
          <a-tag>{{ form.templateId }}</a-tag>
        </a-form-model-item>
        <a-form-model-item
          label="模板标题"
          prop="title"
        >
          <span>{{ form.title }}</span>
        </a-form-model-item>
        <a-form-model-item
          label="一级行业"
          prop="primaryIndustry"
        >
          <span>{{ form.primaryIndustry }}</span>
        </a-form-model-item>
        <a-form-model-item
          label="二级行业"
          prop="deputyIndustry"
        >
          <span>{{ form.deputyIndustry }}</span>
        </a-form-model-item>
        <a-form-model-item
          label="模板内容"
          prop="content"
        >
          <div class="content">{{ form.content }}</div>
        </a-form-model-item>
        <a-form-model-item
          label="示例"
          prop="example"
        >
          <div class="content">{{ form.example }}</div>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <div class="drawer-button">
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">更新</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, update, existsByCodeNotId } from '@/api/third/weChatTemplate'
export default {
  name: 'WeChatTemplateEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        name: null,
        code: null,
        enable: null,
        templateId: null,
        title: null,
        primaryIndustry: null,
        deputyIndustry: null,
        content: null,
        example: null
      },
      rules: {
        name: [{ required: true, message: '请输入微信消息模板名称!' }],
        code: [
          { required: true, message: '请输入微信消息模板编码!' },
          { validator: this.validateCode, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * 编辑
     */
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
     * 提交
     */
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          const { id, code, name } = this.form
          await update({ id, code, name })
          this.confirmLoading = false
          this.$emit('ok')
          this.visible = false
        } else {
          return false
        }
      })
    },
    /**
     * 重置表单
     */
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    /**
     * 编码是否重复
     */
    async validateCode (rule, value, callback) {
      const { code, id } = this.form
      const res = await existsByCodeNotId(code, id)
      if (!res.data) {
        callback()
      } else {
        callback('该编码已存在!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  border: 1px solid gray;
  padding-left: 10px;
}
</style>
