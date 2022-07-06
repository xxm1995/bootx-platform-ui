<template>
  <a-drawer
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @close="handleCancel"
    :confirmLoading="confirmLoading">
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
          label="编码"
          prop="code"
        >
          <a-input v-model="form.code" :disabled="showable" placeholder="请输入编码"/>
        </a-form-model-item>
        <a-form-model-item
          label="名称"
          prop="name"
        >
          <a-input v-model="form.name" :disabled="showable" placeholder="请输入名称"/>
        </a-form-model-item>
        <a-form-model-item
          label="启用状态"
          prop="enable"
        >
          <a-switch checked-children="开" un-checked-children="关" v-model="form.enable" :disabled="showable||form.system" />
        </a-form-model-item>
        <a-form-model-item
          label="系统内置"
          prop="system"
        >
          <a-tag v-if="form.system" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </a-form-model-item>
        <a-form-model-item
          label="关联终端"
          prop="clientIdList"
        >
          <a-select
            allowClear
            mode="multiple"
            v-model="form.clientIdList"
            :default-value="form.clientIdList"
            :filter-option="search"
            :disabled="showable"
            style="width: 100%"
            placeholder="选择关联的终端"
          >
            <a-select-option v-for="o in clients" :key="o.id">
              {{ o.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="描述"
          prop="description"
        >
          <a-textarea v-model="form.description" :disabled="showable" placeholder="请输入描述"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <div class="drawer-button" >
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </div>
  </a-drawer>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, add, update, existsByCode, existsByCodeNotId } from '@/api/system/client'
import { findAll } from '@/api/system/loginType'
export default {
  name: 'ClientEdit',
  mixins: [FormMixin],
  data () {
    return {
      clients: [],
      form: {
        id: null,
        code: '',
        name: '',
        system: false,
        enable: true,
        clientIdList: [],
        description: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入应用编码' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入应用名称' }
        ],
        enable: [
          { required: true, message: '请选择启用状态' }
        ]
      }
    }
  },
  methods: {
    edit (id, type) {
      this.initClients()
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
    // 初始化终端列表
    async initClients () {
      const { data } = await findAll()
      this.clients = data.map(res => {
        return {
          id: res.id,
          name: res.name
        }
      })
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.type === 'add') {
            await add(this.form)
          } else if (this.type === 'edit') {
            await update(this.form)
          }
          setTimeout(() => {
            this.confirmLoading = false
            this.$emit('ok')
            this.visible = false
          }, 200)
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    async validateCode (rule, value, callback) {
      const { code, id } = this.form
      let res
      if (this.type === 'edit') {
        res = await existsByCodeNotId(code, id)
      } else {
        res = await existsByCode(code)
      }
      if (!res.data) {
        callback()
      } else {
        callback('该编码已存在!')
      }
    },
    search (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style scoped>

</style>
