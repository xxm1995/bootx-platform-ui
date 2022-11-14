<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="主键" prop="id" hidden="true" >
          <a-input v-model="form.id" disabled/>
        </a-form-model-item>
        <a-form-model-item
          label="任务节点id"
          prop="nodeId"
        >
          <a-input v-model="form.nodeId" disabled/>
        </a-form-model-item>
        <a-form-model-item
          label="任务节点名称"
          prop="nodeName"
        >
          <a-input v-model="form.nodeName" disabled/>
        </a-form-model-item>
        <a-form-model-item
          label="跳过节点"
          prop="skip"
        >
          <a-switch checked-children="是" un-checked-children="否" v-model="form.skip" :disabled="showable" />
        </a-form-model-item>
        <a-form-model-item
          label="多实例"
          prop="multi"
          v-if="showable"
        >
          <a-switch checked-children="是" un-checked-children="否" v-model="form.multi" disabled />
        </a-form-model-item>
        <a-form-model-item
          label="是否串行"
          prop="sequential"
          v-if="form.multi && showable"
        >
          <a-switch checked-children="串行" un-checked-children="并行" v-model="form.sequential" disabled />
        </a-form-model-item>
        <a-form-model-item
          label="是否或签"
          prop="orSign"
          v-if="form.multi"
        >
          <a-switch checked-children="是" un-checked-children="否" v-model="form.orSign" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="按比例通过"
          prop="ratioPass"
          v-if="form.multi && !form.sequential"
        >
          <a-switch checked-children="是" un-checked-children="否" v-model="form.ratioPass" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="通过比例"
          prop="passRatio"
          v-if="form.ratioPass"
        >
          <a-input-number
            style="width: 100%"
            :min="1"
            :max="100"
            :precision="0"
            :disabled="showable"
            v-model="form.passRatio"
            placeholder="请输入通过比例" />
        </a-form-model-item>
        <a-form-model-item
          label="分配类型"
          prop="assignType"
        >
          <a-select
            allowClear
            v-model="form.assignType"
            :disabled="showable"
            :filter-option="selectSearch"
            :options="assignTypeList"
            style="width: 100%"
            placeholder="选择处理人分配类型"
            @change="assignTypeChange"
          />
        </a-form-model-item>
        <a-form-model-item
          label="分配用户"
          prop="assignShow"
          v-if="[USER_GROUP, USER].includes(form.assignType)"
        >
          <a-input v-model="form.assignShow" placeholder="请选择用户" disabled>
            <template #addonAfter>
              <a href="javascript:" :disabled="showable" @click="selectUserShow" >选择用户</a>
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item
          label="分配角色"
          prop="assignShow"
          v-if="[ROLE].includes(form.assignType)"
        >
          <template #label>
            <apan>
              分配角色
              <a-tooltip v-if="!form.multi">
                <template #title>如果角色关联多个用户只会从中随机抽选一个</template>
                <a-icon type="question-circle" />
              </a-tooltip>
            </apan>
          </template>
          <a-input v-model="form.assignShow" placeholder="请选择角色" disabled>
            <template #addonAfter>
              <a href="javascript:" :disabled="showable" @click="selectRoleShow" >选择角色</a>
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item
          prop="assignShow"
          v-if="[DEPT_LEADER, DEPT_MEMBER].includes(form.assignType)"
        >
          <template #label>
            <apan>
              分配部门
              <a-tooltip v-if="!form.multi">
                <template #title>如果部门关联多个用户只会从中随机抽选一个</template>
                <a-icon type="question-circle" />
              </a-tooltip>
            </apan>
          </template>
          <a-input v-model="form.assignShow" placeholder="选择部门(暂不可用)" disabled>
            <template #addonAfter>
              <a href="javascript:" :disabled="showable" @click="selectDeptShow" >选择部门</a>
            </template>
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
    <!--  用户分配 -->
    <b-user-select-modal ref="userSelectModal" @ok="selectUser" :multiple="form.multi"/>
    <!--  角色分配 -->
    <b-role-select-modal ref="roleSelectModal" @ok="selectRole" :multiple="form.multi"/>

  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, add, update } from '@/api/bpm/modelNode'
