<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-card title="基本信息" style="margin-bottom: 20px" :bordered="false">
          <table class="table">
            <tr>
              <td>Redis版本</td>
              <td>{{ info.redis_version }}</td>
              <td>运行模式</td>
              <td>{{ info.redis_mode === "standalone" ? "单机" : "集群" }}</td>
              <td>端口</td>
              <td>{{ info.tcp_port }}</td>
            </tr>
            <tr>
              <td>客户端数</td>
              <td>{{ info.connected_clients }}</td>
              <td>运行时间(天)</td>
              <td>{{ info.uptime_in_days }}</td>
              <td>使用内存</td>
              <td>{{ info.used_memory_human }}</td>
            </tr>
            <tr>
              <td>使用CPU</td>
              <td>{{ parseFloat(info.used_cpu_user_children).toFixed(2) }}</td>
              <td>内存配置</td>
              <td>{{ info.maxmemory_human }}</td>
              <td>AOF是否开启</td>
              <td>{{ info.aof_enabled == "0" ? "否" : "是" }}</td>
            </tr>
            <tr>
              <td>RDB是否成功</td>
              <td>{{ info.rdb_last_bgsave_status }}</td>
              <td>Key数量</td>
              <td>{{ dbSize }} </td>
              <td>网络入口/出口</td>
              <td>{{ info.instantaneous_input_kbps }}kps/{{ info.instantaneous_output_kbps }}kps</td>
            </tr>
          </table>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="命令统计">
          <div ref="commandStatsChart" style="height: 400px;"/>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="内存信息">
          <div ref="memoryUsedChart" style="height: 400px;"/>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getRedisInfo } from '@/api/starter/monitor'
import * as echarts from 'echarts/core'
require('echarts/theme/roma') // echarts theme

export default {
  name: 'RedisInfoMonitor',
  data () {
    return {
      loading: true,
      interval: null,
      // 命令图表
      commandStatsChart: null,
      // 内存使用图表
      memoryUsedChart: null,
      info: {},
      commandStats: {},
      dbSize: 0
    }
  },
  methods: {
    init () {
      this.interval = setInterval(() => {
        this.getRedisInfo()
      }, 1000 * 5)
    },
    /**
     * 获取Redis服务信息
     */
    getRedisInfo () {
      getRedisInfo().then(({ data }) => {
        this.loading = false
        const { info, commandStats, dbSize } = data
        this.info = info
        this.commandStats = commandStats
        this.dbSize = dbSize
        // 图表
        this.drawChart()
      })
    },
    /**
     * 图表
     */
    drawChart () {
      // 命令统计
      const commandStats = this.commandStats.map(row => {
        return {
          name: row.key,
          value: row.value
        }
      })
      this.commandStatsChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '命令',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: commandStats,
            animationEasing: 'cubicInOut',
            animationDuration: 1000
          }
        ]
      })
      // 内存图表
      this.memoryUsedChart.setOption({
        tooltip: {
          formatter: '{b} <br/>{a} : ' + this.info.used_memory_human
        },
        series: [
          {
            name: '峰值',
            type: 'gauge',
            min: 0,
            max: 1000,
            detail: {
              formatter: this.info.used_memory_human
            },
            data: [
              {
                value: parseFloat(this.info.used_memory_human),
                name: '内存消耗'
              }
            ]
          }
        ]
      })
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // 初始化图表
    this.commandStatsChart = echarts.init(this.$refs.commandStatsChart, 'roma')
    this.memoryUsedChart = echarts.init(this.$refs.memoryUsedChart, 'roma')
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
</style>
