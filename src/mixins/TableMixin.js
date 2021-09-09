import { dictConvert as c } from '@/components/Bootx/Dict/DictUtils'

export const TableMixin = {
  data () {
    return {
      loading: false,
      pagination: {
        size: 10,
        current: 1,
        total: 0
      },
      pages: {
        size: 10,
        current: 1
      },
      tableData: []
    }
  },
  methods: {
    // 查询
    query () {
      this.resetPage()
      this.init()
    },
    // 重置当前页数
    resetPage () {
      this.pages = {
        size: this.pagination.size,
        current: 1
      }
    },
    // 表格翻页
    handleTableChange ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.pagination.size = pageSize
      this.init()
    },

    // ok按钮
    handleOk () {
      this.init()
    },
    // 字典翻译
    dictConvert (dictCode, code) {
      console.log(c(dictCode, code))
      return c(dictCode, code)
    }
  }
}
