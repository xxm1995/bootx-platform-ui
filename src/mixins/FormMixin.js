import {
  dictConvert as c,
  getDictItemsAsync,
  getDictItemsByNumber, getDictItemsByNumberAsync
} from '@/components/Bootx/Dict/DictUtils'
import { findByParamKey } from '@/api/system/param'

export const FormMixin = {
  data () {
    return {
      // 表单项标题文字
      labelCol: {
        sm: { span: 7 }
      },
      // 表单项内容
      wrapperCol: {
        sm: { span: 13 }
      },
      // vxe 弹窗窗口的默认位置
      vxePosition: { top: '9%', left: '35%' },
      title: '新增',
      rawForm: {},
      modalWidth: 640,
      confirmLoading: false,
      visible: false,
      editable: false,
      addable: false,
      showable: false,
      type: 'add'
    }
  },
  methods: {
    // 初始化
    init (record, type, ...vars) {
      this.type = type
      this.visible = true
      this.visible = true
      this.addable = false
      this.editable = false
      this.showable = false
      if (type && type === 'add') {
        this.addable = true
        this.title = '新增'
      }
      if (type === 'edit') {
        this.editable = true
        this.title = '修改'
      }
      if (type === 'show') {
        this.showable = true
        this.title = '查看'
      }

      // 初始化表单和去除校验
      this.resetForm()
      this.edit(record, type, ...vars)
    },
    // 编辑
    edit () {},
    // 关闭
    handleCancel () {
      this.visible = false
      this.addable = false
      this.editable = false
      this.showable = false
    },
    // 默认空方法
    resetForm () {
    },
    // 下拉列表搜索
    selectSearch (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 字典翻译
    dictConvert (dictCode, code) {
      return c(dictCode, code)
    },
    // 获取字典列表 异步
    async getDictItemsAsync (dictCode) {
      return getDictItemsAsync(dictCode)
    },
    // 获取字典下拉框数据列表
    async getDictDropDownAsync (dictCode) {
      const list = await getDictItemsAsync(dictCode)
      return list.map(o => {
        return { label: o.name, value: o.code }
      })
    },
    // 获取字典下拉框数据列表
    async getDictDropDownNumberAsync (dictCode) {
      const list = await getDictItemsByNumberAsync(dictCode)
      return list.map(o => {
        return { label: o.name, value: o.code }
      })
    },
    /**
     * 获取字典项列表(code值为数字)
     * 字段 name code 结构
     */
    getDictItemsByNumber (dictCode) {
      return getDictItemsByNumber(dictCode)
    },
    // 获取字典项列表(code值为数字) 异步
    async getDictItemsByNumberAsync (dictCode) {
      return getDictItemsByNumberAsync(dictCode)
    },
    // 判断脱敏参数是否被修改的参数, 未修改返回空值
    diffForm (o1, o2) {
      return o1 === o2 ? null : o1
    }
  }
}
