/**
 * 该文件是为了按需加载，剔除掉了一些不需要的框架组件。
 * 减少了编译支持库包大小
 *
 * 当需要更多组件依赖时，在该文件加入即可
 */
import Vue from 'vue'
import {
  Input,
  Rate,
  Slider,
  InputNumber,
  Switch,
  Radio,
  Checkbox,
  Select,
  Cascader,
  TreeSelect
} from 'ant-design-vue'

import KBatch from '../KBatch'
import KSelectInputList from '../KSelectInputList'
import KEditor from '../KEditor'
import UploadFile from '../UploadFile'
import UploadImg from '../UploadImg'
import KDatePicker from '../KDatePicker'
import KTimePicker from '../KTimePicker'

export default {
  input: Input,
  number: InputNumber,
  select: Select,
  checkbox: Checkbox,
  radio: Radio,
  date: KDatePicker,
  time: KTimePicker,
  rate: Rate,
  slider: Slider,
  switch: Switch,
  uploadFile: UploadFile,
  uploadImg: UploadImg,
  treeSelect: TreeSelect,
  cascader: Cascader,
  batch: KBatch,
  selectInputList: KSelectInputList,
  editor: KEditor
}
