<template>
  <span>
    <a-tooltip v-if="queryState">
      <template slot="title">
        <span>查询条件生效</span>
        <a-divider type="vertical"/>
        <a href="javascript:" @click="supperQueryRest">清空</a>
      </template>
      <a-button style="margin-left: 8px" @click="supperQueryShow">
        <a-icon type="appstore" theme="twoTone" spin/>
        <span>查询中...</span>
      </a-button>
    </a-tooltip>
    <a-button v-else style="margin-left: 8px" @click="supperQueryShow">{{ buttonTitle }}</a-button>
    <super-query-modal
      ref="superQueryModal"
      :fields="fields"
      :width="width"
      :modelTitle="modelTitle"
      @ok="handleOk"
    />
  </span>
</template>

<script>
import SuperQueryModal from './SuperQueryModel'
export default {
  name: 'BSupperQuery',
  components: {
    SuperQueryModal
  },
  props: {
    // 是否在进行查询
    queryState: {
      type: Boolean,
      default: false
    },
    // 查询字段属性
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 按钮标题
    buttonTitle: {
      type: String,
      default: '超级查询'
    },
    // 弹框标题
    modelTitle: {
      type: String,
      default: '超级查询器'
    },
    // 宽度
    width: {
      type: Number,
      default: 860
    }
  },
  methods: {
    // 显示
    supperQueryShow () {
      this.$refs.superQueryModal.show()
    },
    // 重置
    supperQueryRest () {
      this.$refs.superQueryModal.handleReset()
      this.$emit('rest')
    },
    // 查询
    handleOk (queryParams) {
      if (queryParams.length > 0) {
        this.$emit('query', queryParams)
      } else {
        this.$message.warning('不能查询空条件')
      }
    }
  }
}
</script>

<style scoped>

</style>
