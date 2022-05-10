<template>

  <iframe
    :id="id"
    :src="url"
    frameborder="0"
    width="100%"
    height="800px"
    scrolling="auto"></iframe>

</template>

<script>
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import storage from 'store'
  export default {
    name: 'IframeView',
    data () {
      return {
        url: '',
        id: ''
      }
    },
    created () {
      this.goUrl()
    },
    updated () {
      this.goUrl()
    },
    watch: {
      $route (to, from) {
        // this.goUrl()
      }
    },
    methods: {
      goUrl () {
        const url = this.$route.meta.url
        this.id = this.$route.path
        if (url !== null && url !== undefined) {
          // -----------------------------------------------------------------------------------------
          // url支持通过 ${token}方式传递当前登录TOKEN
          // eslint-disable-next-line no-template-curly-in-string
          const tokenStr = '${token}'
          if (url.indexOf(tokenStr) !== -1) {
            const token = storage.get(ACCESS_TOKEN)
            this.url = url.replace(tokenStr, token)
          } else {
            this.url = url
          }
        }
      }
    }
  }
</script>

<style>
</style>
