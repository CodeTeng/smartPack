<template>
  <div class="add-role">
    <header class="add-header">
      <el-page-header :content="id ? '编辑角色' : '添加角色'" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="activeStep">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div v-show="activeStep === 1" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="roleForm" class="form-box" :model="roleForm" :rules="roleRules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input
                v-model="roleForm.remark"
                type="textarea"
                placeholder="请输入内容"
                resize="none"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="activeStep === 2" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }}</div>
              <el-tree
                ref="tree"
                :data="item.children"
                :props="defaultProps"
                default-expand-all
                check-strictly
                highlight-current
                show-checkbox
                node-key="id"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="activeStep === 3" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in treeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="disabledTree"
                  :data="item.children"
                  show-checkbox
                  default-expand-all
                  check-strictly
                  node-key="id"
                  :highlight-current="false"
                  :props="{ label: 'title', disabled:() => true }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button v-if="activeStep > 1" @click="decreaseStep">上一步</el-button>
        <el-button v-if="activeStep < 3" type="primary" @click="increaseStep">下一步</el-button>
        <el-button v-if="activeStep === 3" type="primary" @click="confirmAdd">{{ id ? '确认修改' : '确认添加' }}</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getSysPermissionTreeApi, addSysRoleApi, getSysRoleDetailApi, updateSysRoleApi } from '@/api/role'

export default {
  name: 'AddRole',
  data() {
    return {
      activeStep: 1,
      roleForm: {
        roleName: '',
        remark: '',
        perms: []
      },
      treeList: [],
      defaultProps: {
        label: 'title'
      },
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  created() {
    this.getPermissionTree()
    if (this.id) {
      this.getSysRoleDetail()
    }
  },
  methods: {
    async getSysRoleDetail() {
      const res = await getSysRoleDetailApi(this.id)
      const { perms, roleName, remark } = res.data
      this.roleForm.roleName = roleName
      this.roleForm.remark = remark
      this.roleForm.perms = perms
      this.$refs.tree.forEach((tree, index) => {
        tree.setCheckedKeys(this.roleForm.perms[index])
      })
    },
    async getPermissionTree() {
      const res = await getSysPermissionTreeApi()
      this.treeList = res.data
    },
    decreaseStep() {
      if (this.activeStep === 1) return
      this.activeStep--
    },
    increaseStep() {
      if (this.activeStep === 3) return
      if (this.activeStep === 1) {
        this.$refs.roleForm.validate(flag => {
          if (!flag) return
          this.activeStep++
        })
      } else if (this.activeStep === 2) {
        // 点击之前先清空
        this.roleForm.perms = []
        this.$refs.tree.forEach(tree => {
          this.roleForm.perms.push(tree.getCheckedKeys())
        })
        // 校验
        if (this.roleForm.perms.flat().length === 0) {
          this.$message.warning('请至少选择一个权限')
          return
        }
        // 在第二步进行第三步的回显操作
        this.$refs.disabledTree.forEach((tree, index) => {
          tree.setCheckedKeys(this.roleForm.perms[index])
        })
        this.activeStep++
      }
    },
    async confirmAdd() {
      if (this.id) {
        const requestData = {
          ...this.roleForm,
          roleId: this.id
        }
        await updateSysRoleApi(requestData)
        this.$message.success('修改角色成功')
      } else {
        await addSysRoleApi(this.roleForm)
        this.$message.success('添加角色成功')
      }
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
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
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;

    .step-container {
      height: 400px;
      width: 200px;
    }

    .form-container {
      flex: 1;
      background-color: #fff;
      overflow-y: auto;

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
        }

        .info {
          font-size: 14px;
          color: #666;

          .form-item {
            margin-bottom: 20px;
          }
        }
      }

      .form-box {
        width: 600px;
        display: flex;
        flex-direction: column;
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
    z-index: 10001;
  }

  .tree-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .tree-item {
      flex: 1;
      padding: 0px 4px;
      text-align: center;

      .tree-title {
        background: #f5f7fa;
        text-align: center;
        padding: 10px 0;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
