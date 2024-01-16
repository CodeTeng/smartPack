<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="addRule">增加停车计费规则</el-button>
      <el-button @click="exportExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" v-loading="loading" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" :index="indexMethod"/>
        <el-table-column label="计费规则编号" prop="ruleNumber" width="150" />
        <el-table-column label="计费规则名称" prop="ruleName" width="150"/>
        <el-table-column label="免费时长(分钟)" prop="freeDuration" width="150"/>
        <el-table-column label="收费上线(元)" prop="chargeCeiling" width="150"/>
        <el-table-column label="计费方式" width="150">
          <template #default="scope">
            {{ chargeTypeFormat(scope.row.chargeType) }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView"/>
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text" @click="editRule(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteRule(scope.row.id)">删除</el-button>
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
    <add-rule :dialogVisible.sync="dialogVisible" :id="id" @getList="getParkingRuleList"/>
  </div>
</template>

<script>
import { getParkingRuleListApi, deleteParkingRuleApi } from '@/api/rule'
import { utils, writeFileXLSX } from 'xlsx'
import AddRule from './components/AddRule.vue'

export default {
  name: 'Building',
  components: {
    AddRule
  },
  data() {
    return {
      ruleList: [],
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      dialogVisible: false,
      loading: false,
      id: null
    }
  },
  created() {
    this.getParkingRuleList()
  },
  methods: {
    async getParkingRuleList() {
      this.loading = true
      const res = await getParkingRuleListApi(this.params)
      this.loading = false
      this.total = res.data.total
      this.ruleList = res.data.rows
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getParkingRuleList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getParkingRuleList()
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    chargeTypeFormat(chargeType) {
      const CHARGEMAP = {
        'duration': '时长收费',
        'turn': '按次收费',
        'partition': '分段收费'
      }
      return CHARGEMAP[chargeType]
    },
    deleteRule(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteParkingRuleApi(id)
        // 如果删除的是最后一条数据 获取列表时 应该让 page--
        if (this.ruleList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getParkingRuleList()
      }).catch(() => {})
    },
    async editRule(id) {
      this.dialogVisible = true
      this.id = id
    },
    async exportExcel() {
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      const res = await getParkingRuleListApi(this.params)
      // 表头英文字段key
      const tableHeaderKeys = ['ruleNumber', 'ruleName', 'freeDuration', 'chargeCeiling', 'chargeType', 'ruleNameView']
      // 表头中文字段value
      const tableHeaderValues = ['计费规则编号', '计费规则名称', '免费时长(分钟)', '收费上线(元)', '计费方式', '计费规则']
      const sheetData = res.data.rows.map(item => {
        const obj = {}
        tableHeaderKeys.forEach(key => {
          obj[key] = item[key]
        })
        obj.chargeType = this.chargeTypeFormat(item.chargeType)
        return obj
      })
      // 创建一个工作表 要求一个对象数组格式
      const worksheet = utils.json_to_sheet(sheetData)
      // 把工作表添加到工作簿  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, '停车计费表')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
      // 导出方法进行导出
      writeFileXLSX(workbook, '停车计费表.xlsx')
    },
    addRule() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
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
</style>
