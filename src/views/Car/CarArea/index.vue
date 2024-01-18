<template>
  <div class="building-container">
    <div class="create-container">
      <el-button type="primary" v-permission="'parking:area:add_edit'" @click="addArea">添加区域</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        v-loading="loading"
        :data="areaList"
      >
        <el-table-column
          type="index"
          label="序号"
          width="200"
          :index="indexMethod"
        />
        <el-table-column
          label="区域名称"
          width="200"
          prop="areaName"
        />
        <el-table-column
          label="车位数(个)"
          prop="spaceNumber"
          width="200"
        />
        <el-table-column
          label="面积(m²)"
          width="200"
          prop="areaProportion"
        />
        <el-table-column
          label="计费规则"
          width="200"
          prop="ruleName"
        />
        <el-table-column
          label="备注"
          width="200"
          prop="remark"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" v-permission="'parking:area:add_edit'" @click="editArea(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" v-permission="'parking:area:remove'" @click="deleteArea(scope.row.id)">删除</el-button>
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
      :title="addForm.id ? '编辑区域' : '添加区域'"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      width="580px"
      @close="closeDialog"
    >
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="区域名称" prop="areaName">
            <el-input v-model="addForm.areaName" placeholder="请输入区域名称"/>
          </el-form-item>
          <el-form-item label="车位数(个)" prop="spaceNumber">
            <el-input v-model="addForm.spaceNumber" placeholder="请输入车位个数"/>
          </el-form-item>
          <el-form-item label="面积(m²)" prop="areaProportion">
            <el-input v-model="addForm.areaProportion" placeholder="请输入面积"/>
          </el-form-item>
          <el-form-item label="关联计费规则" prop="ruleId">
            <el-select v-model="addForm.ruleId" placeholder="请选择">
              <el-option
                v-for="item in ruleList"
                :key="item.ruleId"
                :label="item.ruleName"
                :value="item.ruleId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入备注"
              v-model="addForm.remark">
            </el-input>
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
import { getAreaListApi, deleteAreaApi, addAreaApi, updateAreaApi } from '@/api/area'
import { getRuleDropListApi } from '@/api/rule'

export default {
  name: 'Building',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      areaList: [],
      ruleList: [],
      addForm: {
        areaName: '',
        spaceNumber: null,
        areaProportion: null,
        ruleId: null,
        remark: ''
      },
      addFormRules: {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        spaceNumber: [
          { required: true, message: '请输入车位个数', trigger: 'blur' }
        ],
        areaProportion: [
          { required: true, message: '请输入面积', trigger: 'blur' }
        ],
        ruleId: [
          { required: true, message: '请选择关联计费规则', trigger: 'blur' }
        ]
      },
      loading: false,
      dialogVisible: false
    }
  },
  created() {
    this.getAreaList()
  },
  methods: {
    async getAreaList() {
      this.loading = true
      const res = await getAreaListApi(this.params)
      this.total = res.data.total
      this.areaList = res.data.rows
      this.loading = false
    },
    async getRuleDropList() {
      const res = await getRuleDropListApi()
      this.ruleList = res.data
    },
    closeDialog() {
      this.dialogVisible = false
      delete this.addForm.id
      this.$refs.addForm.resetFields()
    },
    addArea() {
      this.dialogVisible = true
      this.getRuleDropList()
    },
    async editArea(id) {
      this.dialogVisible = true
      // 手动回显
      this.areaList.forEach(item => {
        if (item.id === id) {
          this.addForm = {
            id: id,
            areaName: item.areaName,
            spaceNumber: item.spaceNumber,
            areaProportion: item.areaProportion,
            ruleId: item.ruleId,
            remark: item.remark
          }
        }
      })
    },
    async deleteArea(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteAreaApi(id)
        // 如果删除的是最后一条数据 获取列表时 应该让 page--
        if (this.areaList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.$message({
          type: 'success',
          message: '删除区域成功!'
        })
        await this.getAreaList()
      }).catch(() => {})
    },
    confirmAdd() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        if (this.addForm.id) {
          await updateAreaApi(this.addForm)
          this.$message.success('修改区域成功')
        } else {
          await addAreaApi(this.addForm)
          this.$message.success('添加区域成功')
        }
        this.closeDialog()
        this.getAreaList()
      })
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getAreaList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getAreaList()
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
