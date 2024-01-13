<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header content="查看详情" @back="$router.back()"/>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form label-width="100px">
            <el-form-item label="车主姓名">
              {{ cardInfoForm.personName }}
            </el-form-item>
            <el-form-item label="联系方式">
              {{ cardInfoForm.phoneNumber }}
            </el-form-item>
            <el-form-item label="车辆号码">
              {{ cardInfoForm.carNumber }}
            </el-form-item>
            <el-form-item label="车辆品牌">
              {{ cardInfoForm.carBrand }}
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">月卡缴费记录</div>
        <div class="form">
          <el-table
            :data="rechargeList"
            highlight-current-row
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="payTime"
              label="有效时间"
              width="380">
            </el-table-column>
            <el-table-column
              prop="paymentAmount"
              label="支付金额"
              width="180">
            </el-table-column>
            <el-table-column
              prop="paymentMethod"
              label="支付方式"
              width="180">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="办理时间"
              width="280">
            </el-table-column>
            <el-table-column
              prop="createUser"
              label="办理人"
              fixed="right">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getCardDetailApi } from '@/api/card'

export default {
  name: 'ViewMonthCard',
  data() {
    return {
      cardInfoForm: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: ''
      },
      rechargeList: [
        {
          createUser: '',
          rechargeId: 0,
          createTime: '',
          payTime: '',
          paymentMethod: '',
          paymentAmount: ''
        }
      ]
    }
  },
  created() {
    if (this.id) {
      this.getCardDetail()
    }
  },
  computed: {
    id() {
      // 目的：方便获取路由参数 query id
      return this.$route.query.id
    }
  },
  methods: {
    async getCardDetail() {
      const MAP = {
        'Alipay': '支付宝',
        'WeChat': '微信',
        'Cash': '线下'
      }
      const res = await getCardDetailApi(this.id)
      const { personName, phoneNumber, carNumber, carBrand, rechargeList } = res.data
      this.cardInfoForm = { personName, phoneNumber, carNumber, carBrand }
      this.rechargeList = rechargeList.map(item => {
        item.payTime = item.cardStartDate + '至' + item.cardEndDate
        item.paymentMethod = MAP[item.paymentMethod]
        delete item.cardStartDate
        delete item.cardEndDate
        return item
      })
    }
  }
}
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }

    .preview {
      img {
        width: 100px;
      }
    }
  }
}
</style>
