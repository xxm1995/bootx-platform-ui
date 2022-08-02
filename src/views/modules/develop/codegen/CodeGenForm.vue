<template>
  <a-drawer
    title="代码生成参数配置"
    width="50%"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel">
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >

      <a-form-model-item label="功能模块名称" prop="module">
        <a-row>
          <a-col :span="18">
            <a-input v-model="form.module">
              <template #suffix>
                <a-tooltip title="提示文本"><a-icon type="info-circle"/></a-tooltip>
              </template>
            </a-input>
          </a-col>
          <a-col :span="6">
            <a-button style="width: 100%" @click="genParams">生成包参数</a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item
        label="基础包名称"
        prop="basePack">
        <a-input v-model="form.basePack"/>
      </a-form-model-item>
      <a-form-model-item
        label="实体类名称"
        prop="entityName">
        <a-input v-model="form.entityName"/>
      </a-form-model-item>
      <a-form-model-item
        label="基类"
        prop="baseEntity">
        <a-select
          allowClear
          v-model="form.baseEntity"
          :default-value="form.baseEntity"
          style="width: 100%"
          placeholder="选择基类">
          <a-select-option key="MpBaseEntity">MpBaseEntity</a-select-option>
          <a-select-option key="MpDelEntity">MpDelEntity</a-select-option>
          <a-select-option key="MpCreateEntity">MpCreateEntity</a-select-option>
          <a-select-option key="MpIdEntity">MpIdEntity</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="请求地址"
        prop="baseEntity">
        <a-input v-model="form.requestPath"/>

      </a-form-model-item>
      <a-form-model-item
        label="前端接口文件所在目录"
        prop="vueApiPath">
        <a-input v-model="form.vueApiPath"/>

      </a-form-model-item>
      <a-form-model-item
        label="创建人"
        prop="author">
        <a-input v-model="form.author"/>
      </a-form-model-item>
    </a-form-model>
    <div class="drawer-button" >
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" type="primary" :disabled="!genParamFlag" @click="handleOk">生成</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { getTableGenParam } from '@/api/develop/codeGen'

export default {
  name: 'CodeGenForm',
  data () {
    return {
      visible: false,
      type: 'preview',
      labelCol: { xs: { span: 24 }, sm: { span: 5 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 17 } },
      genParamFlag: false,
      form: {
        basePack: '',
        module: '',
        author: '',
        tableName: '',
        entityName: '',
        baseEntity: 'MpBaseEntity',
        corePack: '',
        paramPack: '',
        dtoPack: '',
        controllerPack: '',
        requestPath: '',
        vueApiPath: ''
      },
      rules: {
        module: [{ required: true, message: '请输入功能模块名称' }],
        author: [{ required: true, message: '请输入创建人' }]
      }
    }
  },
  methods: {
    // 打开
    show (tableName, type) {
      this.visible = true
      this.form.tableName = tableName
      this.type = type
      this.getGenConfigParam()
    },
    // 确定
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.type === 'gen') {
            this.$emit('gen', this.form)
          } else {
            this.$emit('preview', this.form)
          }
        }
      })
    },
    /**
     * 获取代码生成配置信息
     */
    async getGenConfigParam () {
      // 获取功能模块名称
      const tableGenParam = await getTableGenParam(this.form.tableName)
      const entityName = tableGenParam.data.entityName
      const module = tableGenParam.data.module
      this.form.entityName = entityName
      this.form.module = module
      this.form.requestPath = `/${module}`
      this.form.vueApiPath = `/api/${module}/`
      // 获取生成配置
    },
    /**
     * 生成代码生成参数参数
     */
    genParams () {
      const { basePack, module } = this.form
      // 包名
      this.form.corePack = `${basePack}.core.${module}`
      this.form.paramPack = `${basePack}.param.${module}`
      this.form.dtoPack = `${basePack}.dto.${module}`
      this.form.controllerPack = `${basePack}.controller`

      this.genParamFlag = true
      console.log(this.form)
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
