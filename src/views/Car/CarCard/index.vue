<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input clearable placeholder="请输入内容" v-model="params.carNumber" class="search-main"/>
      <span class="search-label">车主姓名：</span>
      <el-input clearable placeholder="请输入内容" v-model="params.personName" class="search-main"/>
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/car/addMonthCard')">添加月卡</el-button>
      <el-button @click="batchDelete">批量删除</el-button>
      <el-tag class="create-tag el-icon-warning"> 本园区共计 {{ proportion.cardCount }} 个车位，月卡用户 {{ proportion.spaceNumber }} 人，车位占有率 {{ proportion.proportion }} </el-tag>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="index" label="序号" :index="indexMethod"/>
        <el-table-column label="车主名称" prop="personName"/>
        <el-table-column label="联系方式" prop="phoneNumber"/>
        <el-table-column label="车牌号码" prop="carNumber"/>
        <el-table-column label="车辆品牌" prop="carBrand"/>
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate"/>
        <el-table-column label="状态" prop="cardStatus" :formatter="formatStatus"/>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" @click="renewCard(scope.row.id)">续费</el-button>
            <el-button size="mini" type="text" @click="viewCard(scope.row.id)">查看</el-button>
            <el-button size="mini" type="text" @click="editCard(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteCard(scope.row.id)">删除</el-button>
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
import { getCardListApi, deleteCardApi, getCardProportionApi } from '@/api/card'

export default {
  name: 'Card',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        carNumber: '',
        personName: '',
        // axios 中 如果参数为 null 则不加入其中
        cardStatus: null
      },
      proportion: {
        cardCount: 0,
        spaceNumber: 0,
        proportion: ''
      },
      cardList: [],
      total: 0,
      loading: false,
      statusList: [
        {
          label: '全部',
          value: null
        },
        {
          label: '可用',
          value: '0'
        },
        {
          label: '已过期',
          value: '1'
        }
      ],
      selectList: []
    }
  },
  created() {
    this.getCardList()
    this.getCardProportion()
  },
  methods: {
    async getCardList() {
      this.loading = true
      const res = await getCardListApi(this.params)
      this.cardList = res.data.rows
      this.total = res.data.total
      this.loading = false
    },
    async getCardProportion() {
      const res = await getCardProportionApi()
      this.proportion = res.data
    },
    formatStatus(row, column, cellValue) {
      // 格式化状态
      // 这里不用 if-else 代码太罗嗦
      const MAP = {
        0: '可用',
        1: '过期'
      }
      return MAP[cellValue]
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getCardList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getCardList()
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    search() {
      // 调用接口之前把页数参数重置为1
      this.params.page = 1
      this.getCardList()
    },
    editCard(id) {
      this.$router.push({
        path: '/car/addMonthCard',
        query: {
          id
        }
      })
    },
    renewCard(id) {
      this.$router.push({
        path: '/car/renewMonthCard',
        query: {
          id
        }
      })
    },
    viewCard(id) {
      this.$router.push({
        path: '/car/viewMonthCard',
        query: {
          id
        }
      })
    },
    deleteCard(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteCardApi(id)
        // 如果删除的是最后一条数据 获取列表时 应该让 page--
        if (this.cardList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getCardList()
      }).catch(() => {})
    },
    handleSelectionChange(rowList) {
      this.selectList = rowList
    },
    batchDelete() {
      const ids = this.selectList.map(item => item.id).join(',')
      this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteCardApi(ids)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getCardList()
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
