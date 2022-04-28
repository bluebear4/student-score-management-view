<template>
  <div style="display: inline-block">
    <a-spin :spinning="loading!==2">
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
      >
      </a-input>
      <a-button
          size="large"
          @click="submit"
      >修改
      </a-button>
      <a-alert
          style="margin-top: 5px;width: 98%"
          :message="`当前角色验证码为: ${validate_code_cache[role_id]}`" type="success"/>
    </a-spin>

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
      validate_code_cache: [],
      loading: 0,
    };
  },
  methods: {
    getCodeSuccess(res, id) {
      res = res.data
      let t = this.validate_code.concat([])
      if (res.Code === 0) {
        t[id] = res.Data.ValidateCode;
        this.validate_code = t;
        this.validate_code_cache = JSON.parse(JSON.stringify(this.validate_code));
        this.loading++;
      } else {
        this.$notification.error({
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
      ChangeValidateCode({role_id: parseInt(role_id), validate_code: validate_code[role_id]}, changeCodeSuccess, this)
    },
    changeCodeSuccess(res) {
      res = res.data
      if (res.Code === 0) {
        this.$notification.success({
          message: '成功',
          description: '修改成功',
        })
        this.validate_code_cache = JSON.parse(JSON.stringify(this.validate_code));
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
