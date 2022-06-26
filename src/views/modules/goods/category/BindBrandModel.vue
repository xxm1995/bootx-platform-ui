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
            v-model="form.brandIds"
            :default-value="form.brandIds"
            :filter-option="search"
            style="width: 100%"
            placeholder="选择品牌"
          >
            <a-select-option v-for="o in brands" :key="o.id">
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
import { findBindBrandIds, bindBrand } from '@/api/goods/category'
import { findAll } from '@/api/goods/brand'

export default {
  name: 'BindBrandModel',
  mixins: [FormMixin],
  data () {
    return {
      brands: [],
      form: {
        categoryId: null,
        brandIds: []
      }
    }
  },
  methods: {
    loadList () {
      findAll().then((res) => {
        this.brands = res.data
      })
    },
    async edit (id, type, row) {
      this.form.categoryId = row.id
      this.confirmLoading = true
      await this.loadList()
      findBindBrandIds(row.id).then(res => {
        this.form.brandIds = res.data
        this.confirmLoading = false
      })
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          await bindBrand(this.form)
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
