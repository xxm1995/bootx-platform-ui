export const DownMixin = {

  methods: {

    /**
     * 获取http头部的文件名信息，若无需重命名文件，将下面这行删去
     * @param response axios 返回响应对象
     * @param fileName 文件名称
     * @param type 文件类型 如 application/zip
     */
    downFileByData (response, fileName, type) {
      if (response.type === 'application/octet-stream') {
        /* 兼容ie内核，360浏览器的兼容模式 */
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          const blob = new Blob([response], { type })
          window.navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
          /* 火狐谷歌的文件下载方式 */
          const blob = new Blob([response], { type })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a') // 创建a标签
          link.href = url
          if (fileName) {
            link.download = fileName // 文件重命名，若无需重命名，将该行删去
          }
          link.click()
          URL.revokeObjectURL(url) // 释放内存
        }
      }
    }
  }
}
