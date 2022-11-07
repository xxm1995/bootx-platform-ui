import {
  dictConvert as c,
  getDictItems,
  getDictItemsByNumber
} from '@/components/Bootx/Dict/DictUtils'
import BSuperQuery from '@/components/Bootx/SuperQuery/BSuperQuery'
import BQuery from '@/components/Bootx/SuperQuery/BQuery'
import { findByParamKey } from '@/api/system/param'

export const TableMixin = {
  components: {
    BSuperQuery, BQuery
  },
  data () {
    return {
      // 加载状态
      loading: false,
      // 批量操作标识
      batchOperateFlag: false,
      // 高级查询条件生效状态
      superQueryFlag: false,
      // 分页返回数据
      pagination: {
        size: 10,
        current: 1,
        total: 0
      },
      // 分页参数
      pages: {
        size: 10,
        current: 1
      },
      // 列表数据
      tableData: [],
      // 查询参数
      queryParam: {}
    }
  },
  methods: {
    // 普通查询
    query () {
      // 清除高级查询
      this.superQueryShow = false
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
    // 分页查询返回结果处理
    pageQueryResHandel (res, that) {
      that.tableData = res.data.records
      that.pagination.current = Number(res.data.current)
      that.pagination.total = Number(res.data.total)
      that.loading = false
    },
    // 重置查询
    resetQuery () {
      this.superQueryFlag = false
      this.queryParam = {}
      this.init()
    },
    // ok按钮
    handleOk () {
      this.init()
    },
    // 下拉列表搜索
    selectSearch (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 字典翻译
    dictConvert (dictCode, code) {
      return c(dictCode, String(code))
    }
  }
}
