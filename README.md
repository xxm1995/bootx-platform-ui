# Bootx Platform 对应前端项目

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
