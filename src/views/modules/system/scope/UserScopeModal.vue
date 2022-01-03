<template>
  <a-drawer
    title="用户范围权限分配"
    :maskClosable="false"
    width="70%"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
  >
  </a-drawer>
</template>

<script>

export default {
  name: 'UserScopeModal',
  data () {
    return {
      dataScopeId: '',
      loading: false,
      visible: false
    }
  },
  methods: {
    init (dataScopeId) {
      this.visible = true
      this.loading = true
      this.dataScopeId = dataScopeId
    },
    // 取消
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
