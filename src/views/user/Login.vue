<template>
  <div class="main">
    <a-form
        id="formLogin"
        ref="formLogin"
        class="user-layout-login"
        :form="form"
        @submit="handleSubmit"
    >
      <a-tabs
          :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
      >
        <a-tab-pane key="tab1" tab="学号/工号+密码登录">
          <a-form-item>
            <a-input
                size="large"
                type="text"
                placeholder="请输入学号/工号"
                v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入学号!' }, { validator: handleUsernameOrEmail }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
                size="large"
                placeholder="请输入密码"
                v-decorator="[
                'pass_word',
                {rules: [{ required: true, message: '请输入密码！' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <a-button
            style="width: 50%;"
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
        >登录
        </a-button>
        <router-link class="register" :to="{ name: 'register' }">还没有账户？点击注册</router-link>
      </a-form-item>
      <p class="footer"></p>
    </a-form>
  </div>
</template>

<script>
import md5 from 'md5'
import {login} from "@/api/user";

export default {
  name: 'Login',
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },

  methods: {
    Login(userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      if (value === undefined) {
        callback(new Error('请输入密码！'))
      }
      callback()
    },

    handleSubmit() {
      const {form: {validateFields}, Login} = this
      validateFields({force: true}, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const loginParams = {...values}
          loginParams.password = md5(values.password)
          Login(loginParams)
              .then((res) => this.login(res))
              .catch(err => this.requestFailed(err))
        }
      })
    },


    login(res) {
      res = res.data
      console.log(res)
      if (res.Code === 0) {
        this.$notification.success({
          message: res.Message,
          description: res.Data.UserID + '登录成功'
        })
        this.$router.push({path: '/'})
      } else {
        this.$notification['error']({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
    },

    requestFailed(err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
  }

  .login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .register {
    float: right;
    line-height: 40px;
  }
}
</style>
