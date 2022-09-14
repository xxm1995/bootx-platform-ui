<template>
  <a-card :bordered="false">
    <a-row :gutter="64">
      <a-col :span="8">
        <a-card title="任务历史" :bordered="false">
          <a-timeline>
            <a-timeline-item v-for="o in taskList" :key="o.id">
              <p>开始时间: {{ o.startTime }}</p>
              <p>环节: {{ o.nodeName }}</p>
              <p>状态：{{ stateNameConvert(o.state) }}</p>
              <p>处理人: {{ o.userName }}</p>
              <p>结束时间: {{ o.endTime }}</p>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card title="流程信息" :bordered="false">
          <a-descriptions :column="{md: 1}" bordered>
            <a-descriptions-item label="流程实例名称">
              {{ instance.instanceName }}
            </a-descriptions-item>
            <a-descriptions-item label="流程定义的id">
              {{ instance.defId }}
            </a-descriptions-item>
            <a-descriptions-item label="流程定义的名称">
              {{ instance.defName }}
            </a-descriptions-item>
            <a-descriptions-item label="发起人名称">
              {{ instance.startUserName }}
            </a-descriptions-item>
            <a-descriptions-item label="开始时间">
              {{ instance.startTime }}
            </a-descriptions-item>
            <a-descriptions-item label="结束时间">
              {{ instance.endTime }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { dictConvert } from '@/components/Bootx/Dict/DictUtils'

export default {
  name: 'TaskHistory',
  props: {
    instance: { type: Object, required: true },
    taskList: { type: Array, required: true }
  },
  methods: {
    /**
     * 任务状态翻译
     */
    stateNameConvert (state) {
      return dictConvert('BpmTaskState', state)
    }
  }
}
</script>

<style scoped>

</style>
