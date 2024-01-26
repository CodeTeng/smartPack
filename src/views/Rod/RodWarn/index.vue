<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input clearable placeholder="请输入内容" v-model="params.poleName" class="search-main"/>
      <span class="search-label">一体杆编号：</span>
      <el-input clearable placeholder="请输入内容" v-model="params.poleNumber" class="search-main"/>
      <span class="search-label">处置状态：</span>
      <el-select v-model="params.handleStatus" placeholder="请选择处置状态">
        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" v-loading="loading" :data="warningList">
        <el-table-column type="index" label="序号" :index="indexMethod"/>
        <el-table-column label="一体杆名称" prop="poleName"/>
        <el-table-column label="一体杆编号" prop="poleNumber"/>
        <el-table-column label="故障类型" prop="errorType"/>
        <el-table-column label="处置状态" prop="handleStatus">
          <template #default="scope">{{ warningFormat(scope.row.handleStatus) }}</template>
        </el-table-column>
        <el-table-column label="告警时间" prop="warningTime"/>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" v-permission="'pole:warning:send'" @click="dispatchOrders(scope.row.id)">派单</el-button>
            <el-button size="mini" type="text" v-permission="'pole:warning:query'" @click="$router.push(`/warn/detail/${scope.row.id}`)">详情</el-button>
            <el-button size="mini" type="text" v-permission="'pole:warning:remove'" @click="deletePole(scope.row.id)">删除</el-button>
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
  </div>
</template>

<script>
import { getWarningListApi, deleteWarningApi } from '@/api/warn'

export default {
  name: 'RodWarn',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        poleName: '',
        poleNumber: '',
        handleStatus: ''
      },
      warningList: [],
      total: 0,
      loading: false,
      statusList: [
        {
          label: '全部',
          value: null
        },
        {
          label: '未派单',
          value: '0'
        },
        {
          label: '已派单',
          value: '1'
        },
        {
          label: '已接单',
          value: '2'
        },
        {
          label: '已完成',
          value: '3'
        }
      ]
    }
  },
  created() {
    this.getWarningList()
  },
  methods: {
    async getWarningList() {
      this.loading = true
      const res = await getWarningListApi(this.params)
      this.warningList = res.data.rows
      this.total = res.data.total
      this.loading = false
    },
    warningFormat(handleStatus) {
      const WARNINGTYPE = {
        0: '未派单',
        1: '已派单',
        2: '已接单',
        3: '已完成'
      }
      return WARNINGTYPE[handleStatus]
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getWarningList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getWarningList()
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    search() {
      // 调用接口之前把页数参数重置为1
      this.params.page = 1
      this.getWarningList()
    },
    deletePole(id) {
      this.$confirm('是否确认删除当前告警记录?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteWarningApi(id)
        // 如果删除的是最后一条数据 获取列表时 应该让 page--
        if (this.warningList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getWarningList()
      }).catch(() => {})
    },
    dispatchOrders(id) {
      this.$message.info('未开放')
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
