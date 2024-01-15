<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="查看企业" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form label-width="100px">
            <el-form-item label="企业名称">
              {{ form.name }}
            </el-form-item>
            <el-form-item label="法人">
              {{ form.legalPerson }}
            </el-form-item>
            <el-form-item label="注册地址">
              {{ form.registeredAddress }}
            </el-form-item>
            <el-form-item label="所在行业">
              {{ formatIndustry(form.industryCode) }}
            </el-form-item>
            <el-form-item label="企业联系人">
              {{ form.contact }}
            </el-form-item>
            <el-form-item label="联系电话">
              {{ form.contactNumber }}
            </el-form-item>
            <el-form-item label="营业执照">
              <img :src="form.businessLicenseUrl" style="width: 100px">
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">联系人信息</div>
        <div class="form">
          <el-form label-width="100px">
            <el-form-item label="企业联系人">
              {{ form.contact }}
            </el-form-item>
            <el-form-item label="联系电话">
              {{ form.contactNumber }}
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">租赁记录</div>
        <div class="table-container">
          <el-table
            :data="rentList"
            style="width: 100%"
            border
          >
            <el-table-column
              prop="index"
              label="序号"
              width="50"
              type="index"
              align="center"
            />
            <el-table-column
              prop="name"
              label="租赁楼宇"
              width="180"
            />
            <el-table-column label="合同状态" prop="status" width="80">
              <!-- 这里使用插槽进行格式化 -->
              <template #default="rentObj">
                <el-tag :type="formatInfoType(rentObj.row.status)">
                  {{ formatterStatus(rentObj.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="租赁起止时间"
              width="200"
            >
              <template #default="{row}">
                {{ row.startTime }} 至 {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column
              width="600"
              label="租赁合同(点击预览)"
            >
              <template #default="{row}">
                <el-button type="text">
                  <a :href="`${previewURL}${row.contractUrl}`" target="_blank">
                    {{ row.contractName }}
                  </a>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="录入时间"
              width="180"
            />
            <el-table-column
              prop="address"
              label="操作"
            >
              <template #default="{row}">
                <el-button type="text">
                  <a :href="row.contractUrl">
                    合同下载
                  </a>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getEnterpriseDetailApi, getIndustryListApi } from '@/api/enterprise'

export default {
  name: 'EnterpriseDetail',
  data() {
    return {
      form: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      industryList: [], // 可选行业列表
      rentList: [],
      previewURL: 'https://view.officeapps.live.com/op/view.aspx?src=' // 预览地址
    }
  },
  created() {
    this.getEnterpriseDetail()
    this.getIndustryList()
  },
  methods: {
    async getIndustryList() {
      const res = await getIndustryListApi()
      this.industryList = res.data
    },
    async getEnterpriseDetail() {
      const res = await getEnterpriseDetailApi(this.$route.params.id)
      const { businessLicenseId, businessLicenseUrl, contact, contactNumber, industryCode, legalPerson, name, registeredAddress } = res.data
      this.form = { businessLicenseId, businessLicenseUrl, contact, contactNumber, industryCode, legalPerson, name, registeredAddress }
      this.rentList = res.data.rent
    },
    formatIndustry(industryCode) {
      return this.industryList.find(item => item.industryCode === industryCode).industryName
    },
    formatterStatus(status) {
      const TYPEMAP = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return TYPEMAP[status]
    },
    formatInfoType(status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      return MAP[status]
    }
  }
}
</script>

<style scoped lang="scss">
.detail-enterprise {
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
      .arrow{
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
    .table-container{
      padding:20px;
    }
    .preview{
      img{
        width: 100px;
      }
    }
  }
}
</style>
