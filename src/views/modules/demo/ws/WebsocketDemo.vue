<template>

</template>

<script>
import SockJS from 'sockjs-client'

export default {
  name: 'WebsocketDemo',
  data () {
    return {
      sock: null
    }
  },
  methods: {
    connection () {
      // 建立连接对象
      const sock = new SockJS('http://127.0.0.1:8080/test/ws')
      this.sock = sock
      sock.onopen = () => {
        console.log('open')
        sock.send('test')
      }

      sock.onmessage = e => {
        console.log('message', e.data)
        sock.close()
      }

      sock.onclose = () => {
        console.log('close')
      }
    }
  },
  mounted () {
    this.connection()
  },
  beforeDestroy () {
    this.sock
  }
}
</script>

<style scoped>

</style>
