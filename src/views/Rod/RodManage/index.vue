<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input clearable placeholder="请输入内容" v-model="params.poleName" class="search-main"/>
      <span class="search-label">一体杆编号：</span>
      <el-input clearable placeholder="请输入内容" v-model="params.poleNumber" class="search-main"/>
      <span class="search-label">运行状态：</span>
      <el-select v-model="params.poleStatus">
        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" v-permission="'pole:info:add_edit'" @click="addPole">添加一体杆</el-button>
      <el-button v-permission="'pole:info:remove'" @click="batchDelete">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" v-loading="loading" :data="poleList" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod"/>
        <el-table-column label="一体杆名称" prop="poleName"/>
        <el-table-column label="一体杆编号" prop="poleNumber"/>
        <el-table-column label="一体杆IP" prop="poleIp"/>
        <el-table-column label="安装区域" prop="areaName"/>
        <el-table-column label="一体杆类型" prop="poleType">
          <template #default="scope">{{ poleFormat(scope.row.poleType) }}</template>
        </el-table-column>
        <el-table-column label="运行状态" prop="poleStatus" :formatter="formatStatus"/>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" v-permission="'pole:info:add_edit'" @click="editPole(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" v-permission="'pole:info:remove'" @click="deletePole(scope.row.id)">删除</el-button>
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
      :title="addForm.id ? '编辑一体杆' : '添加一体杆'"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      width="580px"
      @close="closeDialog"
    >
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="一体杆名称" prop="poleName">
            <el-input v-model="addForm.poleName" placeholder="请输入一体杆名称"/>
          </el-form-item>
          <el-form-item label="一体杆编号" prop="poleNumber">
            <el-input v-model="addForm.poleNumber" placeholder="请输入一体杆编号"/>
          </el-form-item>
          <el-form-item label="一体杆IP" prop="poleIp">
            <el-input v-model="addForm.poleIp" placeholder="请输入一体杆IP"/>
          </el-form-item>
          <el-form-item label="关联区域" prop="areaId">
            <el-select v-model="addForm.areaId" placeholder="请选择关联区域">
              <el-option
                v-for="item in areaList"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="一体杆类型" prop="poleType">
            <el-select v-model="addForm.poleType" placeholder="请选择一体杆类型">
              <el-option
                v-for="item in poleTypeList"
                :key="item.poleType"
                :label="item.poleName"
                :value="item.poleType">
              </el-option>
            </el-select>
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
import { getPoleListApi, deletePoleApi, updatePoleApi, addPoleApi } from '@/api/pole'
import { getAreaDropListApi } from '@/api/area'

export default {
  name: 'RodManage',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        poleName: '',
        poleNumber: '',
        poleStatus: null
      },
      poleList: [],
      total: 0,
      loading: false,
      statusList: [
        {
          label: '全部',
          value: null
        },
        {
          label: '正常',
          value: '0'
        },
        {
          label: '异常',
          value: '1'
        }
      ],
      selectList: [],
      areaList: [],
      poleTypeList: [
        {
          poleType: 'entrance',
          poleName: '入口'
        },
        {
          poleType: 'export',
          poleName: '出口'
        }
      ],
      addForm: {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        areaId: null,
        poleType: ''
      },
      addFormRules: {
        poleName: [
          { required: true, message: '请输入一体杆名称', trigger: 'blur' }
        ],
        poleNumber: [
          { required: true, message: '请输入一体杆编号', trigger: 'blur' }
        ],
        poleIp: [
          { required: true, message: '请输入一体杆IP', trigger: 'blur' },
          { pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/, message: '请输入合法的IP', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择关联区域', trigger: 'blur' }
        ],
        poleType: [
          { required: true, message: '请选择一体杆类型', trigger: 'blur' }
        ]
      },
      dialogVisible: false
    }
  },
  created() {
    this.getPoleList()
  },
  methods: {
    async getPoleList() {
      this.loading = true
      const res = await getPoleListApi(this.params)
      this.poleList = res.data.rows
      this.total = res.data.total
      this.loading = false
    },
    formatStatus(row, column, cellValue) {
      // 格式化状态
      // 这里不用 if-else 代码太罗嗦
      const MAP = {
        '0': '正常',
        '1': '异常'
      }
      return MAP[cellValue]
    },
    poleFormat(poleType) {
      const POLETYPE = {
        'entrance': '入口',
        'export': '出口'
      }
      return POLETYPE[poleType]
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getPoleList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getPoleList()
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    search() {
      // 调用接口之前把页数参数重置为1
      this.params.page = 1
      this.getPoleList()
    },
    async getAreaDropList() {
      const res = await getAreaDropListApi()
      this.areaList = res.data
    },
    editPole(id) {
      this.dialogVisible = true
      this.getAreaDropList()
      // 数据回显 没有接口 手动回显
      this.poleList.forEach(item => {
        if (item.id === id) {
          this.addForm = {
            id: id,
            poleName: item.poleName,
            poleNumber: item.poleNumber,
            poleIp: item.poleIp,
            areaId: item.areaId,
            poleType: item.poleType
          }
        }
      })
    },
    addPole() {
      this.dialogVisible = true
      this.getAreaDropList()
    },
    closeDialog() {
      this.dialogVisible = false
      delete this.addForm.id
      this.$refs.addForm.resetFields()
    },
    confirmAdd() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        if (this.addForm.id) {
          await updatePoleApi(this.addForm)
          this.$message.success('修改一体杆成功')
        } else {
          await addPoleApi(this.addForm)
          this.$message.success('添加一体杆成功')
        }
        this.closeDialog()
        this.getPoleList()
      })
    },
    deletePole(id) {
      this.$confirm('是否确认删除当前选中的一体杆?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deletePoleApi(id)
        // 如果删除的是最后一条数据 获取列表时 应该让 page--
        if (this.poleList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getPoleList()
      }).catch(() => {})
    },
    handleSelectionChange(rowList) {
      this.selectList = rowList
    },
    batchDelete() {
      const ids = this.selectList.map(item => item.id).join(',')
      this.$confirm('是否确认删除当前选中的一体杆?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deletePoleApi(ids)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getPoleList()
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
  }
}

.create-container {
  margin: 10px 0px;
}

.create-container .create-tag {
  margin: auto;
  margin-left: 700px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.form-container {
  padding: 0px 80px;
}
</style>
