<template>
  <div class="login_body">
    <div class="bg"/>
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <!--   表单校验4要素   -->
      <!--   1. el-form :model 对应的值是表单对应的数据对象   -->
      <!--   2. el-form :rules 对应的校验规则   -->
      <!--   3. el-form-item prop 表示要校验哪个字段   -->
      <!--   4. 表单元素 (el-input el-checkbox ...) v-model     -->
      <el-form ref="form" :model="loginForm" :rules="rules">
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="loginForm.username"/>
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input show-password v-model="loginForm.password"/>
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { FORM_KEY } from '@/constants/KEY'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rememberMe: false,
      rules: {
        username: [
          {
            required: true, message: '用户名不能为空', trigger: 'blur'
          },
          {
            min: 3, max: 10, message: '用户名长度在3到10位', trigger: 'blur'
          }
        ],
        password: [
          {
            required: true, message: '密码不能为空', trigger: 'blur'
          },
          {
            min: 3, max: 10, message: '密码长度在3到10位', trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    const loginData = localStorage.getItem(FORM_KEY)
    if (loginData) {
      const { username, password } = JSON.parse(loginData)
      this.loginForm.username = username
      this.loginForm.password = password
    }
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate(async flag => {
        if (!flag) return
        // 下面这样写不符合 Vuex 规范
        // const res = await loginAPI(this.loginForm)
        // this.$store.commit('user/setToken', res.data.token)
        try {
          await this.$store.dispatch('user/loginAction', this.loginForm)
          if (this.rememberMe) {
            localStorage.setItem(FORM_KEY, JSON.stringify(this.loginForm))
          } else {
            localStorage.removeItem(FORM_KEY)
          }
          // 获取上次退出的路由
          const url = this.$route.query.redirect
          if (url) {
            this.$router.push(url)
          } else {
            this.$router.push('/')
          }
        } catch (error) {
          this.$message.error(error.response.data.msg)
        }
      })
    }
  }
}

</script>

<style scoped lang="scss">
.login_body {
  display: flex;
}

.bg {
  width: 60vw;
  height: 100vh;
  background: url('~@/assets/login-bg.svg') no-repeat;
  background-position: right top;
  background-size: cover;
}

.box {
  margin: 200px 10% 0;
  flex: 1;

  .title {
    padding-bottom: 76px;
    font-size: 26px;
    font-weight: 500;
    color: #1e2023;
  }

  ::v-deep() {
    .ant-form-item {
      display: flex;
      margin-bottom: 62px;
      flex-direction: column;
    }

    .ant-form-item-label label {
      font-size: 16px;
      color: #8b929d;
    }

    .ant-input,
    .ant-input-password {
      border-radius: 8px;
    }
  }
}

.login_btn {
  width: 100%;
}
</style>
