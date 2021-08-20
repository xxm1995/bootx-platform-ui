<template>
  <a-modal
    title="支付通道"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          label="支付通道"
          prop="channelId"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            :disabled="type !== 'add'"
            allowClear
            v-model="form.channelId">
            <a-select-option v-for=" o in channelList" :key="o.id" >{{ o.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="支付方式编码"
          prop="name"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.code"
          />
        </a-form-model-item>
        <a-form-model-item
          label="支付方式名称"
          prop="icon"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.name"
          />
        </a-form-model-item>
        <a-form-model-item
          label="描述"
          prop="description"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.description"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { get, add, update } from '@/api/payment/channelWay'
import { getChannels } from '@/api/payment/channel'

export default {
  name: 'ChannelWayEdit',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      form: {
        code: '',
        name: '',
        icon: '',
        bgColor: '',
        state: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入通道名称' }
        ],
        code: [
          { required: true, message: '请输入通道代码' }
        ],
        channelId: [
          { required: true, message: '请选择所属支付通道' }
        ]
      },
      channelList: [],
      type: 'add',
      editable: false,
      addable: false,
      showTable: false,
      dsType: '2',
    }
  },
  methods: {
    // 获取角色信息
    edit (id, type) {
      this.visible = true
      this.initChannelList()
      if (type && type === 'add') {
        this.addable = true
        this.type = type
        this.resetForm()
      }
      if (type === 'edit') {
        this.editable = true
        this.type = type
      }
      if (type === 'show') {
        this.showTable = true
        this.type = type
      }
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          const record = res.data
          this.dsType = record.dsType
          this.confirmLoading = false
          this.form = record
        })
      } else {
        this.dsType = '2'
      }
    },
    selectChange (e) {
      this.dsType = e
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
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
    // 初始化通道列表
    initChannelList () {
      getChannels().then(res => {
        console.log(res)
        this.channelList = res.data
      })
    },
    handleCancel () {
      this.visible = false
      this.resetForm()
      setTimeout(() => {
        this.addable = false
        this.showTable = false
        this.editable = false
      }, 200)
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