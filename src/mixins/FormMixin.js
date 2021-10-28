import { dictConvert as c, getDictItems, getDictItemsByNumber } from '@/components/Bootx/Dict/DictUtils'

export const FormMixin = {
  data () {
    return {
      labelCol: {
        sm: { span: 7 }
      },
      wrapperCol: {
        sm: { span: 13 }
      },
      title: '新增',
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
      setTimeout(() => {
        this.addable = false
        this.editable = false
        this.showable = false
      }, 200)
    },
    // 默认空方法
    resetForm () {
    },
    // 字典翻译
    dictConvert (dictCode, code) {
      return c(dictCode, code)
    },
    // 获取字典列表
    getDictItems (dictCode) {
      return getDictItems(dictCode)
    },
    // 获取字典项列表(code值为数字)
    getDictItemsByNumber (dictCode) {
      return getDictItemsByNumber(dictCode)
    },
    // 判断脱敏参数是否被修改的参数, 未修改返回空值
    diffForm (o1, o2) {
      return o1 === o2 ? null : o1
    }
  }
}
