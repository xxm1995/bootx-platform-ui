<template>
  <a-card>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="RabbitMQ" force-render>
        <a-textarea v-model="rabbitMQMsg"></a-textarea>
        <a-button @click="pushRabbitMQ">发送</a-button>
      </a-tab-pane>
      <a-tab-pane key="2" tab="MQTT" force-render>
        <a-textarea v-model="mqttMsg"></a-textarea>
        <a-button @click="pushMqtt">发送</a-button>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Redis消息" force-render>
        <a-textarea v-model="redisMQMsg"></a-textarea>
        <a-button @click="pushRedisMQ">发送</a-button>
      </a-tab-pane>
      <a-tab-pane key="4" tab="Redis过期事件" force-render>
        <a-textarea v-model="redisKeyMsg"></a-textarea>
        <a-button @click="pushRedisKey">发送</a-button>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import { sendKeyExpired, sendMqttMsg, sendRabbitMsg, sendRedisMsg } from '@/api/demo/mqDemo'

export default {
  name: 'MqDemo',
  data () {
    return {
      rabbitMQMsg: '',
      mqttMsg: '',
      redisMQMsg: '',
      redisKeyMsg: ''
    }
  },
  methods: {
    // RabbitMQ
    pushRabbitMQ () {
      sendRabbitMsg(this.rabbitMQMsg).then(() => this.$message.info('请查看后端控制台日志输出'))
    },
    // RabbitMQ
    pushMqtt () {
      sendMqttMsg(this.mqttMsg).then(() => this.$message.info('请查看后端控制台日志输出'))
    },
    // 发送redis消息
    pushRedisMQ () {
      console.log(this.redisMQMsg)
      sendRedisMsg(this.redisMQMsg).then(() => this.$message.info('请查看后端控制台日志输出'))
    },
    // 发送redisKey消息
    pushRedisKey () {
      sendKeyExpired(this.redisKeyMsg).then(() => this.$message.info('请查看后端控制台等待日志输出'))
    }
  }

}
</script>

<style scoped>

</style>
