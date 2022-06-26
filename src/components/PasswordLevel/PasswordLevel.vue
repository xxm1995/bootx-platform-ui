<template>
  <a-popover placement="rightTop" trigger="click" :visible="visible">
    <template #content>
      <div :style="{ width: '240px' }">
        <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
        <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
        <div style="margin-top: 10px;">
          <slot name="content">
            <span>{{ content }}</span>
          </slot>
        </div>
      </div>
    </template>
    <slot></slot>
  </a-popover>
</template>

<script>

const levelNames = {
  0: '非常低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
export default {
  name: 'PasswordLevel',
  data () {
    return {
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        percent: 10,
        progressColor: '#FF0000'
      }

    }
  },
  props: {
    password: {
      type: String,
      required: true
    },
    content: {
      type: String,
      default: '请不要使用容易被猜到的密码。'
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    password: {
      handler () {
        this.handlePasswordLevel()
      }
    }
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    /**
     * 密码强度等级
     */
    handlePasswordLevel () {
      let level = 0
      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(this.password)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(this.password)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(this.password)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 1) {
        if (level >= 3) {
          this.state.percent = 100
        }
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
