<template>
  <process-viewer
    ref="processViewer"
    :height="750"
    :instance="instance"
    :node-task-list="nodeTaskList"
    :flow-node-list="flowNodeList"
    :xml="bpmModel.modelEditorXml"/>
</template>

<script>
import ProcessViewer from '@/components/Bpmn/ProcessViewer'

export default {
  name: 'FlowChart',
  components: { ProcessViewer },
  props: {
    instance: { type: Object, required: true },
    nodeTaskList: { type: Object, required: true },
    flowNodeList: { type: Array, required: true },
    bpmModel: { type: Object, required: true }
  }
}
</script>

<style scoped>

</style>
