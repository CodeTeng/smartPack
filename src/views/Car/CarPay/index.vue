<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input clearable placeholder="请输入内容" v-model="params.carNumber" class="search-main"/>
      <span class="search-label">状态：</span>
      <el-select v-model="params.paymentStatus">
        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" v-loading="loading" :data="paymentList">
        <el-table-column type="index" label="序号" :index="indexMethod"/>
        <el-table-column label="车牌号码" prop="carNumber"/>
        <el-table-column label="收费类型" prop="chargeType">
          <template #default="scope">{{ chargeFormat(scope.row.chargeType )}} </template>
        </el-table-column>
        <el-table-column label="停车总时长" prop="parkingTime"/>
        <el-table-column label="缴纳费用(元)" prop="actualCharge"/>
        <el-table-column label="缴纳状态" prop="paymentStatus" :formatter="formatStatus"/>
        <el-table-column label="缴纳方式" prop="paymentMethod">
          <template #default="scope">{{ methodFormat(scope.row.paymentMethod) }}</template>
        </el-table-column>
        <el-table-column label="缴纳时间" prop="paymentTime" />
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
import { getPayListApi } from '@/api/pay'

export default {
  name: 'Pay',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        carNumber: '',
        // axios 中 如果参数为 null 则不加入其中
        paymentStatus: null
      },
      paymentList: [],
      total: 0,
      loading: false,
      statusList: [
        {
          label: '全部',
          value: null
        },
        {
          label: '待缴纳',
          value: '0'
        },
        {
          label: '已缴纳',
          value: '1'
        }
      ]
    }
  },
  created() {
    this.getPaymentList()
  },
  methods: {
    async getPaymentList() {
      this.loading = true
      const res = await getPayListApi(this.params)
      this.total = res.data.total
      this.paymentList = res.data.rows
      this.loading = false
    },
    chargeFormat(chargeType) {
      const CHARGEMAP = {
        'card': '月卡',
        'temp': '临时停车'
      }
      return CHARGEMAP[chargeType]
    },
    methodFormat(paymentMethod) {
      const METHODMAP = {
        'Alipay': '支付宝',
        'WeChat': '微信',
        'Cash': '线下'
      }
      return METHODMAP[paymentMethod]
    },
    formatStatus(row, column, cellValue) {
      // 格式化状态
      // 这里不用 if-else 代码太罗嗦
      const MAP = {
        '0': '未缴纳',
        '1': '已缴纳'
      }
      return MAP[cellValue]
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getPaymentList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getPaymentList()
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    search() {
      // 调用接口之前把页数参数重置为1
      this.params.page = 1
      this.getPaymentList()
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
