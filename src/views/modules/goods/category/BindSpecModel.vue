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
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          label="品牌"
          prop="roleIds"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            allowClear
            mode="multiple"
            v-model="form.specIds"
            :default-value="form.specIds"
            :filter-option="search"
            style="width: 100%"
            placeholder="选择规格"
          >
            <a-select-option v-for="o in specs" :key="o.id">
              {{ o.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { findBindSpecIds, bindSpec } from '@/api/goods/category'
import { findAll } from '@/api/goods/specification'

export default {
  name: 'BindBrandModel',
  mixins: [FormMixin],
  data () {
    return {
      specs: [],
      form: {
        categoryId: null,
        specIds: []
      }
    }
  },
  methods: {
    loadList () {
      findAll().then((res) => {
        this.specs = res.data
      })
    },
    async edit (id, type, row) {
      this.form.categoryId = row.id
      this.confirmLoading = true
      await this.loadList()
      findBindSpecIds(row.id).then(res => {
        this.form.specIds = res.data
        this.confirmLoading = false
      })
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          await bindSpec(this.form)
          this.confirmLoading = false
          this.$emit('ok')
          this.visible = false
        } else {
          return false
        }
      })
    },
    search (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
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
