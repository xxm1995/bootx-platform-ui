<template>
  <a-card :bordered="false">
    <a-space>
      <a-button @click="req" type="primary">
        发送请求
      </a-button>
      <a-button @click="genToken" type="danger">
        重置幂等状态
      </a-button>
    </a-space>
  </a-card>

</template>

<script>
import { idempotentDemo } from '@/api/demo/idempotentDemo'

export default {
  name: 'Idempotent',
  data () {
    return {
      idempotentToken: ''
    }
  },
  methods: {
    // 生成幂等token
    genToken () {
      this.idempotentToken = new Date().getTime()
    },
    // 发起请求时携带幂等token
    req () {
      idempotentDemo(this.idempotentToken).then(res => {
        this.$message.info(res.data)
      })
    }
  },
  created () {
    this.genToken()
  }
}
</script>

<style scoped>

</style>
