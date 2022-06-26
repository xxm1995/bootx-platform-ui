<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-descriptions
      title=""
      :column="{md: 1, sm: 1, xs: 1}"
    >
      <a-descriptions-item label="数据名称">
        {{ form.dataName }}
      </a-descriptions-item>
      <a-descriptions-item label="数据主键">
        {{ form.dataId }}
      </a-descriptions-item>
      <a-descriptions-item label="数据内容">
        {{ form.dataContent }}
      </a-descriptions-item>
      <a-descriptions-item label="数据版本">
        {{ form.version }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ form.createTime }}
      </a-descriptions-item>

    </a-descriptions>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { dataVersionInfo } from '@/api/starter/log'

export default {
  name: 'DataVersionLogInfo',
  mixins: [ FormMixin ],
  data () {
    return {
      logBusinessType: 'LogBusinessType',
      form: {
        id: '',
        dataName: '',
        dataId: '',
        dataContent: '',
        version: '',
        createTime: ''
      }
    }
  },
  methods: {
    edit (id) {
      dataVersionInfo(id).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>