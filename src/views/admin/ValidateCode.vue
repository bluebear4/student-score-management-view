<template>
  <div style="display: inline-block">
    <a-tabs
        v-model="role_id"
        @change="role_id_change"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
    >
      <a-tab-pane key="2" tab="教师验证码"/>
      <a-tab-pane key="3" tab="学生验证码"/>
    </a-tabs>
    <a-input
        class="teacher"
        style="width: 80%"
        :addonBefore="code_before"
        size="large"
        v-model="validate_code[role_id]"
        :default-value="validate_code[role_id]"
    >
    </a-input>
    <a-button
        size="large"
        @click="submit"
    >修改
    </a-button>
  </div>
</template>
<script>


import {ChangeValidateCode, GetValidateCode} from "@/api/admin";

export default {
  data() {
    GetValidateCode({role_id: '2'}, (res) => this.getCodeSuccess(res, '2'), this);
    GetValidateCode({role_id: '3'}, (res) => this.getCodeSuccess(res, '3'), this);
    this.$emit('getKey', ['3']);
    return {
      role_id: '2',
      code_before: '教师验证码',
      validate_code: [],
    };
  },
  methods: {
    getCodeSuccess(res, id) {
      const {validate_code} = this;
      res = res.data
      if (res.Code === 0) {
        validate_code[id] = res.Data.ValidateCode;
      } else {
        this.$notification['error']({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
    },
    role_id_change(key) {
      switch (key) {
        case '2':
          this.code_before = '教师验证码'
          break;
        case '3':
          this.code_before = '学生验证码'
          break;
      }
      this.role_id = key
    },
    submit() {
      const {role_id, validate_code, changeCodeSuccess} = this;
      console.log(role_id, validate_code)
      ChangeValidateCode({role_id: parseInt(role_id), validate_code: validate_code[role_id]}, this, changeCodeSuccess)
    },
    changeCodeSuccess(res) {
      res = res.data
      if (res.Code === 0) {
        this.$notification.success({
          message: '成功',
          description: '修改成功',
        })
      } else {
        this.$notification.error({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
    },
  },
};
</script>
