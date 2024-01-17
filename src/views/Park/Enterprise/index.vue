<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input clearable placeholder="请输入内容" v-model="params.name" class="search-main"/>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" v-permission="'park:enterprise:add_edit'" @click="$router.push('/enterprise/add')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" v-loading="loading" :data="enterpriseList" @expand-change="expandHandle">
        <el-table-column type="expand">
          <template #default="scope">
            <el-table :data="scope.row.rentBuildingList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="rentTime" />
              <el-table-column label="合同状态" prop="status" >
                <!-- 这里使用插槽进行格式化 -->
                <template #default="rentObj">
                  <el-tag :type="formatInfoType(rentObj.row.status)">
                    {{ formatterStatus(rentObj.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="rentObj">
                  <el-button size="mini" type="text" :disabled="rentObj.row.status === 3" v-permission="'park:rent:add_surrender'" @click="rentOut(rentObj.row.id)">退租</el-button>
                  <el-button size="mini" type="text" :disabled="rentObj.row.status !== 3" v-permission="'park:rent:remove'" @click="deleteRent(rentObj.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod"/>
        <el-table-column label="企业名称" width="320" prop="name"/>
        <el-table-column label="联系人" prop="contact"/>
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" v-permission="'park:rent:add_surrender'" @click="addContract(scope.row.id)">添加合同</el-button>
            <el-button size="mini" type="text" v-permission="'park:enterprise:query'" @click="$router.push(`/enterprise/detail/${scope.row.id}`)">查看</el-button>
            <el-button size="mini" type="text" v-permission="'park:enterprise:add_edit'" @click="editEnterprise(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" v-permission="'park:enterprise:remove'" @click="deleteEnterprise(scope.row.id)">删除</el-button>
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
      title="添加合同"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="closeDialog"
      width="580px">
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in rentBuildingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              ref="upload"
              action="#"
              class="upload-demo"
              :limit="1"
              :http-request="uploadImg"
              :before-upload="beforeUpload"
              :on-remove="removeImg"
            >
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirmSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getEnterpriseListAPI, deleteEnterpriseApi, addEnterpriseRentApi, getEnterpriseRentListApi, rentOutApi, deleteEnterpriseRentApi } from '@/api/enterprise'
import { getRentBuildingApi } from '@/api/building'
import { uploadImgApi } from '@/api/common'

export default {
  name: 'Enterprise',
  data() {
    return {
      params: {
        name: '',
        page: 1,
        pageSize: 10
      },
      enterpriseList: [],
      enterpriseRentList: [],
      loading: false,
      total: 0,
      dialogVisible: false,
      rentForm: {
        buildingId: null,
        startTime: '',
        endTime: '',
        contractUrl: '',
        contractId: null,
        type: 0,
        enterpriseId: null,
        rentTime: []
      },
      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'blur' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'blur' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getEnterpriseList()
  },
  methods: {
    async getEnterpriseList() {
      this.loading = true
      const res = await getEnterpriseListAPI(this.params)
      this.enterpriseList = res.data.rows.map(item => {
        return {
          ...item,
          // 每一行补充存放合同的列表
          rentBuildingList: []
        }
      })
      this.total = res.data.total
      this.loading = false
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getEnterpriseList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getEnterpriseList()
    },
    search() {
      this.params.page = 1
      this.getEnterpriseList()
    },
    editEnterprise(id) {
      this.$router.push({
        path: '/enterprise/add',
        query: {
          id
        }
      })
    },
    deleteEnterprise(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteEnterpriseApi(id)
        // 如果删除的是最后一条数据 获取列表时 应该让 page--
        if (this.enterpriseList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getEnterpriseList()
      }).catch(() => {
      })
    },
    async addContract(id) {
      this.dialogVisible = true
      const res = await getRentBuildingApi()
      this.rentBuildingList = res.data
      this.rentForm.enterpriseId = id
    },
    removeImg() {
      this.rentForm.contractId = null
      this.rentForm.contractUrl = ''
      this.$refs.addForm.validateField('contractId')
    },
    async uploadImg({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'contract')
      const res = await uploadImgApi(formData)
      this.rentForm.contractId = res.data.id
      this.rentForm.contractUrl = res.data.url
      this.$refs.addForm.validateField('contractId')
    },
    beforeUpload(file) {
      const allowImgType = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/pdf'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!allowImgType) {
        this.$message.error('上传合同文件只能是：.doc .docx .pdf 文件格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传合同文件大小不能超过 5MB!')
      }
      return allowImgType && isLt5M
    },
    closeDialog() {
      this.dialogVisible = false
      // 清空数据 只能清空绑定了 prop 的表单域 清空校验提示
      this.$refs.addForm.resetFields()
      // 清空表单数据
      this.rentForm = {
        buildingId: null,
        startTime: '',
        endTime: '',
        contractUrl: '',
        contractId: null,
        type: 0,
        enterpriseId: null,
        rentTime: []
      }
      // 清空 el-upload
      this.$refs.upload.clearFiles()
    },
    confirmSubmit() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        this.rentForm.startTime = this.rentForm.rentTime[0]
        this.rentForm.endTime = this.rentForm.rentTime[1]
        delete this.rentForm.rentTime
        await addEnterpriseRentApi(this.rentForm)
        this.$message.success('添加合同成功')
        await this.getEnterpriseList()
        // 清空数据 关闭弹框
        this.closeDialog()
      })
    },
    async expandHandle(row, expandedRows) {
      // 判断当前状态是展开还是关闭
      const isInclude = expandedRows.find(item => item.id === row.id)
      if (!isInclude) return
      const res = await getEnterpriseRentListApi(row.id)
      // eslint-disable-next-line require-atomic-updates
      row.rentBuildingList = res.data.map(item => {
        return {
          ...item,
          rentTime: item.startTime + '至' + item.endTime
        }
      })
    },
    formatterStatus(status) {
      const TYPEMAP = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return TYPEMAP[status]
    },
    formatInfoType(status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      return MAP[status]
    },
    rentOut(id) {
      this.$confirm('您确定要退租吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await rentOutApi(id)
        this.$message({
          type: 'success',
          message: '退租成功!'
        })
        await this.getEnterpriseList()
      }).catch(() => {})
    },
    deleteRent(id) {
      this.$confirm('您确定要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteEnterpriseRentApi(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getEnterpriseList()
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}

.create-container {
  margin: 10px 0px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.form-container {
  padding: 0px 80px;
}
</style>
