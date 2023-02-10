<template>
  <a-card :bordered="false">
    <a-form >
      <a-col>
        <a-form-item label="省市二级联动(全部加载)">
          <a-row>
            <cascader
              style="width: 250px"
              change-on-select
              :field-names="fieldNames"
              :options="pc"
              placeholder="请选择省市"
            />
          </a-row>
        </a-form-item>
        <a-form-item label="省市区三级联动(全部加载)">
          <a-row>
            <cascader
              style="width: 300px"
              change-on-select
              :field-names="fieldNames"
              :options="pca"
              placeholder="请选择省市区"
            />
          </a-row>
        </a-form-item>
        <a-form-item label="省市区街道社区五级联动(动态加载)">
          <a-row>
            <cascader
              style="width: 400px"
              change-on-select
              :field-names="fieldNames"
              :options="pcaCascade"
              :load-data="loadNextRegions"
              placeholder="请选择行政区域"
            />
          </a-row>
        </a-form-item>
      </a-col>
    </a-form>
  </a-card>
</template>

<script>
import { Cascader } from 'ant-design-vue'
import { cloneDeep } from 'lodash'
import {
  findAllProvinceAndCity,
  findAllProvinceAndCityAndArea,
  findAllRegionByParentCode
} from '@/api/demo/chinaRegionDemo'
export default {
  name: 'ChinaRegionDemo',
  components: { Cascader },
  data () {
    return {
      fieldNames: {
        label: 'name', value: 'code', children: 'children'
      },
      pc: [],
      pca: [],
      // 级联用,增加 isLeaf 属性
      pcaCascade: []
    }
  },
  methods: {
    /**
     * 初始化基础数据
     */
    initData () {
      findAllProvinceAndCity().then(({ data }) => {
        this.pc = data
      })
      findAllProvinceAndCityAndArea().then(({ data }) => {
        this.pca = cloneDeep(data)
        this.pcaCascade = cloneDeep(data)
        this.initPcaCascade(this.pcaCascade)
      })
    },
    initPcaCascade (pca) {
      for (const pcaElement of pca) {
        if (pcaElement.children) {
          this.initPcaCascade(pcaElement.children)
        }
        pcaElement.isLeaf = false
      }
    },
    /**
     * 加载下级
     */
    loadNextRegions (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      console.log(targetOption)
      targetOption.loading = true
      findAllRegionByParentCode(targetOption.code).then(({ data }) => {
        targetOption.loading = false
        // 如果下一级不是乡村社区, 说明是不是子节点
        if (targetOption.level < 4) {
          for (const item of data) {
            item.isLeaf = false
          }
        }
        targetOption.children = [...data]
      })
    }
  },
  mounted () {
    this.initData()
  }
}
</script>

<style scoped>

</style>
