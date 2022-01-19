<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="userInfo.avatar||'/avatar2.jpg'" alt="">
            </div>
            <div class="username">{{ userInfo.name }}</div>
          </div>
          <div class="account-center-detail">
            <p>
              <i class="title"></i>bootx 开源
            </p>
            <p>
              <i class="group"></i>某公司-某部门-某小
            </p>
            <p>
              <i class="address"></i>
              <span>山东省</span>
              <span>济南市</span>
            </p>
          </div>
          <a-divider/>

          <div class="account-center-tags">
            <div class="tagsTitle">标签</div>
            <div>
              <template v-for="(tag) in tags">
                <a-tag
                  :key="tag"
                >{{ tag }}</a-tag>
              </template>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="17">
        <a-card
          style="width:100%"
          :bordered="false"
          :tabList="tabListNoTitle"
          :activeTabKey="noTitleKey"
          @tabChange="key => handleTabChange(key, 'noTitleKey')"
        >
          <basic-info :userinfo="userInfo" v-if="noTitleKey=== 'BasicInfo'"></basic-info>
          <security v-else-if="noTitleKey === 'Bind'"></security>

        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>

import { mapActions } from 'vuex'
import Security from './page/Security'
import BasicInfo from './page/BasicInfo'
import { getFileUrl } from '@/api/common/fileUpload'

export default {
  name: 'AccountCenter',
  components: {
    Security,
    BasicInfo
  },
  data () {
    return {
      tags: ['Bootx', 'Spring Boot', 'Cloud Native'],
      tabListNoTitle: [
        {
          key: 'BasicInfo',
          tab: '基本信息'
        },
        {
          key: 'Bind',
          tab: '账号绑定'
        }
      ],
      noTitleKey: 'BasicInfo',
      avatarUrl: '',
      userInfo: {}
    }
  },
  methods: {
    ...mapActions(['GetUserInfo']),

    getUserInfo () {
      const {
        GetUserInfo
      } = this
      GetUserInfo().then(res => {
        this.userInfo = res
        getFileUrl(this.userInfo.avatar).then((res) => {
          this.avatarUrl = res.data
        })
      })
    },
    handleTabChange (key, type) {
      this[type] = key
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
      background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);
    }

    .title {
      background-position: 0 0;
    }
    .group {
      background-position: 0 -22px;
    }
    .address {
      background-position: 0 -44px;
    }
  }

  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .account-center-team {
    .members {
      a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;
        .member {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          line-height: 24px;
          max-width: 100px;
          vertical-align: top;
          margin-left: 12px;
          transition: all 0.3s;
          display: inline-block;
        }
        &:hover {
          span {
            color: #1890ff;
          }
        }
      }
    }
  }

  .tagsTitle,
  .teamTitle {
    font-size: 120%;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 22px;
  }
}
</style>
