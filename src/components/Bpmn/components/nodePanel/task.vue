<template>
  <div>
    <a-form-model
      ref="form"
      :model="formData"
      :rules="rules"
      :label-col="{ span: 8,offset: 0 }"
      :wrapper-col="{ span: 14,offset: 0 }"
      layout="horizontal">
      <a-form-model-item label="节点ID" prop="id">
        <a-input v-model="formData.id" placeholder="请输入节点ID" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点名称" prop="name">
        <a-input v-model="formData.name" placeholder="请输入节点名称" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点描述" prop="documentation" v-if="!filter('nodeDocumentation')">
        <a-textarea
          v-model="formData.documentation"
          placeholder="请输入节点描述"
          :auto-size="{minRows: 1, maxRows: 2}"
          :style="{width: '100%'}"
          allow-clear />
      </a-form-model-item>
<!--      <a-form-model-item label="执行监听器" prop="executionListener" v-if="!filter('executionListener')">-->
<!--        <a-badge :count="getExecutionListenerLength">-->
<!--          <a-button type="default" @click="handleShowExecutionListener"> 编辑 </a-button>-->
<!--        </a-badge>-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="任务监听器" prop="taskListener" v-show="!!showConfig.taskListener" v-if="!filter('taskListener')">-->
<!--        <a-badge :count="computedTaskListenerLength">-->
<!--          <a-button type="default" @click="taskListenerVisible = true"> 编辑 </a-button>-->
<!--        </a-badge>-->
<!--      </a-form-model-item>-->
      <a-form-model-item label="多实例" prop="multiInstance">
        <a-switch @change="handleMultiInstance" v-model="formData.multiInstance" />
      </a-form-model-item>
      <a-form-model-item label="串行/并行" prop="isSequential" v-if="formData.multiInstance">
        <a-radio-group @change="handleIsSequential" v-model="formData.isSequential">
          <a-radio :value="false">并行</a-radio>
          <a-radio :value="true">串行</a-radio>
        </a-radio-group>
      </a-form-model-item>
