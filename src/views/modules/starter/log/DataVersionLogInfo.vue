<template>
  <a-modal
    :title="title"
    :width="960"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-descriptions title="" :column="{ md: 2, sm: 1, xs: 1 }">
        <a-descriptions-item label="表名称">
          {{ form.tableName }}
        </a-descriptions-item>
        <a-descriptions-item label="数据名称">
          {{ form.dataName }}
        </a-descriptions-item>
        <a-descriptions-item label="数据主键">
          {{ form.dataId }}
        </a-descriptions-item>
        <a-descriptions-item label="数据版本">
          {{ form.version }}
        </a-descriptions-item>
        <a-descriptions-item label="数据内容">
          <json-viewer preview-mode :value="JSON.parse(form.dataContent || '{}')" />
        </a-descriptions-item>
        <a-descriptions-item label="变动内容">
          <json-viewer preview-mode :value="JSON.parse(form.changeContent || '{}')" />
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { dataVersionInfo } from '@/api/starter/log'
import JsonViewer from 'vue-json-viewer'

export default {
  name: 'DataVersionLogInfo',
  mixins: [ FormMixin ],
  components: { JsonViewer },
  data () {
    return {
      logBusinessType: 'LogBusinessType',
      form: {
        id: '',
        dataName: '',
        dataId: '',
        dataContent: '{}',
        changeContent: '{}',
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
