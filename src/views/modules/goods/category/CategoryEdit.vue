<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
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
          label="类目名称"
          prop="name"
        >
          <a-input
            :disabled="showable"
            placeholder="请输入类目名称"
            v-model="form.name"
          />
        </a-form-model-item>
        <a-form-model-item
          label="上级目录"
          v-show="form.pid"
          prop="pid"
        >
          <a-tree-select
            style="width:100%"
            :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
            :tree-data="treeData"
            :placeholder="'无'"
            :disabled="true"
            v-model="form.pid"
          >
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item
          prop="state"
          label="是否启用">
          <a-switch
            :disabled="showable"
            checkedChildren="是"
            unCheckedChildren="否"
            v-model="form.enable"/>
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
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { treeDataTranslate } from '@/utils/util'
import { findTree, update, get, add, existsByName, existsByNameNotId } from '@/api/goods/category'

export default {
  name: 'CategoryEdit',
  mixins: [FormMixin],
  data () {
    return {
      treeData: [],
      form: {
        id: null,
        pid: null,
        name: '',
        enable: true,
        sortNo: 0,
        remark: '',
        image: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入类目名称' },
          { validator: this.validateName, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loadTree () {
      findTree().then((res) => {
        this.treeData = treeDataTranslate(res.data, 'id', 'name')
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
          this.$nextTick(() => {
            this.form.pid = row.id
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
    // 验证类目名称是否重复
    async validateName (rule, value, callback) {
      let result
      if (this.type === 'add') {
        result = await existsByName(value)
      } else {
        result = await existsByNameNotId(value, this.form.id)
      }
      result.data ? callback('该类目已经存在') : callback()
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
