<template>
  <a-result status="500" title="500" sub-title="抱歉，服务器报告错误。">
    <template #extra>
      <a-button type="primary" @click="toHome">
        返回主页
      </a-button>
    </template>
  </a-result>
</template>

<script>
  export default {
    name: 'Exception500',
    methods: {
      toHome () {
        this.$router.push({ path: '/' })
      }
    }
  }
</script>
