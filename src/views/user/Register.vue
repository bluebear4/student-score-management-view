<template>
  <div class="main user-layout-register">
    <a-form ref="formRegister" :form="form" id="formRegister">
      <a-form-item>
        <a-tabs
            default-active-key="3"
            @change="onchange"
            :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        >
          <a-tab-pane key="3" tab="学生注册"/>
          <a-tab-pane key="2" tab="教师注册"/>
        </a-tabs>
      </a-form-item>
      <a-form-item>
        <a-input
            size="large"
            type="text"
            placeholder="请输入工号/学号"
            v-decorator="['id', {rules: [{ required: true, message: '请输入学号/工号！' }], validateTrigger: ['change', 'blur']}]"
        ></a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
            size="large"
            placeholder='请至少输入 6 个字符。'
            v-decorator="['pass_word', {rules: [{ required: true, message: '请输入密码！' }], validateTrigger: ['change', 'blur']}]"
        ></a-input-password>
      </a-form-item>

      <a-form-item>
        <a-input-password
            size="large"
            placeholder="确认密码"
            v-decorator="['password2', {rules: [{ required: true, message: '请输入密码！' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
        ></a-input-password>
      </a-form-item>

      <a-form-item>
        <a-input size="large" v-decorator="['verify_code']" addon-before="验证码" :placeholder="placeholder"/>
      </a-form-item>

      <a-form-item>
        <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="register-button"
            @click.stop.prevent="handleSubmit"
            >注册
        </a-button>
        <router-link class="login" :to="{ name: 'login' }">使用已有账户登录</router-link>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import md5 from 'md5'
import {register} from '@/api/user'

export default {
  name: 'Register',
  data() {
    return {
      form: this.$form.createForm(this),
      placeholder: '不填即可',
      role_id: 3
    }
  },
  methods: {
    Register(userInfo) {
      return new Promise((resolve, reject) => {
        register(userInfo).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    handlePasswordCheck(rule, value, callback) {
      const password = this.form.getFieldValue('pass_word')
      if (value === undefined) {
        callback(new Error(this.$t('user.password.required')))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error(this.$t('user.password.twice.msg')))
      }
      callback()
    },

    handleSubmit() {
      const {form: {validateFields}, Register} = this
      validateFields({force: true}, (err, values) => {
        if (!err) {
          const registerParams = {...values}
          delete registerParams.password2
          registerParams.pass_word = md5(registerParams.pass_word)
          registerParams.role_id = this.role_id
          console.log('register form', registerParams)
          Register(registerParams)
              .then((res) => this.register(res))
              .catch(err => this.requestFailed(err))
        }
      })
    },

    register(res) {
      res = res.data
      console.log(res)
      if (res.Code === 0) {
        this.$notification.success({
          message: res.Message,
          description: res.Data.UserID + '注册成功'
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
    },

    onchange(activeKey) {
      this.placeholder = activeKey === '3' ? '不填即可' : '详询管理员'
      this.role_id = parseInt(activeKey)
    }
  }
}
</script>
<style lang='less'>
.user-layout-register {
  .ant-input-group-addon:first-child {
    background-color: #fff;
  }
}
</style>
<style lang='less' scoped>
.user-layout-register {

  & > h3 {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .register-button {
    width: 50%;
  }

  .login {
    float: right;
    line-height: 40px;
  }
}
</style>
