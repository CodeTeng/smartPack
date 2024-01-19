<template>
  <!-- 弹框 -->
  <el-dialog :visible="dialogVisible" width="600px" :title="addForm.id ? '编辑规则' : '新增规则'" @close="closeDialog" :close-on-click-modal="false">
    <!-- 表单接口 -->
    <div class="form-container">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="top">
        <el-form-item label="计费规则编号" prop="ruleNumber">
          <el-input v-model="addForm.ruleNumber" />
        </el-form-item>
        <el-form-item label="计费规则名称" prop="ruleName">
          <el-input v-model="addForm.ruleName" />
        </el-form-item>
        <el-form-item label="计费方式" prop="chargeType">
          <el-radio-group v-model="addForm.chargeType" size="small">
            <el-radio label="duration" border>时长收费</el-radio>
            <el-radio label="turn" border>按次收费</el-radio>
            <el-radio label="partition" border>分段收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="flex-container">
          <el-form-item label="免费时长">
            <el-input v-model="addForm.freeDuration" />
          </el-form-item>
          <el-form-item label="收费上限">
            <el-input v-model="addForm.chargeCeiling" />
          </el-form-item>
        </div>
        <el-form-item label="计费规则" required>
          <!-- 按时长收费区域 -->
          <div class="duration" v-if="addForm.chargeType === 'duration'">
            <div>
              每
              <el-form-item prop="durationTime" style="display: inline-block" label-width="50px">
                <el-input-number style="width: 150px" v-model="addForm.durationTime" controls-position="right" :min="1" />
              </el-form-item>
              小时
              <el-form-item prop="durationPrice" style="display: inline-block" label-width="50px">
                <el-input style="width: 150px" v-model="addForm.durationPrice" class="input-box" />
              </el-form-item>
              元
            </div>
          </div>
          <!-- 按次收费区域 -->
          <div class="turn" v-if="addForm.chargeType === 'turn'">
            每次
            <el-form-item prop="turnPrice" style="display: inline-block" label-width="50px">
              <el-input v-model="addForm.turnPrice" class="input-box" style="width: 100px" />
            </el-form-item>
            元
          </div>
          <!-- 按分段收费区域 -->
          <div class="partition" v-if="addForm.chargeType === 'partition'">
            <div class="item">
              <el-form-item prop="partitionFrameTime" style="display: inline-block; margin-bottom: 10px" label-width="50px">
                <el-input v-model="addForm.partitionFrameTime" style="width: 100px" class="input-box" />
              </el-form-item>
              小时内,每小时收费
              <el-form-item prop="partitionFramePrice" style="display: inline-block" label-width="50px">
                <el-input v-model="addForm.partitionFramePrice" style="width: 100px" class="input-box" />
              </el-form-item>
              元
            </div>
            <div class="item">
              每增加
              <el-form-item prop="partitionIncreaseTime" style="display: inline-block" label-width="50px">
                <el-input v-model="addForm.partitionIncreaseTime" style="width: 100px" class="input-box" />
              </el-form-item>
              小时,增加
              <el-form-item prop="partitionIncreasePrice" style="display: inline-block" label-width="50px">
                <el-input v-model="addForm.partitionIncreasePrice" style="width: 100px" class="input-box" />
              </el-form-item>
              元
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button size="mini" @click="closeDialog">取 消</el-button>
      <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { addParkingRuleApi, updateParkingRuleApi, getParkingRuleDetailApi } from '@/api/rule'

export default {
  name: 'AddRule',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱
      },
      addFormRules: {
        ruleNumber: [
          {
            required: true,
            message: '请输入规则编号',
            trigger: 'blur'
          }
        ],
        ruleName: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }
        ],
        chargeType: [
          {
            required: true,
            message: '请选择收费类型',
            trigger: 'blur'
          }
        ],
        durationTime: [
          {
            required: true,
            message: '请输入时间',
            trigger: 'blur'
          }
        ],
        durationPrice: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          }
        ],
        turnPrice: [
          {
            required: true,
            message: '请输入次数',
            trigger: 'blur'
          }
        ],
        partitionFrameTime: [
          {
            required: true,
            message: '请输入段内时间',
            trigger: 'blur'
          }
        ],
        partitionFramePrice: [
          {
            required: true,
            message: '请输入段内费用',
            trigger: 'blur'
          }
        ],
        partitionIncreaseTime: [
          {
            required: true,
            message: '请输入超出时间',
            trigger: 'blur'
          }
        ],
        partitionIncreasePrice: [
          {
            required: true,
            message: '请输入超出金额',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    'addForm.chargeType'(val) {
      // 也可使用el-radio 的 change 事件监听
      // 点击切换 清楚校验
      this.$refs.addForm.clearValidate(['durationTime', 'durationPrice', 'turnPrice', 'partitionFrameTime', 'partitionFramePrice', 'partitionIncreaseTime', 'partitionIncreasePrice'])
    }
  },
  methods: {
    async getRuleDetail(id) {
      const res = await getParkingRuleDetailApi(id)
      this.addForm = res.data
    },
    closeDialog() {
      // 子组件通知父组件修改
      // 1. 子传父
      // 2. this.$parent
      // this.$parent.dialogVisible = false
      // 3. .sync修饰符 子组件和父组件的数据进行双向绑定 【父组件加上 .sync 之后表示放权给子组件修改props中的数据】 固定语法：this.$emit('update:props传来的值', 要修改的值)
      this.$emit('update:dialogVisible', false)
      this.$refs.addForm.resetFields()
      this.addForm = {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱
      }
    },
    confirmAdd() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        if (this.addForm.id) {
          await updateParkingRuleApi(this.addForm)
          this.$message.success('修改成功')
        } else {
          await addParkingRuleApi(this.addForm)
          this.$message.success('添加成功')
        }
        // await this.getParkingRuleList()
        // 子组件调用父组件的方法
        // 1. this.$parent
        // this.$parent.getParkingRuleList()
        // 2. this.$emit('getParkingRuleList')
        this.$emit('getList')
        this.closeDialog()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.form-container{
  padding:0px 80px;
}
</style>
