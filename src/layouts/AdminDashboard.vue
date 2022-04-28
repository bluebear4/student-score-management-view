<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" :collapsible="true">
      <div class="logo" :style="logoStyle"/>
      <a-menu theme="dark" mode="inline" @select="select"
              :selected-keys="selectKeys"
              class="menu">
        <a-menu-item key="1">
          <a-icon type="user"/>
          <span>学生信息</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="file-search"/>
          <span>学生成绩</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="edit"/>
          <span>注册验证码</span>
          <a-modal :visible="validateCode"
                   title="修改验证码"
                   @cancel="()=>handleCancel(3)"
                   footer=""
          >
            <div style="margin: 0 auto;text-align: center">
              <ValidateCode/>
            </div>
          </a-modal>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout style="max-height: 800px;">
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="click"
        />
        <div class="header-right">
          <a-tag color="green">当前身份：管理员</a-tag>
          <a-dropdown>
            <a-button type="primary" shape="circle" @click.prevent>
              <a-icon type="user"/>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:" @click="()=>showModal(1)">登出用户</a>
                  <a-modal :visible="visible" title="提示" @cancel="()=>handleCancel(1)">
                    <p>确定要登出用户吗</p>
                    <template #footer>
                      <a-button @click="()=>handleCancel(1)">取消</a-button>
                      <a-button type="primary" @click="()=>handleOk(1)">确定</a-button>
                    </template>
                  </a-modal>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:" @click="()=>showModal(2)">修改密码</a>
                  <a-modal :visible="changePassword"
                           title="修改密码"
                           @cancel="()=>handleCancel(2)"
                  >
                    <a-form :form="form">
                      <a-form-item>
                        <a-input-password
                            size="large"
                            type="text"
                            placeholder="请输入旧密码"
                            v-decorator="['old_pass_word',
                            {rules: [{ required: true, message: '请输入旧密码!' }],  validateTrigger: 'blur'}]">
                          <template v-slot:prefix="">
                            <a-icon type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                          </template>
                        </a-input-password>
                      </a-form-item>
                      <a-form-item>
                        <a-input-password
                            size="large"
                            placeholder="请输入新密码"
                            v-decorator="['new_pass_word',
                            {rules: [{ required: true, message: '请输入新密码！' }], validateTrigger: 'blur'}]">
                          <template v-slot:prefix="">
                            <a-icon type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                          </template>
                        </a-input-password>
                      </a-form-item>
                    </a-form>
                    <template #footer>
                      <a-button @click="()=>handleCancel(2)">取消</a-button>
                      <a-button type="primary" @click="()=>handleOk(2)">提交</a-button>
                    </template>
                  </a-modal>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:" @click="()=>showModal(3)">修改验证码</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="layout-content">
        <router-view @getKey="showKey"/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import Cookie from "js-cookie";
import {ChangePassword, Logout} from "@/api/student";
import md5 from "md5";
import ValidateCode from "@/components/ValidateCode";

export default {
  name: 'DashBoard',
  components: {
    ValidateCode,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      selectKeys: ['1'],
      visible: false,
      changePassword: false,
      validateCode: false,
      collapsed: false,
      logoStyle: {
        height: '170px',
      }
    };
  },
  methods: {
    showKey(val) {
      this.selectKeys = val;
    },
    select({selectedKeys}) {
      switch (selectedKeys[0]) {
        case '1':
          this.$router.push({name: 'admin-info'});
          break;
        case '2':
          this.$router.push({name: 'admin-getScores'});
          break;
        case '3':
          this.showModal(3);
          break;
      }
    },


    showModal(val) {
      switch (val) {
        case 1:
          this.visible = true;
          break;
        case 2:
          this.changePassword = true;
          break;
        case 3:
          this.validateCode = true;
          break;
      }
    },
    handleCancel(val) {
      switch (val) {
        case 1:
          this.visible = false;
          break;
        case 2:
          this.changePassword = false;
          break;
        case 3:
          this.validateCode = false;
          break;
      }
    },
    handleOk(val) {
      const {form: {validateFields}} = this
      switch (val) {
        case 1:
          this.visible = false;
          Logout(this.logoutSuccess, this)
          break;
        case 2:
          this.changePassword = false;
          validateFields({force: true}, (err, values) => {
            if (!err) {
              const params = {...values}
              delete params.new_pass_word2
              params.old_pass_word = md5(params.old_pass_word)
              params.new_pass_word = md5(params.new_pass_word)
              console.log(params)
              ChangePassword(params, this.changeSuccess, this)
            }
          })
          break;
      }
    },


    logoutSuccess(res) {
      res = res.data
      console.log(res)
      if (res.Code === 0) {
        Cookie.remove('Auth')
        Cookie.remove('role')
        this.$router.push('/')
        setTimeout(() => {
          this.$notification.success({
            message: res.Message,
            description: '登出成功'
          })
        }, 200)
      } else {
        this.$notification.error({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
    },

    changeSuccess(res) {
      res = res.data
      if (res.Code === 0) {
        setTimeout(() => {
          this.$notification.success({
            message: res.Message,
            description: '修改成功'
          })
        }, 200)
      } else {
        this.$notification.error({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
    },

    click() {
      if (this.collapsed) {
        this.logoStyle.height = '170px';
      } else {
        this.logoStyle.height = '45px';
      }
      this.collapsed = !this.collapsed
    }
  }
};
</script>
<style>
#components-layout-demo-custom-trigger {
  height: 100vh;
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .header-right {
  float: right;
  padding: 0 24px;
  cursor: pointer;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  background: url(~@/assets/logo.png) no-repeat;
  background-size: 100% 100%;
  margin: 16px;
}

.layout-content {

  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
  max-height: 800px;
}
</style>
