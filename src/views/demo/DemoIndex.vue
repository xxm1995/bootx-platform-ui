<template>
  <div class='content'>
    <div class='goods-select'>
      <a-divider orientation="left">
        商品选择区
      </a-divider>
      <div class='goods-select-section'>
        <div class='goods-select-list'>
          <div class='goods-item-section' v-for='(item,index) in list' :key='index'>
            <div class='goods-item'>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <a-divider orientation="left">
        商品支付区
      </a-divider>
    </div>
    <div>
      <a-divider orientation="left">
        购买商品列表查看区
      </a-divider>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemoIndex',
  data(){
    return{
      list:[
        {}
      ]
    }
  }
}
</script>

<style scoped>
.goods-select-section{
  width: 100%;
  height: 100%;
}
.goods-select-section .goods-select-list{
  width: 90%;
  height: 200px;
  margin: 0 auto;
  background-color: #999999;
}
.goods-select-section .goods-select-list .goods-item-section{
  width: 12.5%;
  height: 200px;
}
.goods-select-section .goods-select-list .goods-item-section .goods-item{
  width: 98%;
  height: 100%;
  background-color: #fff;
  border: solid 1px #f7f7f7;
}
>>> .ant-divider-inner-text{
  color: #333333;
  font-size: 20px;
}
</style>