import { dictConvert as c } from '@/components/Bootx/Dict/DictUtils'

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
      this.resetForm()
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
    // 字典翻译
    dictConvert (dictCode, code) {
      return c(dictCode, code)
    }
  }
}
