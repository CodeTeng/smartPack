<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input clearable placeholder="请输入内容" v-model="params.name" class="search-main" />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" v-permission="'sys:user:add_edit'" @click="addEmployee">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" v-loading="loading" :data="employeeList">
        <el-table-column type="index" label="序号" width="100" :index="indexMethod" />
        <el-table-column label="员工姓名" width="150" prop="name" />
        <el-table-column label="登录账号" width="150" prop="userName" />
        <el-table-column label="联系方式" width="150" prop="phonenumber" />
        <el-table-column label="角色" width="120" prop="roleName" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            {{ statusFormat(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" />
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="scope">
            <el-button size="mini" type="text" v-permission="'sys:user:add_edit'" @click="editUser(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" v-permission="'sys:user:remove'" @click="deleteUser(scope.row.id)">删除</el-button>
            <el-button size="mini" type="text" v-permission="'sys:user:resetPwd'" @click="resetPwd(scope.row.id)">重置密码</el-button>
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
    <!-- 添加员工 -->
    <el-dialog
      :title="addForm.id ? '编辑员工' : '添加员工'"
      width="480px"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="addForm.phonenumber" />
          </el-form-item>
          <el-row v-if="!addForm.id">
            <div>
              默认密码： 123456
            </div>
          </el-row>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
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
import { getUserListApi, deleteUserApi, addUserApi, getUserDetailApi, updateUserApi, resetPwdApi } from '@/api/user'
import { getSysRoleListApi } from '@/api/role'

export default {
  name: 'Employee',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        name: ''
      },
      employeeList: [],
      loading: false,
      total: 0,
      dialogVisible: false,
      roleList: [],
      addForm: {
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { pattern: /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/, message: '请输入正确的联系方式', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请分配角色', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      this.loading = true
      const res = await getUserListApi(this.params)
      this.total = res.data.total
      this.employeeList = res.data.rows
      this.loading = false
    },
    async getRoleList() {
      const res = await getSysRoleListApi()
      this.roleList = res.data
    },
    addEmployee() {
      this.dialogVisible = true
      this.getRoleList()
    },
    async editUser(id) {
      this.dialogVisible = true
      const res = await getUserDetailApi(id)
      this.addForm = res.data
    },
    async resetPwd(id) {
      this.$confirm('确定将密码重置为“123456”?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await resetPwdApi(id)
        this.$message({
          type: 'success',
          message: '重置密码成功!'
        })
      }).catch(() => {})
    },
    confirmAdd() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        if (this.addForm.id) {
          delete this.addForm.createTime
          await updateUserApi(this.addForm)
          this.$message.success('修改员工成功')
        } else {
          await addUserApi(this.addForm)
          this.$message.success('添加员工成功')
        }
        this.closeDialog()
        this.getUserList()
      })
    },
    closeDialog() {
      this.dialogVisible = false
      delete this.addForm.id
      this.$refs.addForm.resetFields()
    },
    search() {
      this.params.page = 1
      this.getUserList()
    },
    deleteUser(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteUserApi(id)
        // 如果删除的是最后一条数据 获取列表时 应该让 page--
        if (this.employeeList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.$message({
          type: 'success',
          message: '删除员工成功!'
        })
        await this.getUserList()
      }).catch(() => {})
    },
    statusFormat(status) {
      const STATUSMAP = {
        0: '未启用',
        1: '启用'
      }
      return STATUSMAP[status]
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
