<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header content="月卡续费" @back="$router.back()"/>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form label-width="100px" ref="cardInfoForm" :model="cardInfoForm" :rules="cardRules">
            <el-form-item label="车主姓名" prop="personName">
              <el-input :disabled="true" v-model="cardInfoForm.personName"/>
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input :disabled="true" v-model="cardInfoForm.phoneNumber"/>
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input :disabled="true" v-model="cardInfoForm.carNumber"/>
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input :disabled="true" v-model="cardInfoForm.carBrand"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">月卡缴费信息</div>
        <div class="form">
          <el-form label-width="100px" ref="feeForm" :model="feeForm" :rules="feeRules">
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="feeForm.payTime"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="feeForm.paymentAmount"/>
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod">
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getCardDetailApi, rechargeCardApi } from '@/api/card'

export default {
  name: 'RenewMonthCard',
  data() {
    const validateCarNumber = (rule, value, callback) => {
      const plateNumberRegex = /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/
      if (plateNumberRegex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的车牌号'))
      }
    }
    return {
      cardInfoForm: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: '',
        carInfoId: 0
      },
      feeForm: {
        payTime: [],
        paymentAmount: null,
        paymentMethod: ''
      },
      cardRules: {
        personName: [
          {
            required: true, message: '请输入车主姓名', trigger: 'blur'
          }
        ],
        phoneNumber: [
          {
            required: true, message: '请输入联系方式', trigger: 'blur'
          },
          {
            pattern: /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/, message: '请输入正确的联系方式', trigger: 'blur'
          }
        ],
        carNumber: [
          {
            required: true, message: '请输入车辆号码', trigger: 'blur'
          },
          {
            validator: validateCarNumber, trigger: 'blur'
          }
        ],
        carBrand: [
          {
            required: true, message: '请输入车辆品牌', trigger: 'blur'
          }
        ]
      },
      feeRules: {
        payTime: [
          {
            required: true, message: '请选择支付时间', trigger: 'blur'
          }
        ],
        paymentAmount: [
          {
            required: true, message: '请输入支付金额', trigger: 'blur'
          }
        ],
        paymentMethod: [
          {
            required: true, message: '请选择支付方式', trigger: 'change'
          }
        ]
      },
      payMethodList: [
        {
          id: 'Alipay',
          name: '支付宝'
        },
        {
          id: 'WeChat',
          name: '微信'
        },
        {
          id: 'Cash',
          name: '线下'
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
    confirmAdd() {
      this.$refs.cardInfoForm.validate(flag => {
        if (!flag) return
        this.$refs.feeForm.validate(async flag => {
          if (!flag) return
          const requestData = {
            carInfoId: this.cardInfoForm.carInfoId,
            ...this.feeForm,
            cardStartDate: this.feeForm.payTime[0],
            cardEndDate: this.feeForm.payTime[1]
          }
          delete requestData.payTime
          await rechargeCardApi(requestData)
          this.$router.back()
        })
      })
    },
    resetForm() {
      this.$refs.feeForm.resetFields()
    },
    async getCardDetail() {
      const res = await getCardDetailApi(this.id)
      const { personName, phoneNumber, carNumber, carBrand, carInfoId } = res.data
      this.cardInfoForm = { personName, phoneNumber, carNumber, carBrand, carInfoId }
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

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
