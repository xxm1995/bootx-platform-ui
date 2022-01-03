<template>
  <a-drawer
    :title="title"
    :width="700"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading" style="margin-bottom: 3rem">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item label="主键" prop="id" hidden="true" >
          <a-input v-model="form.id" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="类型"
          prop="orgCategory"
        >
          <a-radio-group
            :disabled="showable"
            v-model="form.orgCategory"
          >
            <a-radio :value="1">公司</a-radio>
            <a-radio :value="2">部门</a-radio>
<!--            <a-radio :value="3">岗位</a-radio>-->
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="机构名称"
          prop="deptName"
        >
          <a-input
            :disabled="showable"
            placeholder="请输入机构名称"
            v-model="form.deptName"
          />
        </a-form-model-item>
        <a-form-model-item
          label="上级机构"
          prop="parentId"
        >
          <a-tree-select
            allowClear
            style="width:100%"
            :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
            :tree-data="treeData"
            v-model="form.parentId"
            :placeholder="addable?'请选择上级机构':'无'"
            :disabled="!addable"
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item
          v-show="!addable"
          label="机构编码"
          prop="component"
        >
          <a-input
            disabled
            v-model="form.orgCode"
          />
        </a-form-model-item>
        <a-form-model-item
          prop="sortNo"
          label="排序">
          <a-input-number
            placeholder="请输入排序，可以是小数"
            :disabled="showable"
            v-model="form.sortNo"
            style="width: 200px"/>
        </a-form-model-item>
        <a-form-model-item
          prop="mobile"
          label="手机号">
          <a-input
            :disabled="showable"
            placeholder="请输入手机号"
            v-model="form.mobile"
          />
        </a-form-model-item>
        <a-form-model-item
          prop="address"
          label="地址">
          <a-input
            :disabled="showable"
            placeholder="请输入地址"
            v-model="form.address"
          />
        </a-form-model-item>
        <a-form-model-item
          prop="remark"
          label="备注">
          <a-textarea
            :disabled="showable"
            placeholder="请输入备注"
            v-model="form.remark"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <div class="drawer-button" >
      <a-button @click="handleCancel" style="margin-right: .8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { get, add, update, tree } from '@/api/system/dept'
import { FormMixin } from '@/mixins/FormMixin'
import { treeDataTranslate } from '@/utils/util'
import { validateMobile } from '@/utils/validate'
export default {
  name: 'DeptEdit',
  mixins: [FormMixin],
  data () {
    return {
      treeData: [],
      form: {
        parentId: null,
        deptName: '',
        sortNo: 0,
        orgCategory: 1,
        orgCode: '',
        mobile: '',
        fax: '',
        address: '',
        remark: ''
      },
      rules: {
        deptName: [ { required: true, message: '请输入机构名称' } ],
        orgCategory: [ { required: true, message: '请选择机构类型' } ],
        mobile: [ { validator: this.validatePhone } ]
      }
    }
  },
  methods: {
    loadTree () {
      tree().then((res) => {
        this.treeData = treeDataTranslate(res.data, 'id', 'deptName')
      })
    },
    async edit (id, type, row) {
      await this.loadTree()
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          this.confirmLoading = false
        })
      } else {
        // 添加下级
        if (row) {
          this.form.menuType = 1
          this.$nextTick(() => {
            this.form.parentId = row.id
          })
        }
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
    validatePhone (rule, value, callback) {
      const { msg, result } = validateMobile(value)
      result || !value ? callback() : callback(msg)
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
