import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export const UploadMixin = {
  computed: {
    // 上传地址
    uploadAction () {
      return process.env.VUE_APP_API_BASE_URL + this.uploadUrl
    },
    // 请求头消息
    tokenHeader () {
      // 从 localstorage 获取 token
      const token = storage.get(ACCESS_TOKEN)
      return {
        AccessToken: token
      }
    }
  },

  methods: {
    /**
     * 上传变动
     */
    uploadChange (info) {
      if (info.file.status === 'done') {
        if (!info.file.response.code) {
          this.uploadSuccess(info)
        } else {
          this.uploadFail(info)
        }
      } else if (info.file.status === 'error') {
        this.$message.error('上传失败')
      }
    },

    /**
     * 上传成功
     */
    uploadSuccess (info) {
      this.$message.success(`${info.file.name} 上传成功!`)
    },

    /**
     * 上传失败
     */
    uploadFail (info) {
      if (info.file?.response?.msg) {
        this.$message.error(`${info.file.response.msg}`)
      } else {
        this.$message.error('上传失败')
      }
    }
  }
}
