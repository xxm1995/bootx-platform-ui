<template>
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="gutter">
        <query-item
          :key="i"
          v-show="i < defaultItemCount || toggleSearchStatus"
          v-for="(field, i) in fields"
          :field="field"
          :md="defaultItemMd"
          @query="query"
          v-model="queryParam"
        />
        <a-col :md="defaultItemMd" :sm="24">
          <a-space>
            <a-button type="primary" :disabled="disabledQuery" @click="query">查询</a-button>
            <a-button @click="reset">重置</a-button>
          </a-space>
          <a v-show="fields.length > defaultItemCount" @click="handleToggleSearch" style="margin-left: 8px">
            {{ toggleSearchStatus ? '收起' : '展开' }}
            <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
          </a>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import QueryItem from '@/components/Bootx/SuperQuery/QueryItem'
export default {
  name: 'BQuery',
  components: { QueryItem },
  model: {
    // 自定义为v-model
    prop: 'queryParam',
    event: 'change'
  },
  props: {
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 查询条件
    queryParam: {
      type: Object,
      required: true
    },
    // 默认展示几个
    defaultItemCount: { type: Number, default: 2 },

    defaultItemMd: { type: Number, default: 6 },
    // 禁用查询
    disabledQuery: { type: Boolean, default: false },
    gutter: { type: Number, default: 10 }
  },
  data () {
    return {
      // 切换搜索条件展开状态
      toggleSearchStatus: false
    }
  },
  methods: {
    /**
     * 查询
     */
    query () {
      this.$emit('query')
    },
    /**
     * 重置
     */
    reset () {
      this.$emit('reset')
    },
    /**
     * 切换搜索条件展开状态
     */
    handleToggleSearch () {
      this.toggleSearchStatus = !this.toggleSearchStatus
    }
  }
}
</script>

<style scoped>

</style>
