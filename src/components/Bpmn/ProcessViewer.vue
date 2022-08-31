<template>
  <div class="flow-containers view-mode" style="height: 100%" >
    <a-layout style="height: 100%">
      <a-layout style="align-items: stretch;">
        <a-layout-content style="padding: 0;margin-top: 10px;">
          <div ref="canvas" class="canvas" :style="{minHeight:height+'px'}"/>
        </a-layout-content>
        <a-layout-sider class="sider" style="background: #fff; min-width: 40px; width: 40px;max-width: 40px;border-left: 1px solid #eeeeee;box-shadow: 0 0 8px #cccccc;">
        </a-layout-sider>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
// 汉化
import customTranslate from './common/customTranslate'
import Modeler from 'bpmn-js/lib/Modeler'
// 引入flowable的节点文件
import flowableModdle from './flowable/flowable.json'
import { addArrow } from '@/components/Bpmn/processViewerUtils'
export default {
  name: 'WorkflowBpmnModeler',
  props: {
    xml: {
      type: String,
      default: ''
    },
    taskList: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 650
    }
  },
  data () {
    return {
      modeler: null,
      zoom: 1,
      // 默认配置
      options: {
        tabSize: 2, // 缩进格式
        theme: 'rubyblue', // 指定主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 是否显示行号
        // 指定语言类型,如果需要编辑和显示其他语言,需要import语言js然后修改此配置
        mode: 'xml',
        line: true,
        styleActiveLine: true, // 高亮选中行
        // 是否为只读,如果为"nocursor" 不仅仅为只读 连光标都无法在区域聚焦
        readOnly: true,
        hintOptions: {
          completeSingle: true // 当匹配只有一项的时候是否自动补全
        }
      }
    }
  },
  watch: {
    xml: function (val) {
      if (val) {
        this.createNewDiagram(val)
      }
    }
  },
  mounted () {
    // 生成实例
    this.modeler = new Modeler({
      container: this.$refs.canvas,
      additionalModules: [
        {
          translate: ['value', customTranslate],
          paletteProvider: ['value', ''], // 禁用/清空左侧工具栏
          labelEditingProvider: ['value', ''], // 禁用节点编辑
          contextPadProvider: ['value', ''], // 禁用图形菜单
          bendpoints: ['value', {}], // 禁用连线拖动
          // zoomScroll: ['value', ''], // 禁用滚动
          // moveCanvas: ['value', ''], // 禁用拖动整个流程图
          move: ['value', '']// 禁用单个图形拖动
        }
      ],
      moddleExtensions: {
        flowable: flowableModdle
      }
    })
    this.createNewDiagram(this.xml)
  },
  methods: {
    // 让图能自适应屏幕
    fitViewport () {
      this.zoom = this.modeler.get('canvas').zoom('fit-viewport')
      const bbox = document.querySelector('.flow-containers .viewport').getBBox()
      const currentViewbox = this.modeler.get('canvas').viewbox()
      const elementMid = {
        x: bbox.x + bbox.width / 2 - 65,
        y: bbox.y + bbox.height / 2
      }
      this.modeler.get('canvas').viewbox({
        x: elementMid.x - currentViewbox.width / 2,
        y: elementMid.y - currentViewbox.height / 2,
        width: currentViewbox.width,
        height: currentViewbox.height
      })
      this.zoom = bbox.width / currentViewbox.width * 1.8
    },
    // 创建流程图
    async createNewDiagram (data) {
      // 将字符串转换成图显示出来
      data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
        return str.replace(/</g, '&lt;')
      })
      await this.modeler.importXML(data)
      this.fillColor()
      this.initSvg()
      this.fitViewport()
    },
    // 处理SVG元素
    initSvg () {
      // 添加完成箭头
      addArrow()
    },

    // 染色
    fillColor () {
      const canvas = this.modeler.get('canvas')
      // canvas.addMarker('start1', 'highlight-reject')
      // canvas.addMarker('task1564480905805', 'highlight')
      // canvas.addMarker('flow1564481082309', 'highlight-cancel')
      // canvas.addMarker('task1564480942367', 'highlight-todo')
      this.modeler._definitions.rootElements[0].flowElements.forEach(n => {
        // console.log(n.$type, n.id, n.name)
        // 开始节点
        if (n.$type === 'bpmn:StartEvent') {
          // this.getActivityOutgoing(n).forEach(f => {
          //   const completeTask = this.taskList.find(m => m.key === f.targetRef.id)
          //   if (completeTask) {
          // 开始节点默认完成
          canvas.addMarker(n.id, 'highlight')
          // }
          // })
        } else if (n.$type === 'bpmn:UserTask') { // 用户任务
          const task = this.taskList.find(m => m.key === n.id) || {}
          // 已完成的任务
          if (task.state === 'finish') {
            canvas.addMarker(n.id, 'highlight')
          } else if (task.state === 'run') { // 执行中的任务
            canvas.addMarker(n.id, 'highlight-todo')
          } else { // 未执行的任务
          }
        } else if (n.$type === 'bpmn:SequenceFlow') { // 连接线
          const sourceRef = n.sourceRef
          const sourceRefTask = this.taskList.find(m => m.key === sourceRef.id) || {}
          const targetRef = n.targetRef
          const targetTask = this.taskList.find(m => m.key === targetRef.id) || {}
          // 开始侧是开始节点
          if (sourceRef.$type === 'bpmn:StartEvent') {
            // 目标节点完成
            if (targetTask.state === 'finish') {
              canvas.addMarker(n.id, 'highlight')
            }
            // 执行中节点
            if (targetTask.state === 'run') {
              canvas.addMarker(n.id, 'highlight-todo')
            }
          }
          // 两侧都是任务节点 且 开始端任务完成
          if (sourceRef.$type === 'bpmn:UserTask' && targetRef.$type === 'bpmn:UserTask' &&
            sourceRefTask.state === 'finish') {
            // 目标节点完成
            if (targetTask.state === 'finish') {
              canvas.addMarker(n.id, 'highlight')
            }
            console.log(targetTask.state)
            // 执行中节点
            if (targetTask.state === 'run') {
              canvas.addMarker(n.id, 'highlight-todo')
            }
            // 办理中
          }
        }
        // console.log(n.name, n.id, n.$type)
      })
    },
    x () {
      this.modeler._definitions.rootElements[0].flowElements.forEach(n => {
        if (n.$type === 'bpmn:UserTask') {
          const completeTask = this.taskList.find(m => m.key === n.id) || { completed: true }
          const todoTask = this.taskList.find(m => !m.completed)
          const endTask = this.taskList[this.taskList.length - 1]
          if (completeTask) {
            canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
            n.outgoing?.forEach(nn => {
              const targetTask = this.taskList.find(m => m.key === nn.targetRef.id)
              if (targetTask) {
                canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
              } else if (nn.targetRef.$type === 'bpmn:ExclusiveGateway') {
                // canvas.addMarker(nn.id, 'highlight');
                canvas.addMarker(nn.id, completeTask.completed ? 'highlight' : 'highlight-todo')
                canvas.addMarker(nn.targetRef.id, completeTask.completed ? 'highlight' : 'highlight-todo')
              } else if (nn.targetRef.$type === 'bpmn:EndEvent') {
                if (!todoTask && endTask.key === n.id) {
                  canvas.addMarker(nn.id, 'highlight')
                  canvas.addMarker(nn.targetRef.id, 'highlight')
                }
                if (!completeTask.completed) {
                  canvas.addMarker(nn.id, 'highlight-todo')
                  canvas.addMarker(nn.targetRef.id, 'highlight-todo')
                }
              }
            })
          }
        } else if (n.$type === 'bpmn:ExclusiveGateway') {
          n.outgoing.forEach(nn => {
            const targetTask = this.taskList.find(m => m.key === nn.targetRef.id)
            if (targetTask) {
              canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
            }
          })
        }
        if (n.$type === 'bpmn:StartEvent') {
          console.log(this.getActivityOutgoing(n))
          this.getActivityOutgoing(n).forEach(nn => {
            const completeTask = this.taskList.find(m => m.key === nn.targetRef.id)
            if (completeTask) {
              canvas.addMarker(nn.id, 'highlight')
              canvas.addMarker(n.id, 'highlight')
            }
          })
        }
      })
    },
    // 节点出去的线
    getActivityOutgoing (activity) {
      // 如果有 outgoing，则直接使用它
      if (activity.outgoing && activity.outgoing.length > 0) {
        return activity.outgoing
      }
      // 如果没有，则遍历获得起点为它的【bpmn:SequenceFlow】节点们。原因是：bpmn-js 的 UserTask 拿不到 outgoing
      const flowElements = this.modeler.getDefinitions().rootElements[0].flowElements
      const outgoing = []
      flowElements.forEach(item => {
        if (item.$type !== 'bpmn:SequenceFlow') {
          return
        }
        // 出口的ID是否一致
        if (item.sourceRef.id === activity.id) {
          outgoing.push(item)
        }
      })
      return outgoing
    }
  }
}
</script>

<style lang="less" scoped>
// Font class
@import "./icon/iconfont.css";
/*左边工具栏以及编辑节点的样式*/
@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

@import "./css/ProcessViewerHighlight.less";
.view-mode {
  .ant-layout-header, .ant-layout-sider, /deep/.djs-palette, /deep/.bjs-powered-by {
    display: none;
  }
}

html,body,#app{
  height:100%
}

.iconfont{
  margin-right: 5px;
}

.flow-containers {
  // background-color: #ffffff;
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
  }
  .djs-palette{
    left: 0 !important;
    top: 0;
    border-top: none;
  }

  .djs-container svg {
    min-height: 650px;
  }
}

/deep/ .ant-layout-sider:hover{
  background: #0A97CE25 !important;
}

/deep/ .ant-layout-sider{
  z-index: 2;
}

/deep/ .djs-container {
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+) repeat !important;
}

</style>
