<template>
  <div>
    <a-page-header
      style="padding-left: 0;padding-top: 0;"
      title="安全设置"
    />
    <a-spin :spinning="loading">
      <a-row :span="24">
        <a-col :span="14">
          <a-list>
            <a-list-item>
              <a-list-item-meta title="账户密码">
                <template v-slot:description>
                  <span class="security-list-description">账号登录密码</span>
                </template>
              </a-list-item-meta>
              <template v-slot:actions>
                <a @click="passwordEdit">修改</a>
              </template>
            </a-list-item>
            <a-list-item>
              <a-list-item-meta title="密保手机">
                <template v-slot:description>
                  <span class="security-list-description">已绑定手机</span>
                  <span> : </span>
                  <span class="security-list-value">{{ user.phone }}</span>
                </template>
              </a-list-item-meta>
              <template v-slot:actions>
                <a @click="phoneEdit">修改</a>
              </template>
            </a-list-item>
            <a-list-item>
              <a-list-item-meta title="账号邮箱">
                <template v-slot:description>
                  <span class="security-list-description">已绑定邮箱</span>
                  <span> : </span>
                  <span class="security-list-value">{{ user.email }}</span>
                </template>
              </a-list-item-meta>
              <template v-slot:actions>
                <a @click="emailEdit">修改</a>
              </template>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </a-spin>
    <password-edit ref="passwordEdit" @ok="init"/>
  </div>
</template>

<script>
import { getUserSecurityInfo } from '@/api/system/user'
import PasswordEdit from '../password/PasswordEdit'

export default {
  name: 'Security',
  components: {
    PasswordEdit
  },
  data () {
    return {
      loading: false,
      user: {
        phone: '',
        email: ''
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      getUserSecurityInfo().then(res => {
        this.user = res.data
        this.loading = false
      })
    },
    // 显示密码修改
    passwordEdit () {
      this.$refs.passwordEdit.init('', 'edit')
    },
    // 修改绑定邮箱
    emailEdit () {
      this.$message.info('暂不支持')
    },
    // 修改绑定手机号
    phoneEdit () {
      this.$message.info('暂不支持')
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

</style>
