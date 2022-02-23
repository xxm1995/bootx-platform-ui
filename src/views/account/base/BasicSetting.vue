<template>
  <div class="account-settings-info-view">
    <a-spin :spinning="confirmLoading">
      <a-page-header
        title="基础设置"
        style="padding-left: 0;padding-top: 0;"
      />
      <a-row :order="isMobile ? 2 : 1" :gutter="16" type="flex" justify="start">
        <a-col :md="12" :lg="12" >
          <a-form-model
            ref="form"
            :model="user"
            :rules="rules"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-form-model-item
              label="名称"
              prop="name"
            >
              <a-input v-model="user.name"/>
            </a-form-model-item>
            <a-form-model-item
              label="性别"
              prop="sex"
            >
              <a-select
                style="width: 100px"
                v-model="user.sex"
              >
                <a-select-option v-for="sex in sexList" :key="sex.code">{{ sex.name }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              label="生日"
              prop="birthday"
            >
              <a-date-picker
                placeholder="请选择日期"
                valueFormat="yyyy-MM-DD"
                v-model="user.birthday"/>
            </a-form-model-item>
            <a-form-model-item>
              <a-button type="primary" @click="handleOk">更新基本信息</a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
        <a-col :order="1" :md="12" :lg="12" :style="{ minHeight: '180px' }">
          <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
            <a-icon type="cloud-upload-o" class="upload-icon"/>
            <div class="mask">
              <a-icon type="plus" />
            </div>
            <img :src="avatarUrl||'/avatar2.jpg'"/>
          </div>
        </a-col>
      </a-row>
      <avatar-modal ref="modal" @ok="setAvatar"/>
    </a-spin>
  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { baseMixin } from '@/store/app-mixin'
import { FormMixin } from '@/mixins/FormMixin'
import { getUserBaseInfo, updateBaseInfo } from '@/api/system/user'
import { getFilePreviewUrlPrefix, getFilePreviewUrl } from '@/api/common/fileUpload'

export default {
  name: 'BasicSetting',
  mixins: [baseMixin, FormMixin],
  components: {
    AvatarModal
  },
  data () {
    return {
      labelCol: {
        sm: { span: 3 }
      },
      wrapperCol: {
        sm: { span: 12 }
      },
      sexList: [],
      avatarUrl: '',
      user: {
        name: '',
        sex: 0,
        birthday: null,
        avatar: ''
      },
      rules: {
        name: [{ required: true, message: '用户名称不可为空' }]
      }
    }
  },
  methods: {
    async init () {
      this.confirmLoading = true
      // 获取用户信息
      await getUserBaseInfo().then(res => {
        this.user = res.data
        getFilePreviewUrlPrefix().then((res) => {
          this.avatarUrl = res.data + this.user.avatar
        })
      })
      // 初始化性别列表
      setTimeout(() => {
        this.getDictItemsByNumberAsync('Sex').then(res => {
          this.sexList = res
        })
        this.confirmLoading = false
      }, 200)
    },
    // 保存
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          updateBaseInfo(this.user).then(_ => this.confirmLoading = false)
        }
      })
    },
    // 头像回调
    setAvatar (id) {
      this.user.avatar = id
      getFilePreviewUrl(id).then((res) => {
        this.avatarUrl = res.data
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>

.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0,0,0,0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img, .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
