<template>
  <div>
    <!-- 系统信息  Java信息-->
    <a-row :gutter="24">
      <a-col :md="12" :sm="24">
        <a-card :loading="loading" title="系统信息" style="margin-bottom: 20px" :bordered="false">
          <table class="table" >
            <tr >
              <td>系统名称：</td>
              <td>{{ sysOsInfo.osName }}</td>
            </tr>
            <tr >
              <td>系统架构：</td>
              <td>{{ sysOsInfo.osArch }}</td>
            </tr>
            <tr >
              <td>系统版本：</td>
              <td>{{ sysOsInfo.osVersion }}</td>
            </tr>
            <tr >
              <td>主机名称：</td>
              <td>{{ sysOsInfo.osHostName }}</td>
            </tr>
            <tr >
              <td >主机IP地址：</td>
              <td >{{ sysOsInfo.osHostAddress }}</td>
            </tr>
          </table>
        </a-card>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-card :loading="loading" title="Java环境信息" style="margin-bottom: 20px">
          <table class="table" >
            <tr >
              <td>虚拟机名称：</td>
              <td>{{ sysJavaInfo.jvmName }}</td>
            </tr>
            <tr >
              <td>虚拟机版本：</td>
              <td>{{ sysJavaInfo.jvmVersion }}</td>
            </tr>
            <tr >
              <td>虚拟机供应商：</td>
              <td>{{ sysJavaInfo.jvmVendor }}</td>
            </tr>
            <tr >
              <td>java名称：</td>
              <td>{{ sysJavaInfo.javaName }}</td>
            </tr>
            <tr >
              <td >java版本：</td>
              <td >{{ sysJavaInfo.javaVersion }}</td>
            </tr>
          </table>
        </a-card>
      </a-col>
    </a-row>
    <a-card :loading="loading" title="硬件信息" style="margin-bottom: 20px">
      <table class="table" >
        <tr >
          <td>CPU型号信息：</td>
          <td>
            <ellipsis :length="18" tooltip>{{ hardwareInfo.cpuModel }}</ellipsis>
          </td>
          <td>CPU核数：</td>
          <td>{{ hardwareInfo.cpuNum }}</td>
        </tr>
        <tr >
          <td>总内存：</td>
          <td>{{ hardwareInfo.totalMemory }}</td>
          <td>已使用内存：</td>
          <td>{{ hardwareInfo.usedMemory }}</td>
        </tr>
        <tr>
          <td >空余内存：</td>
          <td >{{ hardwareInfo.freeMemory }}</td>
          <td >内存使用率：</td>
          <td >{{ hardwareInfo.usedRateMemory }}</td>
        </tr>
      </table>
    </a-card>
    <a-card :loading="loading" title="JVM内存信息" style="margin-bottom: 20px">
      <table class="table" >
        <tr >
          <td>JVM最大内存：</td>
          <td>{{ sysJvmMemInfo.jvmMaxMemory }}</td>
          <td>JVM可用内存：</td>
          <td>{{ sysJvmMemInfo.jvmUsableMemory }}</td>
        </tr>
        <tr >
          <td>JVM总内存：</td>
          <td>{{ sysJvmMemInfo.jvmTotalMemory }}</td>
          <td>JVM已使用内存：</td>
          <td>{{ sysJvmMemInfo.jvmUsedMemory }}</td>
        </tr>
        <tr>
          <td >JVM空余内存：</td>
          <td >{{ sysJvmMemInfo.jvmFreeMemory }}</td>
          <td >JVM内存使用率：</td>
          <td >{{ sysJvmMemInfo.jvmMemoryUsedRate }}</td>
        </tr>
      </table>
    </a-card>
    <a-card :loading="loading" title="磁盘信息" >
      <a-row :gutter="16">
        <a-col :span="6" v-for="(disk,index) in sysDiskInfos" :key="index">
          <a-card>
            <table class="table" >
              <tr>
                <td>磁盘名称：</td>
                <td>{{ disk.name }}</td>
              </tr>
              <tr>
                <td>磁盘容量：</td>
                <td>{{ disk.totalSpace }}</td>
              </tr>
              <tr>
                <td>已用空间：</td>
                <td>{{ disk.usedSpace }}</td>
              </tr>
              <tr>
                <td>剩余空间：</td>
                <td>{{ disk.freeSpace }}</td>
              </tr>
              <tr>
                <td>使用率：</td>
                <td>{{ disk.usedRate }}</td>
              </tr>
            </table>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { getSystemInfo } from '@/api/starter/monitor'
import Ellipsis from '@/components/Ellipsis'
export default {
  name: 'SystemInfoMonitor',
  components: {
    Ellipsis
  },
  data () {
    return {
      loading: true,
      interval: null,
      sysOsInfo: {},
      sysJavaInfo: {},
      sysJvmMemInfo: {},
      hardwareInfo: {},
      sysDiskInfos: []
    }
  },
  methods: {
    init () {
      this.getSysInfo()
      this.interval = setInterval(() => {
        this.getSysInfo()
      }, 1000 * 5)
    },
    getSysInfo () {
      getSystemInfo().then(({ data }) => {
        this.loading = false
        const { sysOsInfo, sysJavaInfo, sysJvmMemInfo, sysDiskInfos, hardwareInfo } = data
        this.sysOsInfo = sysOsInfo
        this.sysJavaInfo = sysJavaInfo
        this.sysJvmMemInfo = sysJvmMemInfo
        this.sysDiskInfos = sysDiskInfos
        this.hardwareInfo = hardwareInfo
      })
    }
  },
  created () {
    this.init()
  },
  destroyed () {
    clearInterval(this.interval)
    this.interval = null
  }
}
</script>

<style scoped>
.table{
  width: 100%;
  min-height: 30px;
  line-height: 30px;
  text-align: center;
}
td {
  border-bottom:1px solid rgba(232, 232, 232, 0.99);
}
.cpuModel {
  width:150px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;
}
</style>
