<template>
  <div>
    <a-button type="primary" size="large"
              style="margin-bottom: 25px"
              v-if="addView"
              @click="add"
    >新增学生信息
    </a-button>
    <a-upload
        v-if="addView"
        name="file"
        @change="handleChange"
        :before-upload="beforeUpload"
        :show-upload-list="false"
        :action="upload"
    >
      <a-button :loading="loading" icon="upload" style="margin-left: 5px;" type="dashed" size="large">
        点击或拖拽上传学生信息文件（xls,xlsx）
      </a-button>
    </a-upload>
    <a-tooltip v-if="addView">
      <template v-slot:title="">
        将导入Sheet1的前三列数据（学号|姓名|班级）
      </template>
      <a-icon type="question-circle" theme="twoTone" style="margin-left: 3px; font-size: 20px "/>
    </a-tooltip>
    <div v-else>
      <a-form :form="form">
        <a-form-item v-for="col in [0, 1, 2]" :key="columns[col].key"
                     style="display: inline-flex;margin-left: 5px;margin-bottom: 8px;">
          <a-input
              v-decorator="[columns[col].key, {rules: [{ required: true, message: '请输入'+columns[col].title+'!' }], validateTrigger: 'blur'}]"
              size="large"
              style="width: 300px"
              :placeholder="'请输入'+columns[col].title"
          />
        </a-form-item>
        <a-button type="primary" size="large" htmlType="submit"
                  style="margin-left: 20px;"
                  @click.stop.prevent="handleSubmit"
        >提交
        </a-button>
        <a-popconfirm title="确定要放弃保存吗？" @confirm="add" ok-text="我确定" cancel-text="点错了">
          <a-button type="danger" size="large"
                    style="margin-left: 10px;"
          >取消
          </a-button>
        </a-popconfirm>
      </a-form>
    </div>

    <a-table :columns="columns" :data-source="data"
             :rowKey="(record)=>{return record.user_id}"
             :pagination="{defaultPageSize:7}"
             bordered>
      <template
          v-for="col in ['user_id','name', 'class']"
          v-slot:[col]="text, record"
      >
        <div :key="col">
          <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, col)"
              :disabled="col === 'user_id'"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template v-slot:operation="text, record">
        <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => commit(record.key)">保存</a>
          <a-popconfirm title="确定要放弃保存吗？" @confirm="() => cancel(record.key)"
                        ok-text="我确定" cancel-text="点错了">
            <a>取消</a>
          </a-popconfirm>
        </span>
          <span v-else>
          <a-button type="primary" :disabled="editingKey !== ''" @click="() => edit(record.key)">修改</a-button>
        </span>

          <span style="{float:right;padding-inline-start: 15px;}">
          <a-popconfirm title="确定要删除吗？" ok-text="我确定" cancel-text="点错了"
                        @confirm="() => delInfo(record.key)">
            <a-button type="danger" :style="{display:editingKey === ''?'inline':'none'}">删除</a-button>
          </a-popconfirm>
        </span>
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>

import {UploadInfo, AddInfo, DeleteInfo, GetInfos, UpdateInfo} from "@/api/teacher";
import {requestFailed} from "@/api/request";

