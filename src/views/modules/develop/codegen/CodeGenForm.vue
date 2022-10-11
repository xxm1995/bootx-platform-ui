<template>
  <a-drawer
    title="代码生成参数配置"
    width="50%"
    :visible="visible"
    :destroyOnClose="true"
    :maskClosable="false"
    @close="handleCancel">
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
            <a-input v-model="form.module"/>
          </a-col>
          <a-col :span="6">
            <a-button style="width: 100%" @click="genParams">生成其他参数</a-button>
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
        label="vue版本"
        prop="vueVersion">
        <a-select
          v-model="form.vueVersion"
          :default-value="form.vueVersion"
          style="width: 100%"
          placeholder="选择vue版本">
          <a-select-option key="v2">Vue2</a-select-option>
          <a-select-option key="v3">Vue3</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="基类"
        prop="baseEntity">
        <a-select
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
        label="创建人"
        prop="author">
        <a-input v-model="form.author"/>
      </a-form-model-item>
      <template v-if="genPackFlag">
        <a-form-model-item
          label="请求地址"
          prop="baseEntity">
          <a-input v-model="form.requestPath"/>
        </a-form-model-item>
        <a-form-model-item
          label="接口文件目录"
          prop="vueApiPath">
          <a-input v-model="form.vueApiPath"/>
        </a-form-model-item>
        <a-form-model-item
          label="core包路径"
          prop="corePack">
          <a-input v-model="form.corePack"/>
        </a-form-model-item>
        <a-form-model-item
          label="dto包路径"
          prop="dtoPack">
          <a-input v-model="form.dtoPack"/>
        </a-form-model-item>
        <a-form-model-item
          label="参数包路径"
          prop="paramPack">
          <a-input v-model="form.paramPack"/>
        </a-form-model-item>
      </template>
    </a-form-model>
    <div class="drawer-button" >
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" type="primary" :disabled="!genPackFlag" @click="handleOk">生成</a-button>
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
      genPackFlag: false,
      form: {
        basePack: 'cn.bootx',
        module: '',
        tableName: '',
        entityName: '',
        baseEntity: 'MpBaseEntity',
        vueVersion: 'v2',
        corePack: '',
        paramPack: '',
        dtoPack: '',
        controllerPack: '',
        requestPath: '',
        vueApiPath: '',
        author: 'xxm'
      },
      rules: {
        // module: [{ required: true, message: '请输入功能模块名称' }],
        // author: [{ required: true, message: '请输入创建人' }]
      }
    }
  },
  methods: {
    // 打开
    show (tableName, type) {
      this.visible = true
      this.form.tableName = tableName
      this.type = type
      this.genPackFlag = false
      console.log(this.form)
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

      this.form.requestPath = `/${module}`
      this.form.vueApiPath = `/api/${module}`
      this.genPackFlag = true
    },
    handleCancel () {
      this.resetForm()
      this.visible = false
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    }
  }

}
</script>

<style scoped>

</style>
