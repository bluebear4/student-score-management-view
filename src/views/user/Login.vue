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
                'id',
                {rules: [{ required: true, message: '请输入学号/工号!' }, { validator: handleUsernameOrEmail }], validateTrigger: 'blur'}
              ]"
            >
              <template v-slot:prefix="">
                <a-icon type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </template>
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
              <template v-slot:prefix="">
                <a-icon type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </template>
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
    </a-form>
  </div>
</template>

<script>
import md5 from 'md5'
import {Login} from "@/api/user";
import Cookie from "js-cookie";

export default {
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },

  methods: {
    handleUsernameOrEmail(rule, value, callback) {
      if (value === undefined) {
        callback(new Error('请输入密码！'))
      }
      callback()
    },

    handleSubmit(e) {
      e.preventDefault()
      const {form: {validateFields}} = this
      validateFields({force: true}, (err, values) => {
        if (!err) {
          console.log('login form', values)
          const loginParams = {...values}
          loginParams.pass_word = md5(loginParams.pass_word)
          Login(loginParams, this.loginSuccess)
        }
      })
    },

    loginSuccess(res) {
      res = res.data
      console.log(res)
      if (res.Code === 0) {
        Cookie.set('role', res.Data.Role_id, {expires: 1})
        location.reload();
      } else {
        this.$notification.error({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
    },

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