export default {
  data() {
    this.$emit('getKey', ['1']);
    GetInfos(this.getInfosSuccess,this);
    return {
      form: this.$form.createForm(this),
      data: [],
      columns: [
        {
          title: '学号',
          dataIndex: 'user_id',
          scopedSlots: {customRender: 'user_id'},
          key: 'user_id',
          sorter: (a, b) => parseInt(a.user_id) - parseInt(b.user_id),
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: {customRender: 'name'},
        },
        {
          title: '班级',
          dataIndex: 'class',
          key: 'class',
          scopedSlots: {customRender: 'class'},
          onFilter: (value, record) => record.class === value,
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {customRender: 'operation'},
        },
      ],
      editingKey: '',
      deleteKey: '',
      cacheData: [],
      addView: true,
      loading: false,
    };
  },
  methods: {
    reloadFilter() {
      this.columns[2].filters = []
      for (const v of this.data) {
        if (v.class !== '') {
          if (this.columns[2].filters.findIndex(filter => filter.text === v.class) === -1) {
            this.columns[2].filters.push({text: v.class, value: v.class})
          }
        }
      }
    },
    getInfosSuccess(res) {
      res = res.data
      if (res.Code === 0) {
        res.Data.infos.forEach((record) => record.key = record.user_id)
        this.data = res.Data.infos
        this.cacheData = this.data.map(item => ({...item}));
        this.reloadFilter();
      } else {
        this.$notification.error({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
    },

    delInfo(user_id) {
      this.deleteKey = user_id;
      DeleteInfo({user_id: user_id}, this.deleteSuccess, this)
    },
    deleteSuccess(res) {
      res = res.data
      if (res.Code === 0) {
        this.data.splice(this.data.findIndex(item => this.deleteKey === item.key), 1)
        this.cacheData = this.data.map(item => ({...item}));
        this.reloadFilter();
        this.$notification.success({
          message: '成功',
          description: res.Message,
        })
      } else {
        this.$notification.error({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
      this.deleteKey = '';
    },

    edit(key) {
      const newData = [...this.data];
      const target = newData.find(item => key === item.key);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.find(item => key === item.key);
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },

    commit(key) {
      const newData = [...this.data];
      const target = newData.find(item => key === item.key);
      if (target) {
        UpdateInfo(target, this.handleSave, this, (err) => {
          this.cancel(this.editingKey)
          requestFailed(err)
        })
        this.reloadFilter();
      }
    },
    handleSave(res) {
      res = res.data
      if (res.Code === 0) {
        this.save(this.editingKey)
        this.$notification.success({
          message: '成功',
          description: res.Message,
        })
      } else {
        this.cancel(this.editingKey)
        this.$notification.error({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.find(item => key === item.key);
      if (target) {
        delete target.editable;
        this.data = newData;
        const targetCache = newCacheData.find(item => key === item.key);
        if (targetCache) {
          Object.assign(targetCache, target);
          this.cacheData = newCacheData;
        }
      }
      this.editingKey = '';
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.find(item => key === item.key);
      if (target) {
        Object.assign(target, this.cacheData.find(item => key === item.key));
        delete target.editable;
        this.data = newData;
      }
      this.editingKey = '';
    },

    add() {
      this.addView = !this.addView;
    },
    handleSubmit() {
      const {form: {validateFields}} = this
      validateFields({force: true}, (err, values) => {
        if (!err) {
          console.log('values ', values)

          const addInfoParams = {...values}
          console.log('addInfo form', addInfoParams)
          AddInfo(addInfoParams, (res) => {
            this.addInfoParamsSuccess(res)
            addInfoParams.key = addInfoParams.user_id
            res = res.data
            if (res.Code === 0) {
              this.data.push(addInfoParams)
              this.cacheData.push(addInfoParams)
            }
          }, this)
        }
      })
    },
    addInfoParamsSuccess(res) {
      res = res.data
      if (res.Code === 0) {
        this.$notification.success({
          message: '成功',
          description: '新增信息成功'
        })

      } else {
        this.$notification['error']({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
    },

    handleFile(info) {
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file) {
      //文件类型判断
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel") {
        //只允许上传excel格式的文件
        return true
      } else {
        this.$message.error('请选择表格类型文件！');
        return false
      }
    },
    upload(file) {
      this.loading = true
      console.log(file)
      return UploadInfo(file, this.uploadSuccess, this, (err) => {
        requestFailed(err)
        this.loading = true
      })
    },
    uploadSuccess(res) {
      res = res.data
      if (res.Code === 0) {
        this.$notification.success({
          message: '成功',
          description: `上传成功 ${res.Data.SuccessCount} 条信息,上传失败 ${res.Data.FailCount} 条信息`
        })
        if (res.Data.SuccessCount > 0) {
          setTimeout(() => location.reload(), 500);
        }
      } else {
        this.$notification['error']({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
      this.loading = false
    },
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
