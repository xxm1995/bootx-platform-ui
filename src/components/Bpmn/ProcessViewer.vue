<template>
  <div class="flow-containers" style="height: 100%">
    <a-layout style="align-items: stretch;">
      <a-layout-content style="padding: 0;margin-top: 10px;">
        <div ref="canvas" class="canvas" />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import customTranslate from './common/customTranslate'
import Modeler from 'bpmn-js/lib/Modeler'
import BpmData from './BpmData'
// 引入flowable的节点文件
import flowableModdle from './flowable/flowable.json'

import { codemirror } from 'vue-codemirror-lite'
import 'codemirror/lib/codemirror.css'
// 引入主题,配置后生效
import 'codemirror/theme/rubyblue.css'
// 引入语言,配置后生效
import 'codemirror/mode/xml/xml.js'
export default {
  name: 'ProcessViewer',
  components: {
    codemirror
  },
  props: {
    xml: {
      type: String,
      default: ''
    }
  },
  watch: {
    xml: function (val) {
      if (val) {
        this.createNewDiagram(val)
      }
    }
  },
  data () {
    return {
      // 模型对象
      modeler: null,
      taskList: [],
      zoom: 1,
      // 需编辑和显示的内容
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
  methods: {
    /**
     * 创建新图表
     */
    async createNewDiagram (data) {
      // 将字符串转换成图显示出来
      // data = data.replace(/<!\[CDATA\[(.+?)]]>/g, '&lt;![CDATA[$1]]&gt;')
      data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function (match, str) {
        return str.replace(/</g, '&lt;')
      })
      try {
        await this.modeler.importXML(data)
        this.fitViewport()
        // this.fillColor()
      } catch (err) {
        console.error(err.message, err.warnings)
      }
    },
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

  },
  mounted () {
    this.modeler = new Modeler({
      container: this.$refs.canvas,
      additionalModules: [
        {
          translate: ['value', customTranslate],
          paletteProvider: ['value', ''], // 禁用/清空左侧工具栏
          labelEditingProvider: ['value', ''], // 禁用节点编辑
          contextPadProvider: ['value', ''], // 禁用图形菜单
          bendpoints: ['value', {}], // 禁用连线拖动
          move: ['value', '']// 禁用单个图形拖动
        }
      ],
      moddleExtensions: {
        flowable: flowableModdle
      }
    })
  }
}
</script>

<style lang="less" scoped>
// Font class
@import "./icon/iconfont.css";
/*左边工具栏以及编辑节点的样式*/
@import "~bpmn-js/dist/assets/diagram-js.css";

.flow-containers{
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
  }
  .djs-container svg {
    min-height: 650px;
  }
}

</style>
