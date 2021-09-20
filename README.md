# Bootx-Platform-UI (
<p>
 <img src='https://gitee.com/bootx/bootx-platform/badge/star.svg?theme=dark' alt='star'/>
 <img src="https://img.shields.io/badge/Boot%20Platform-2.0.0-success.svg" alt="Build Status">
 <img src="https://img.shields.io/badge/Author-Bootx-orange.svg" alt="Build Status">
 <img src="https://img.shields.io/badge/Spring%20Boot-2.5-blue.svg" alt="Downloads">
 <img src="https://img.shields.io/badge/license-Apache%20License%202.0-green.svg"/>
</p>

## 🍈项目介绍

基于Spring Boot框架打造，针对单体式应用进行专门设计，提供整套服务模块，努力为打造全方位企业级开发解决方案，
致力将开源版打造成超越商业版后台管理框架的项目，**分布式版实现地址 [Bootx-Cloud](https://gitee.com/bootx/bootx-platform) ，暂时先以单体为主**

功能：

1. 基础服务：用户管理、权限认证、终端管理、日志审计等
2. 通知服务：邮件通知、站内信、消息模板、短信通知等
3. 电商服务：收单支付、营销管理、商品管理、订单管理等
4. 数据服务：日志分析、数据中心等
5. 监控服务：服务监控、缓存监控、错误预警单体
6. OA办公服务：工单服务、工作流服务
7. 财务管理：待定
8. ERP：企业资源计划、待定

## 前端项目
> 基于Antd Vue Pro 前端脚手架

演示地址: [地址](http://web.platform.bootx.cn/)

```shell
# 安装依赖
yarn install
# 启动
yarn serve
# 打包
yarn build
```
### 组件选择

| 模块       | 所选组件  | 备注                                                         |
| ---------- | --------- | ------------------------------------------------------------ |
| 整体ui框架 | Antd Vue  | [andtv](https://www.antdv.com/)                              |
| 列表组件   | Vxe-table | [Vxe-table](https://gitee.com/xuliangzhan_admin/vxe-table/)  |
| 表单组件   | FormModel | [FormModel ](https://www.antdv.com/components/form-model-cn/) |

### 混入组件

[Vue混入概念介绍](https://cn.vuejs.org/v2/guide/mixins.html)，默认提供两种混入组件: `TableMixin`(列表Mixin)、`FormMixin`(表单Mixin)

> 1. 当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。 比如，数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。
> 2. 同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。
> 3. 两个对象键名冲突时，取组件对象的键值对。



## 业务组件

### 字典翻译组件

引入TableMixin或FormMixin组件后，可以直接调用`dictConvert`进行组件的字典值的转换，`dictConvert (dictCode, code)` `dictCode`：字典值，`code`：字典项值，返回值为名称，组件所在位置为@/components/Bootx/Dict/DictUtils
