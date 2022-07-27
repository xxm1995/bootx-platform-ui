<template>
  <a-card :bordered="false">
<!--    <div class="table-page-search-wrapper">-->
<!--      <a-form-model layout="inline">-->
<!--        <a-row :gutter="24">-->
<!--          <a-col :md="6" :sm="24">-->
<!--            <a-form-model-item label="名称">-->
<!--              <a-input placeholder="请输入名称" v-model="queryParam.name"></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :md="6" :sm="24">-->
<!--            <a-form-model-item label="AppId">-->
<!--              <a-input placeholder="请输入AppId" v-model="queryParam.appId"></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :md="6" :sm="24">-->
<!--            <a-form-model-item label="商户号">-->
<!--              <a-input placeholder="请输入商户号" v-model="queryParam.mchId"></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :md="6" :sm="24">-->
<!--            <a-button type="primary" @click="query">查询</a-button>-->
<!--            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>-->
<!--          </a-col>-->
<!--        </a-row>-->
<!--      </a-form-model>-->
<!--    </div>-->
<!--    <vxe-toolbar-->
<!--      custom-->
<!--      zoom-->
<!--      :refresh="{query: init}"-->
<!--    >-->
<!--      <template #buttons>-->
<!--        <a-button type="primary" icon="plus" @click="add">新建</a-button>-->
<!--      </template>-->
<!--    </vxe-toolbar>-->
<!--    <vxe-table-->
<!--      row-id="id"-->
<!--      :loading="loading"-->
<!--      :data="tableData"-->
<!--    >-->

<!--      <vxe-table-column type="seq" title="序号" width="60" />-->
<!--      <vxe-table-column field="name" title="名称"/>-->
<!--      <vxe-table-column field="mchId" title="商户号"/>-->
<!--      <vxe-table-column field="createTime" title="创建时间" />-->
<!--      <vxe-table-column fixed="right" width="170" :showOverflow="false" title="操作">-->
<!--        <template v-slot="{row}">-->
<!--          <span>-->
<!--            <a href="javascript:" @click="show(row)">查看</a>-->
<!--          </span>-->
<!--          <a-divider type="vertical"/>-->
<!--          <span>-->
<!--            <a href="javascript:" @click="edit(row)">编辑</a>-->
<!--          </span>-->
<!--          <a-divider type="vertical"/>-->
<!--        </template>-->
<!--      </vxe-table-column>-->
<!--    </vxe-table>-->
<!--    <vxe-pager-->
<!--      size="medium"-->
<!--      :loading="loading"-->
<!--      :current-page="pagination.current"-->
<!--      :page-size="pagination.size"-->
<!--      :total="pagination.total"-->
<!--      @page-change="handleTableChange"/>-->
    <dynamic-design
      ref="dynamicDesign"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import DynamicDesign from './DynamicDesign'
export default {
  name: 'KFormList',
  mixins: [TableMixin],
  components: { DynamicDesign },
  data () {
    return {
      queryParam: {
        name: '',
        appId: '',
        mchId: ''
      }
    }
  },
  methods: {
    add () {
      this.$refs.dynamicDesign.init()
    }
  }
}
</script>

<style scoped>

</style>