<!--      <a-form-model-item label="异步" prop="async" v-if="!filter('async')">-->
<!--        <a-switch v-model="formData.async" />-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="优先级" prop="priority" v-show="!!showConfig.priority" v-if="!filter('priority')">-->
<!--        <a-input v-model="formData.priority" placeholder="请输入优先级" :style="{width: '100%'}" allow-clear></a-input>-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="跳过条件" prop="skipExpression" v-show="!!showConfig.skipExpression" v-if="!filter('skipExpression')">-->
<!--        <a-auto-complete-->
<!--          v-model="formData.skipExpression"-->
<!--          placeholder="跳过条件表达式"-->
<!--          :data-source="skipExpressionDataSource"-->
<!--          filter-option-->
<!--          allow-clear />-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="是否为补偿" prop="isForCompensation" v-show="!!showConfig.isForCompensation" v-if="!filter('isForCompensation')">-->
<!--        <a-switch v-model="formData.isForCompensation" />-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="服务任务可触发" prop="triggerable" v-show="!!showConfig.triggerable" v-if="!filter('triggerable')">-->
<!--        <a-switch v-model="formData.triggerable" />-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="自动存储变量" prop="autoStoreVariables" v-show="!!showConfig.autoStoreVariables" v-if="!filter('autoStoreVariables')">-->
<!--        <a-switch v-model="formData.autoStoreVariables" />-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="排除" prop="exclude" v-show="!!showConfig.exclude" v-if="!filter('exclude')">-->
<!--        <a-switch v-model="formData.exclude" />-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="输入变量" prop="ruleVariablesInput" v-show="!!showConfig.ruleVariablesInput" v-if="!filter('ruleVariablesInput')">-->
<!--        <a-input v-model="formData.ruleVariablesInput" placeholder="请输入变量" :style="{width: '100%'}" allow-clear>-->
<!--        </a-input>-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="规则" prop="rules" v-show="!!showConfig.rules" v-if="!filter('')">-->
<!--        <a-input v-model="formData.rules" placeholder="请输入规则" :style="{width: '100%'}" allow-clear></a-input>-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="结果变量" prop="resultVariable" v-show="!!showConfig.resultVariable" v-if="!filter('resultVariable')">-->
<!--        <a-input v-model="formData.resultVariable" placeholder="请输入结果变量" :style="{width: '100%'}" allow-clear>-->
<!--        </a-input>-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="类" prop="class" v-show="!!showConfig.class" v-if="!filter('class')">-->
<!--        <a-input v-model="formData.class" placeholder="请输入类" :style="{width: '100%'}" allow-clear></a-input>-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="过期时间" prop="dueDate" v-show="!!showConfig.dueDate" v-if="!filter('dueDate')">-->
<!--        <a-auto-complete-->
<!--          v-model="formData.dueDate"-->
<!--          placeholder="过期时间表达式"-->
<!--          :data-source="dueDateDataSource"-->
<!--          filter-option-->
<!--          allow-clear />-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="观察时间" prop="followUpDate" v-show="!!showConfig.followUpDate" v-if="!filter('followUpDate')">-->
<!--        <a-auto-complete-->
<!--          v-model="formData.followUpDate"-->
<!--          placeholder="观察时间表达式"-->
<!--          :data-source="followUpDateDataSource"-->
<!--          filter-option-->
<!--          allow-clear />-->
<!--      </a-form-model-item>-->
    </a-form-model>

    <a-modal :visible="executionListenerVisible" title="执行监听器" width="800px" :maskClosable="false" :closable="false">
      <template #footer>
        <a-button key="submit" type="primary" @click="handleExecutionListener">关闭</a-button>
      </template>
      <executionListener
        ref="executionListener"
        :element="element"
        :modeler="modeler"
      />
    </a-modal>

    <a-modal :visible="taskListenerVisible" title="任务监听器" width="600px" :maskClosable="false" :closable="false">
      <template #footer>
        <a-button key="submit" type="primary" @click="handleTaskListener">关闭</a-button>
      </template>
      <taskListener
        ref="taskListener"
        :element="element"
        :modeler="modeler"
      />
    </a-modal>
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import taskListener from './property/taskListener'
import { commonParse, userTaskParse } from '../../common/parseElement'
import { message } from 'ant-design-vue'
export default {
  components: {
    taskListener
  },
  mixins: [mixinPanel, mixinExecutionListener],
  props: {
    users: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    },
    assigneeDataSource: {
      type: Array,
      default: () => []
    },
    dueDateDataSource: {
      type: Array,
      default: () => []
    },
    followUpDateDataSource: {
      type: Array,
      default: () => []
    },
    candidateUserDataSource: {
      type: Array,
      default: () => []
    },
    candidateGroupDataSource: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      taskListenerVisible: false,
      dialogName: '',
      taskListenerLength: 0,
      formData: {
        id: undefined,
        name: undefined,
        documentation: undefined,
        executionListener: undefined,
        taskListener: undefined,
        userType: undefined,
        multiInstance: false,
        isSequential: false,
        async: false,
        priority: undefined,
        formKey: undefined,
        skipExpression: undefined,
        isForCompensation: false,
        triggerable: false,
        autoStoreVariables: false,
        exclude: false,
        asyncBefore: false,
        asyncAfter: false,
        exclusive: false,
        scriptFormat: undefined,
        scriptType: undefined,
        resource: undefined,
        script: undefined,
        ruleVariablesInput: undefined,
        rules: undefined,
        resultVariable: undefined,
        dueDate: '${dueDate}',
        followUpDate: '${followUpDate}',
        class: undefined
      },
      rules: {
        id: [{
          required: true,
          message: '请输入节点ID',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入节点名称',
          trigger: 'blur'
        }],
        documentation: []
      },
      scriptTypeOptions: [{
        'label': '外部资源',
        'value': 'outside'
      }, {
        'label': '内联脚本',
        'value': 'inside'
      }]

    }
  },
  computed: {

  },
  watch: {
    'formData.async': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:async': val })
    },
    'formData.dueDate': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:dueDate': val })
    },
    'formData.followUpDate': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:followUpDate': val })
    },
    'formData.formKey': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:formKey': val })
    },
    'formData.priority': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:priority': val })
    },
    'formData.skipExpression': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:skipExpression': val })
    },
    'formData.isForCompensation': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'isForCompensation': val })
    },
    'formData.triggerable': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:triggerable': val })
    },
    'formData.class': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:class': val })
    },
    'formData.autoStoreVariables': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:autoStoreVariables': val })
    },
    'formData.exclude': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:exclude': val })
    },
    'formData.ruleVariablesInput': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:ruleVariablesInput': val })
    },
    'formData.rules': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:rules': val })
    },
    'formData.resultVariable': function (val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:resultVariable': val })
    }
  },
  created () {
    let cache = commonParse(this.element)
    cache = userTaskParse(cache)
    this.formData = cache
    this.computedExecutionListenerLength()
    this.computedHasMultiInstance()
  },
  methods: {
    /**
     * 是否是多实例
     */
    computedHasMultiInstance () {
      const multiInstance = this.element.businessObject.loopCharacteristics
      this.$set(this.formData, 'multiInstance', !!multiInstance)
      this.$set(this.formData, 'isSequential', multiInstance?.isSequential)
    },
    /**
     * 处理多实例
     */
    handleMultiInstance (event) {
      // 开启多实例
      if (event) {
        const loopCharacteristics = this.element.businessObject.get('loopCharacteristics') ||
          this.modeler.get('moddle').create('bpmn:MultiInstanceLoopCharacteristics')
        if (this.formData.isSequential) {
          loopCharacteristics['isSequential'] = this.formData.isSequential
        } else {
          loopCharacteristics['isSequential'] = false
          this.formData.isSequential = false
        }
        // 占位, 不实际使用
        loopCharacteristics['collection'] = 'list'
        loopCharacteristics['elementVariable'] = 'item'
        this.updateProperties({ loopCharacteristics: loopCharacteristics })
      } else {
        this.updateProperties({ loopCharacteristics: null })
      }
    },
    /**
     * 串签/会签 处理
     */
    handleIsSequential (e) {
      const loopCharacteristics = this.element.businessObject.get('loopCharacteristics')
      loopCharacteristics['isSequential'] = e.target.value
      this.updateProperties({ loopCharacteristics: loopCharacteristics })
    },
    /**
     * 处理任务监听器
     */
    handleTaskListener () {
      const flag = this.$refs.taskListener.closeDialog()
      if (flag) {
        this.taskListenerVisible = false
      } else {
        message.error('请补充信息')
      }
    },
    /**
     * 计算的任务侦听器长度
     */
    computedTaskListenerLength () {
      return this.element.businessObject.extensionElements?.values
        ?.filter(item => item.$type === 'flowable:TaskListener').length ?? 0
    }
  }
}
</script>

<style></style>
