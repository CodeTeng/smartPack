<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="(item, index) in roleList"
        :key="item.roleId"
        @click="menuChange(index)"
        :class="{ active: activeIndex === index }"
        class="role-item">
        <div class="role-info">
          <svg-icon :icon-class="activeIndex === index ? 'user-active' : 'user'" class="icon"/>
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$router.push(`/sys/role/add/?id=${item.roleId}`)" v-permission="'sys:role:add_edit'">编辑角色</el-dropdown-item>
              <el-dropdown-item @click.native="deleteRole(item.roleId)" v-permission="'sys:role:remove'">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/sys/role/add')" v-permission="'sys:role:add_edit'">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="tree">
          <div class="tree-wrapper">
            <div v-for="item in permissionList" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }} </div>
              <el-tree
                ref="tree"
                :data="item.children"
                :props="defaultProps"
                :default-expand-all="true"
                show-checkbox
                node-key="id"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员列表(${total})`" name="member">
          <div class="user-wrapper">
            <el-table
              :data="userList"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="250"
                label="序号"
                :index="indexMethod"
              />
              <el-table-column
                prop="name"
                label="员工姓名"
              />
              <el-table-column
                prop="userName"
                label="登录账号"
              />
            </el-table>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="params.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getSysRoleListApi, getSysPermissionTreeApi, getSysRoleDetailApi, getSysRoleUserListApi, deleteSysRoleApi } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      roleList: [],
      activeIndex: 0,
      permissionList: [],
      activeName: 'tree',
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      userList: [],
      defaultProps: {
        label: 'title',
        // 也可以用递归实现
        disabled: () => true
      }
    }
  },
  async created() {
    await this.getSysRoleList()
    await this.getPermissionTree()
    this.menuChange(0)
  },
  methods: {
    async getSysRoleList() {
      const res = await getSysRoleListApi()
      this.roleList = res.data
    },
    async getPermissionTree() {
      const res = await getSysPermissionTreeApi()
      this.permissionList = res.data
      // this.addDisable(this.permissionList)
    },
    async getSysRoleDetail(roleId) {
      const res = await getSysRoleDetailApi(roleId)
      const perms = res.data.perms
      this.$refs.tree.forEach((tree, index) => {
        tree.setCheckedKeys(perms[index])
      })
    },
    async deleteRole(roleId) {
      this.$confirm('此操作将永久删除, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteSysRoleApi(roleId)
        // 如果删除的是最后一条数据 获取列表时 应该让 page--
        if (this.userList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
        this.$message({
          type: 'success',
          message: '删除角色成功!'
        })
        await this.getSysRoleList()
        await this.getPermissionTree()
        this.menuChange(0)
      }).catch(() => {
      })
    },
    async menuChange(index) {
      this.activeIndex = index
      const roleId = this.roleList[index].roleId
      await this.getSysRoleDetail(roleId)
      const res = await getSysRoleUserListApi(roleId, this.params)
      this.total = res.data.total
      this.userList = res.data.rows
    },
    addDisable(treeList) {
      treeList.forEach(item => {
        item.disabled = true
        if (item.children) {
          this.addDisable(item.children)
        }
      })
    },
    indexMethod(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getEnterpriseList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getEnterpriseList()
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding: 20px;

  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }

    .addBtn {
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
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

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper {
      padding: 20px;
    }
  }
}
</style>
