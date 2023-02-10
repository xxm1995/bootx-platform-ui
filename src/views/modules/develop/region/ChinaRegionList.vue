<template>
  <a-card :bordered="false">
    <a-tree
      :load-data="loadNextRegions"
      :tree-data="pcaCascade"
      :replace-fields="fieldNames"
    />
  </a-card>
</template>

<script>
import {
  findAllProvinceAndCityAndArea,
  findAllRegionByParentCode
} from '@/api/demo/chinaRegionDemo'
import { cloneDeep } from 'lodash'

export default {
  name: 'ChinaRegionList',
  data () {
    return {
      fieldNames: {
        title: 'name', key: 'code', children: 'children'
      },
      // 级联用,增加 isLeaf 属性
      pcaCascade: [],
      treeData: [
        { title: 'Expand to load', key: '0' },
        { title: 'Expand to load', key: '1' },
        { title: 'Tree Node', key: '2', isLeaf: true }
      ]
    }
  },
  methods: {
    onLoadData (treeNode) {
      console.log(treeNode.dataRef)
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        setTimeout(() => {
          treeNode.dataRef.children = [
            { title: 'Child Node', key: `${treeNode.eventKey}-0` },
            { title: 'Child Node', key: `${treeNode.eventKey}-1` }
          ]
          this.treeData = [...this.treeData]
          resolve()
        }, 1000)
      })
    },
    /**
     * 初始化基础数据
     */
    initData () {
      findAllProvinceAndCityAndArea().then(({ data }) => {
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
    loadNextRegions (treeNode) {
      const node = treeNode.dataRef

      if (node.level < 3) {
        return Promise.resolve()
      }
      node.loading = true
      return findAllRegionByParentCode(node.code).then(({ data }) => {
        node.loading = false
        // 如果本一级不是街道, 说明是不是子节点
        if (node.level === 4) {
          for (const item of data) {
            item.isLeaf = true
          }
        }
        node.children = [...data]
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
