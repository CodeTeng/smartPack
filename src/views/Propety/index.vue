<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input clearable placeholder="请输入企业名称" v-model="params.enterpriseName" class="search-main" />
      <div class="search-label">缴费时间：</div>
      <el-date-picker
        v-model="rentTime"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" v-permission="'park:propertyFee:add'" @click="addFee">添加账单</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" v-loading="loading" :data="feeList">
        <el-table-column type="index" label="序号" width="100" :index="indexMethod" />
        <el-table-column label="账单编号" width="180" prop="billNumber" />
        <el-table-column label="企业名称" width="210" prop="enterpriseName" />
        <el-table-column label="租赁楼宇" width="150" prop="buildingName" />
        <el-table-column label="物业费(元/m²)" width="120" prop="propertyFeePrice" />
        <el-table-column label="账单金额(元)" width="150" prop="paymentAmount"/>
        <el-table-column label="缴费时间" width="220">
          <template #default="scope">
            {{ scope.row.startTime }} - {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="scope">
            <el-button size="mini" type="text" v-permission="'park:propertyFee:query'" @click="viewFee(scope.row.id)">查看</el-button>
            <el-button size="mini" type="text" v-permission="'park:propertyFee:remove'" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="添加账单"
      width="580px"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="选择租户" prop="enterpriseId">
            <el-select v-model="addForm.enterpriseId" placeholder="请选择租户">
              <el-option
                v-for="item in enterPriseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="addForm.buildingId" placeholder="请选择租赁楼宇">
              <el-option
                v-for="item in buildingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="缴费周期" prop="rentTime">
            <el-date-picker
              v-model="addForm.rentTime"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="支付金额" prop="paymentAmount">
            <el-input v-model="addForm.paymentAmount" placeholder="请输入支付金额"/>
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentMethod">
            <el-select v-model="addForm.paymentMethod" placeholder="请选择支付方式">
              <el-option
                v-for="item in methodList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 查看账单 -->
    <el-dialog
      title="查看账单"
      :visible.sync="viewDialog"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :data="vieList">
        <el-form-item label="租户名称:">
          {{ vieList.enterpriseName }}
        </el-form-item>
        <el-form-item label="租赁楼宇:">
          {{ vieList.buildingName }}
        </el-form-item>
        <el-form-item label="缴费周期:">
          {{ vieList.startTime }}至{{ vieList.endTime }}
        </el-form-item>
        <el-form-item label="物业费(元/m²):">
          {{ vieList.propertyFeePrice }}
        </el-form-item>
        <el-form-item label="账单金额(元):">
          {{ vieList.paymentAmount }}
        </el-form-item>
        <el-form-item label="支付方式:">
          {{ vieList.paymentMethodValue }}
        </el-form-item>
        <el-form-item label="缴费时间:">
          {{ vieList.createTime }}
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-row>
          <el-button @click="viewDialog = false">取消</el-button>
          <el-button type="primary" @click="viewDialog = false">确认</el-button>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPropertyFeeListApi, getEnterpriseListApi, getBuildingListApi, addPropertyFeeApi, deleteFeeApi, getFeeDetailApi } from '@/api/propertyfee'

export default {
  name: 'Property',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        enterpriseName: '',
        start: '',
        end: ''
      },
      rentTime: [],
      feeList: [],
      enterPriseList: [],
      buildingList: [],
      loading: false,
      total: 0,
      dialogVisible: false,
      viewDialog: false,
      vieList: [],
      addForm: {
        enterpriseId: null,
        buildingId: null,
        rentTime: [],
        paymentAmount: null,
        paymentMethod: null
      },
      addFormRules: {
        enterpriseId: [
          { required: true, message: '请选择租户', trigger: 'blur' }
        ],
        buildingId: [
          { required: true, message: '请选择租赁楼宇', trigger: 'blur' }
        ],
        rentTime: [
          { required: true, message: '请输入缴费日期', trigger: 'blur' }
        ],
        paymentAmount: [
          { required: true, message: '请输入支付金额', trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ]
      },
      methodList: [
        {
          id: 1,
          name: '微信'
        },
        {
          id: 2,
          name: '支付宝'
        },
        {
          id: 3,
          name: '现金'
        }
      ]
    }
  },
  created() {
    this.getFeeList()
  },
  methods: {
    async getFeeList() {
      this.loading = true
      const res = await getPropertyFeeListApi(this.params)
      this.total = res.data.total
      this.feeList = res.data.rows
      this.loading = false
    },
    async getEnterpriseList() {
      const res = await getEnterpriseListApi()
      this.enterPriseList = res.data
    },
    async getBuildingList() {
      const res = await getBuildingListApi()
      this.buildingList = res.data
    },
    addFee() {
      this.dialogVisible = true
      this.getFeeList()
      this.getEnterpriseList()
      this.getBuildingList()
    },
    async viewFee(id) {
      this.viewDialog = true
      const res = await getFeeDetailApi(id)
      this.vieList = res.data
    },
    confirmAdd() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        this.addForm.startTime = this.addForm.rentTime[0]
        this.addForm.endTime = this.addForm.rentTime[1]
        delete this.addForm.rentTime
        await addPropertyFeeApi(this.addForm)
        this.$message.success('添加账单成功')
        this.closeDialog()
        this.getFeeList()
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.$refs.addForm.resetFields()
    },
    search() {
      this.params.page = 1
      if (this.rentTime) {
        this.params.start = this.rentTime[0]
        this.params.end = this.rentTime[1]
      } else {
        this.params.start = ''
        this.params.end = ''
      }
      this.getFeeList(this.params)
    },
    deleteUser(id) {
      this.$confirm('是否确认删除当前账单?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteFeeApi(id)
        // 如果删除的是最后一条数据 获取列表时 应该让 page--
        if (this.feeList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getFeeList()
      }).catch(() => {})
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getFeeList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getFeeList()
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}

.el-row {
  margin-bottom: 20px;
  margin-left: 12px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
