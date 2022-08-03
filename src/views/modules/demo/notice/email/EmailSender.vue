<template>
  <a-card :bordered="false">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="简单邮件" force-render>
        <simple-email-sender/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="标准邮件" force-render>
        <standard-email-sender/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import SimpleEmailSender from './SimpleEmailSender'
import StandardEmailSender from './StandardEmailSender'
export default {
  name: 'EmilSender',
  components: { SimpleEmailSender, StandardEmailSender },
  data () {
    return {
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
