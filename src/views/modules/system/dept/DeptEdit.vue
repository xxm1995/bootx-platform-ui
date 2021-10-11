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
        <a-form-model-item
          label="名称"
          prop="component"
        >
          <a-input
            :disabled="showable"
            placeholder="请输入路由参数 redirect"
            v-model="form.deptName"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-drawer>
</template>

<script>
import { get, add, update } from '@/api/system/dept'
import { FormMixin } from '@/mixins/FormMixin'
export default {
  name: 'DeptEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        parentId: '',
        deptName: '',
        sortNo: 0,
        orgCategory: '',
        orgCode: '',
        mobile: '',
        fax: '',
        address: '',
        remark: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        title: [ { required: true, message: '请输入菜单或权限名称' } ],
        name: [ { required: this.menuEditShow, message: '请输入路由名称' } ],
        path: [ { required: this.menuEditShow, message: '请输入菜单路径' } ],
        perms: [ { required: !this.menuEditShow, message: '请输入权限代码' } ],
        url: [{ required: this.menuEditShow, message: '请输入菜单路径' }]
      }
    }
  },
  methods: {
    edit (id, type, row) {
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