import BUserSelectModal from '@/components/Bootx/UserSelectModal/BUserSelectModal'
import BRoleSelectModal from '@/components/Bootx/RoleSelectModal/BRoleSelectModal'
import {
  DEPT_LEADER,
  DEPT_LEADER_OPTION,
  SELECT,
  SELECT_OPTION,
  DEPT_MEMBER,
  DEPT_MEMBER_OPTION,
  ROLE,
  ROLE_OPTION,
  USER,
  USER_OPTION,
  USER_GROUP,
  USER_GROUP_OPTION, SPONSOR, SPONSOR_OPTION
} from './BpmModelNodeCode'
export default {
  name: 'BpmModelNodeEdit',
  components: { BUserSelectModal, BRoleSelectModal },
  mixins: [FormMixin],
  data () {
    return {
      SPONSOR,
      SPONSOR_OPTION,
      SELECT,
      SELECT_OPTION,
      DEPT_LEADER,
      DEPT_LEADER_OPTION,
      DEPT_MEMBER,
      DEPT_MEMBER_OPTION,
      ROLE,
      ROLE_OPTION,
      USER,
      USER_OPTION,
      USER_GROUP,
      USER_GROUP_OPTION,
      form: {
        id: null,
        nodeId: '',
        nodeName: '',
        skip: false,
        multi: false,
        sequential: false,
        orSign: undefined,
        ratioPass: undefined,
        passRatio: undefined,
        assignType: undefined,
        assignRaw: '',
        assignShow: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        nodeId: [{ required: true, message: '请输入任务节点ID!' }],
        nodeName: [{ required: true, message: '请输入任务节点名称!' }],
        assignType: [{ required: true, message: '请选择处理人分配类型!' }],
        assignShow: [{ required: true, message: '请选择处理人!' }],
        skip: [{ required: true, message: '' }],
        orSign: [{ required: this.form.multi, message: '' }],
        ratioPass: [{ required: this.form.multi, message: '' }],
        passRatio: [{ required: this.form.ratioPass, message: '请输入通过比例' }]
      }
    },
    /**
     * 分配类型列表
     */
    assignTypeList () {
      if (this.form.multi) {
        return [SPONSOR_OPTION, SELECT_OPTION, USER_GROUP_OPTION, ROLE_OPTION, DEPT_LEADER_OPTION, DEPT_MEMBER_OPTION]
      } else {
        return [SPONSOR_OPTION, SELECT_OPTION, USER_OPTION, ROLE_OPTION, DEPT_LEADER_OPTION]
      }
    }
  },
  methods: {
    /**
     * 编辑
     */
    edit (id, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          if (!this.form.assignType) {
            this.form.assignType = undefined
          }
          this.confirmLoading = false
        })
      } else {
        this.form = {}
        this.confirmLoading = false
      }
    },
    /**
     * 提交
     */
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.type === 'add') {
            await add(this.form)
          } else if (this.type === 'edit') {
            await update(this.form)
          }
          this.confirmLoading = false
          this.$emit('ok')
          this.visible = false
        } else {
          return false
        }
      })
    },
    /**
     * 重置表单
     */
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    /**
     * 开启选择用户界面
     */
    selectUserShow () {
      this.$refs.userSelectModal.init()
    },
    /**
     * 选中用户回调
     */
    selectUser (userId, userInfo) {
      this.$set(this.form, 'assignRaw', userId)
      if (this.form.multi) {
        const userNames = userInfo.map(o => o.name).join(',')
        this.$set(this.form, 'assignShow', userNames)
      } else {
        this.$set(this.form, 'assignShow', userInfo?.name)
      }
      this.$refs.form.validateField('assignShow')
    },
    /**
     * 选择角色
     */
    selectRoleShow () {
      this.$refs.roleSelectModal.init(this.form.userId)
    },

    /**
     * 选中角色回调
     */
    selectRole (roleId, roleInfo) {
      this.$set(this.form, 'assignRaw', roleId)
      if (this.form.multi) {
        const userNames = roleInfo.map(o => o.name).join(',')
        this.$set(this.form, 'assignShow', userNames)
      } else {
        this.$set(this.form, 'assignShow', roleInfo?.name)
      }
      this.$refs.form.validateField('assignShow')
    },
    /**
     * 选择部门
     */
    selectDeptShow () {
    },
    /**
     * 选中部门回调
     */
    selectDept (deptId, deptInfo) {
      this.$set(this.form, 'assignRaw', deptId)
      if (this.form.multi) {
        const userNames = deptInfo.map(o => o.name).join(',')
        this.$set(this.form, 'assignShow', userNames)
      } else {
        this.$set(this.form, 'assignShow', deptInfo?.name)
      }
      this.$refs.form.validateField('assignShow')
    },
    /**
     * 分配类型改变时, 清空分配数据信息
     */
    assignTypeChange () {
      this.form.assignRaw = undefined
      this.form.assignShow = undefined
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>
