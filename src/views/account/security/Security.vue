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
                <template #description>
                  <span>账号登录密码</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a @click="passwordEdit">修改</a>
              </template>
            </a-list-item>
            <a-list-item>
              <a-list-item-meta title="绑定手机号">
                <template #description>
                  <template v-if="user.phone">
                    <span>已绑定手机</span>
                    <span> : </span>
                    <span>{{ user.phone }}</span>
                  </template>
                  <template v-else>
                    <span>未绑定手机</span>
                  </template>
                </template>
              </a-list-item-meta>
              <template #actions>
                <template v-if="user.phone">
                  <a @click="phoneEdit">修改</a>
                </template>
                <template v-else>
                  <a @click="phoneBind" style="color:red;">绑定</a>
                </template>
              </template>
            </a-list-item>
            <a-list-item>
              <a-list-item-meta title="账号邮箱">
                <template #description>
                  <template v-if="user.email">
                    <span>已绑定邮箱</span>
                    <span> : </span>
                    <span>{{ user.email }}</span>
                  </template>
                  <template v-else>
                    <span>未绑定邮箱</span>
                  </template>
                </template>
              </a-list-item-meta>
              <template #actions>
                <template v-if="user.email">
                  <a @click="emailEdit">修改</a>
                </template>
                <template v-else>
                  <a @click="bindEmail" style="color:red;">绑定</a>
                </template>
              </template>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </a-spin>
    <password-edit ref="passwordEdit" @ok="init"/>
    <phone-edit ref="phoneEdit" @ok="init" :phone="user.phone"/>
    <email-edit ref="emailEdit" @ok="init" :email="user.email"/>
  </div>
</template>

<script>
import { getUserSecurityInfo } from '@/api/system/user'
import PasswordEdit from './PasswordEdit'
import PhoneEdit from './PhoneEdit'
import EmailEdit from './EmailEdit'

export default {
  name: 'Security',
  components: {
    PasswordEdit,
    PhoneEdit,
    EmailEdit
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
      this.$refs.emailEdit.init('', 'edit')
    },
    // 修改绑定手机号
    phoneEdit () {
      this.$refs.phoneEdit.init('', 'edit')
    },
    // 绑定手机号
    phoneBind () {
      this.$message.info('稍等, 下个版本实装')
    },
    // 绑定邮箱
    bindEmail () {
      this.$message.info('稍等, 下个版本实装')
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

</style>
