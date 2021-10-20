<template>
  <div>
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item
        label="姓名"
        prop="name"
      >
        <a-input v-model="form.name"/>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'BasicInfo',
  props: {
    userinfo: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      form: {},
      rules: { }

    }
  },
  methods: {
    edit () {
      Object.assign(this.userinfo, this.form)
      console.log(this.userinfo)
    }
  },
  mounted() {
    console.log(123)
  }
}
</script>

<style scoped>

</style>
