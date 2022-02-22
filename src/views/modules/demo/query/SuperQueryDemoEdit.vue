<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
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
        label="年龄"
        prop="age"
      >
        <a-input-number v-model="form.age" :disabled="showable" :precision="0"/>
      </a-form-model-item>
      <a-form-model-item
        label="是否vip"
        prop="vip"
      >
        <a-switch
          :disabled="showable"
          checkedChildren="是"
          unCheckedChildren="否"
          v-model="form.vip"/>
      </a-form-model-item>
      <a-form-model-item
        label="生日"
        prop="birthday"
      >
        <a-date-picker
          placeholder="请选择日期"
          valueFormat="yyyy-MM-DD"
          :disabled="showable"
          v-model="form.birthday"/>
      </a-form-model-item>
      <a-form-model-item
        label="上班时间"
        prop="workTime"
      >
        <a-time-picker
          placeholder="请选择时间"
          valueFormat="HH:mm:ss"
          :disabled="showable"
          v-model="form.workTime"/>
      </a-form-model-item>
      <a-form-model-item
        label="政治面貌"
        prop="political"
      >
        <a-select v-model="form.political" :disabled="showable">
          <a-select-option v-for="o in politicalList" :key="o.code">{{ o.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="备注"
        prop="remark"
      >
        <a-textarea v-model="form.remark" :disabled="showable"/>
      </a-form-model-item>
    </a-form-model>

    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, add, update } from '@/api/demo/superQueryDemo'
export default {
  name: 'SuperQueryDemoEdit',
  mixins: [FormMixin],
  data () {
    return {
      politicalList: [],
      form: {
        id: null,
        name: '',
        age: 18,
        vip: true,
        birthday: '',
        workTime: '',
        registrationTime: '',
        political: 13,
        remark: ''
      },
      rules: {
        name: [ { required: true, message: '请输入名称' } ],
        age: [ { required: true, message: '请输入年龄' } ],
        vip: [ { required: true, message: '请选择是否vip' } ],
        birthday: [ { required: true, message: '请选择出生日期' } ],
        workTime: [ { required: true, message: '请选择工作时间' } ],
        political: [ { required: true, message: '请选择政治面貌' } ]
      }
    }
  },
  methods: {
    edit (id, type) {
      this.politicalList = this.getDictItemsByNumber('Political')
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
    }
  }
}
</script>

<style scoped>

</style>
