import Vue from 'vue'

// base library
import {
  ConfigProvider,
  Layout,
  Input,
  InputNumber,
  Button,
  Empty,
  Switch,
  AutoComplete,
  Radio,
  Rate,
  Checkbox,
  Select,
  Tree,
  TreeSelect,
  Card,
  Form,
  FormModel,
  Row,
  Col,
  Collapse,
  Slider,
  Modal,
  Table,
  Tabs,
  Icon,
  Badge,
  Popover,
  Dropdown,
  List,
  Avatar,
  Breadcrumb,
  Steps,
  Spin,
  Menu,
  Drawer,
  Tooltip,
  Alert,
  Tag,
  Divider,
  DatePicker,
  TimePicker,
  Timeline,
  Upload,
  Progress,
  Skeleton,
  Popconfirm,
  PageHeader,
  Result,
  Statistic,
  Descriptions,
  Space,
  message,
  notification
} from 'ant-design-vue'

// ext library
import VueCropper from 'vue-cropper'
import Dialog from '@/components/Dialog'
import PageLoading from '@/components/PageLoading'
import PermissionHelper from '@/core/permission/permission'
import './directives/action'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VueBus from 'vue-bus'
import KFormDesign from '@/components/KFormDesign/packages'
import '@/components/KFormDesign/styles/form-design.less'
import vcolorpicker from 'vcolorpicker'

Vue.use(ConfigProvider)
Vue.use(Layout)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Button)
Vue.use(Empty)
Vue.use(Switch)
Vue.use(AutoComplete)
Vue.use(Radio)
Vue.use(Rate)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Tree)
Vue.use(TreeSelect)
Vue.use(Card)
Vue.use(FormModel)
Vue.use(Form)
Vue.use(Row)
Vue.use(Col)
Vue.use(Collapse)
Vue.use(Slider)
Vue.use(Modal)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Badge)
Vue.use(Popover)
Vue.use(Dropdown)
Vue.use(List)
Vue.use(Avatar)
Vue.use(Breadcrumb)
Vue.use(Steps)
Vue.use(Spin)
Vue.use(Menu)
Vue.use(Drawer)
Vue.use(Tooltip)
Vue.use(Alert)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Timeline)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Skeleton)
Vue.use(Popconfirm)
Vue.use(PageHeader)
Vue.use(Result)
Vue.use(Statistic)
Vue.use(Descriptions)
Vue.use(Space)
// vxe
Vue.use(VXETable)
// 事件总线
Vue.use(VueBus)
// 动态表单
Vue.use(KFormDesign)
Vue.use(vcolorpicker)

// vxe
Vue.prototype.$XSaveFile = VXETable.saveFile
Vue.prototype.$XReadFile = VXETable.readFile
Vue.prototype.$XPrint = VXETable.print

// 通知
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning

Vue.use(Dialog) // this.$dialog func
Vue.use(PageLoading)
Vue.use(PermissionHelper)
Vue.use(VueCropper)

process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] NOTICE: Antd use lazy-load.')
