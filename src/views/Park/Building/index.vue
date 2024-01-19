<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input placeholder="请输入内容" v-model="params.name" class="search-main" />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" v-permission="'park:building:add_edit'" @click="dialogVisible = true">添加楼宇</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        v-loading="loading"
        :data="buildingList"
      >
        <el-table-column
          type="index"
          label="序号"
          width="200"
          :index="indexMethod"
        />
        <el-table-column
          label="楼宇名称"
          width="200"
          prop="name"
        />
        <el-table-column
          label="层数"
          prop="floors"
          width="200"
        />
        <el-table-column
          label="在管面积(m²)"
          width="200"
          prop="area"
        />
        <el-table-column
          label="物业费(元/m²)"
          width="200"
          prop="propertyFeePrice"
        />
        <el-table-column label="状态" width="200">
          <template #default="scope">
            {{ statusFormat(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="demoFlag">
          <template #default="scope">
            <el-button size="mini" v-permission="'park:building:add_edit'" type="text" @click="editBuilding(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" v-permission="'park:building:remove'" @click="deleteBuilding(scope.row.id)">删除</el-button>
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
    <!-- 添加楼宇弹框 -->
    <el-dialog
      :title="addForm.id ? '编辑楼宇' : '添加楼宇'"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      width="580px"
      @close="closeDialog"
    >
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" placeholder="请输入楼宇名称"/>
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" placeholder="请输入楼宇层数"/>
          </el-form-item>
          <el-form-item label="在管面积(m²)" prop="area">
            <el-input v-model="addForm.area" placeholder="请输入再管面积"/>
          </el-form-item>
          <el-form-item label="物业费(元/m²)" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" placeholder="请输入物业费"/>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getBuildingListApi, addBuildingApi, getBuildingDetailApi, updateBuildingApi, deleteBuildingApi } from '@/api/building'

export default {
  name: 'Building',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        name: ''
      },
      total: 0,
      buildingList: [],
      addForm: {
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入楼宇名称', trigger: 'blur' }
        ],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入楼宇面积', trigger: 'blur' }
        ],
        propertyFeePrice: [
          { required: true, message: '请输入楼宇物业费', trigger: 'blur' }
        ]
      },
      loading: false,
      dialogVisible: false
    }
  },
  created() {
    this.getBuildingList()
  },
  methods: {
    async getBuildingList() {
      this.loading = true
      const res = await getBuildingListApi(this.params)
      this.total = res.data.total
      this.buildingList = res.data.rows
      this.loading = false
    },
    search() {
      this.params.page = 1
      this.getBuildingList()
    },
    closeDialog() {
      this.dialogVisible = false
      delete this.addForm.id
      this.$refs.addForm.resetFields()
    },
    async editBuilding(id) {
      this.dialogVisible = true
      const res = await getBuildingDetailApi(id)
      this.addForm = res.data
    },
    async deleteBuilding(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteBuildingApi(id)
        // 如果删除的是最后一条数据 获取列表时 应该让 page--
        if (this.buildingList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.$message({
          type: 'success',
          message: '删除楼宇成功!'
        })
        await this.getBuildingList()
      }).catch(() => {})
    },
    confirmAdd() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        if (this.addForm.id) {
          delete this.addForm.status
          delete this.addForm.delFlag
          await updateBuildingApi(this.addForm)
          this.$message.success('修改楼宇成功')
        } else {
          await addBuildingApi(this.addForm)
          this.$message.success('添加楼宇成功')
        }
        this.closeDialog()
        this.getBuildingList()
      })
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getUserList()
    },
    statusFormat(status) {
      const STATUSMAP = {
        0: '空置中',
        1: '租赁中'
      }
      return STATUSMAP[status]
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container{
  padding:10px;
}
.search-container{
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237,237,237,.9);;
  padding-bottom: 20px;
  .search-label{
    width:100px;
  }
  .search-main{
    width: 220px;
    margin-right: 10px;
  }
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
</style>
