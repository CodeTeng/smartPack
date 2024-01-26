<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="告警详情" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">告警详情</div>
        <div class="form">
          <el-form label-width="100px">
            <el-form-item label="告警时间">
              {{ warnDetail.warningTime }}
            </el-form-item>
            <el-form-item label="一体杆名称">
              {{ warnDetail.poleName }}
            </el-form-item>
            <el-form-item label="告警区域">
              {{ warnDetail.areaName }}
            </el-form-item>
            <el-form-item label="一体杆编号">
              {{ warnDetail.poleNumber }}
            </el-form-item>
            <el-form-item label="故障类型">
              {{ warnDetail.errorType }}
            </el-form-item>
            <el-form-item label="处置状态">
              {{ formatStatus(warnDetail.handleStatus) }}
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">告警处理</div>
        <div class="form">
          <el-form label-width="100px">
            <el-form-item label="处理人">
              {{ warnDetail.handleUser }}
            </el-form-item>
            <el-form-item label="联系方式">
              {{ warnDetail.phonenumber }}
            </el-form-item>
            <el-form-item label="处理结果">
              {{ warnDetail.handleResult }}
            </el-form-item>
            <el-form-item label="完成时间">
              {{ warnDetail.handleTime }}
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getWarnDetailApi } from '@/api/warn'

export default {
  name: 'WarnDetail',
  data() {
    return {
      warnDetail: {}
    }
  },
  created() {
    this.getWarnDetail()
  },
  methods: {
    async getWarnDetail() {
      const res = await getWarnDetailApi(this.$route.params.id)
      this.warnDetail = res.data
    },
    formatStatus(handleStatus) {
      const WARNINGTYPE = {
        0: '未派单',
        1: '已派单',
        2: '已接单',
        3: '已完成'
      }
      return WARNINGTYPE[handleStatus]
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
