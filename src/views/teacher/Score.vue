<template>
  <div>
    <a-button type="primary" size="large"
              style="margin-bottom: 25px"
              v-if="addView"
              @click="add"
    >新增学生成绩
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
        点击或拖拽上传学生成绩文件（xls,xlsx）
      </a-button>
    </a-upload>
    <a-tooltip v-if="addView">
      <template v-slot:title="">
        将导入Sheet1的前四列数据（学号|姓名|科目|分数）
      </template>
      <a-icon type="question-circle" theme="twoTone" style="margin-left: 3px; font-size: 20px "/>
    </a-tooltip>
    <div v-else>
      <a-form :form="form">
        <a-form-item v-for="col in [0, 1, 2, 3]" :key="columns[col].key"
                     style="display: inline-flex;margin-left: 5px;margin-bottom: 8px;">
          <a-input
              v-if="col !== 3"
              v-decorator="[columns[col].key, {rules: [{ required: true, message: '请输入'+columns[col].title+'!' }], validateTrigger: 'blur'}]"
              size="large"
              style="width: 250px"
              :placeholder="'请输入'+columns[col].title"
          />
          <a-input-number
              v-if="col === 3"
              v-decorator="[columns[col].key, {rules: [{ required: true, message: '请输入'+columns[col].title+'!' }], validateTrigger: 'blur'}]"
              size="large"
              style="width: 150px"
              :placeholder="'请输入'+columns[col].title"
          />
        </a-form-item>
        <a-button type="primary" size="large" htmlType="submit"
                  style="margin-left: 20px;"
                  @click.stop.prevent="addSubmit"
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
    <div style="margin-bottom: 25px; float: right">
      <a-select
          show-search
          placeholder="选择一个班级"
          option-filter-prop="children"
          style="width: 240px;margin-right: 5px"
          size="large"
          :filter-option="filterOption"
          @change="(value)=>this.selectClass=value"
          defaultValue=""
          v-if="addView"
      >
        <a-select-option value="">
          选择全部
        </a-select-option>
        <a-select-option v-for="item in this.classes" :value="item" :key="item">
          {{ item }}
        </a-select-option>
      </a-select>
      <a-button style=""
                type="primary"
                size="large"
                v-if="addView"
                @click="handleSubmit"> 获取
      </a-button>
    </div>
    <a-table :columns="columns" :data-source="data"
             :rowKey="(record)=>{return record.user_id+record.subject}"
             :pagination="{defaultPageSize:7}"
             bordered>
      <template
          v-for="col in ['user_id','name', 'subject','score']"
          v-slot:[col]="text, record"
      >
        <div :key="col">
          <a-input-number
              v-if="record.editable && col === 'score'"
              style="margin: -5px 0"
              :value="record.score"
              @change="value => handleChange(value, record.key, col)"
              :disabled="col !== 'score'"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template v-slot:operation="text, record">
        <div>
        <span v-if="record.editable">
          <a @click="() => commit(record.key)" style="float:left;margin-right: 8px;">保存</a>
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
                        @confirm="() => delScore(record)">
            <a-button type="danger" :style="{display:editingKey === ''?'inline':'none'}">删除</a-button>
          </a-popconfirm>
        </span>
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>
import {GetScoresByClass, GetClasses, UpdateScore, DeleteScore, AddScore, UploadScore} from "@/api/teacher";
import {requestFailed} from "@/api/request";


export default {
  data() {
    this.$emit('getKey', ['2']);
    GetClasses(this.handleClasses, this);
    return {
      form: this.$form.createForm(this),
      data: [],
      columns: [
        {
          title: '学号',
          dataIndex: 'user_id',
          key: 'user_id',
          scopedSlots: {customRender: 'user_id'},
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
          title: '科目',
          dataIndex: 'subject',
          key: 'subject',
          scopedSlots: {customRender: 'subject'},
          onFilter: (value, record) => record.subject === value,
        },
        {
          title: '分数',
          dataIndex: 'score',
          key: 'score',
          scopedSlots: {customRender: 'score'},
          filters: [
            {
              text: '90分以上',
              value: '0',
            },
            {
              text: '80分到90分',
              value: '1',
            },
            {
              text: '70分到80分',
              value: '2',
            },
            {
              text: '60分到70分',
              value: '3',
            },
            {
              text: '60分(不含)以下',
              value: '4',
            },
          ],
          onFilter: (value, record) => {
            let segments = []
            segments['0'] = [90, Infinity]
            segments['1'] = [80, 90]
            segments['2'] = [70, 80]
            segments['3'] = [60, 70]
            segments['4'] = [-Infinity, 60]
            return record.score >= segments[value][0] && record.score < segments[value][1]
          },
          sorter: (a, b) => parseInt(a.score) - parseInt(b.score),
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: {customRender: 'operation'},
        },
      ],
      editingKey: '',
      deleteKey: '',
      selectClass: '',
      classes: [],
      cacheData: [],
      addView: true,
      loading: false,
    };
  },
  methods: {
    reloadFilter() {
      this.columns[2].filters = []
      for (const v of this.data) {
        if (v.subject !== '') {
          if (this.columns[2].filters.findIndex(filter => filter.text === v.subject) === -1) {
            this.columns[2].filters.push({text: v.subject, value: v.subject})
          }
        }
      }
    },
    handleClasses(res) {
      res = res.data
      if (res.Code === 0) {
        this.classes = res.Data.classes
      } else {
        this.$notification.error({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
    },
    handleSubmit() {
      const {selectClass, handleData} = this;
      GetScoresByClass({class: selectClass}, handleData, this)
    },
    handleData(res) {
      res = res.data
      if (res.Code === 0) {
        res.Data.scores.forEach((record) => record.key = record.user_id + record.subject)
        this.data = res.Data.scores
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
        console.log(value, key, column)
        target[column] = value;
        this.data = newData;
      }
    },

    commit(key) {
      const newData = [...this.data];
      const target = newData.find(item => key === item.key);
      if (target) {
        UpdateScore(target, this.handleSave, this, (err) => {
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

    delScore(record) {
      this.deleteKey = record.user_id + record.subject;
      DeleteScore({user_id: record.user_id, subject: record.subject}, this.deleteSuccess, this)
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
    filterOption(input, option) {
      return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },

    add() {
      this.addView = !this.addView;
    },
    addSubmit() {
      const {form: {validateFields}} = this
      validateFields({force: true}, (err, values) => {
        if (!err) {
          const addScoreParams = {...values}
          addScoreParams.score = parseInt(addScoreParams.score)
          AddScore(addScoreParams, (res) => {
            this.addScoreSuccess(res)
            addScoreParams.key = addScoreParams.user_id + addScoreParams.subject
            res = res.data
            if (res.Code === 0) {
              this.data.push(addScoreParams)
              this.cacheData.push(addScoreParams)
            }
          }, this)
        }
      })
    },
    addScoreSuccess(res) {
      res = res.data
      if (res.Code === 0) {
        this.$notification.success({
          message: '成功',
          description: '新增信息成功'
        })

      } else {
        this.$notification.error({
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
      return UploadScore(file, this.uploadSuccess, this, (err) => {
        requestFailed(err)
        this.loading = true
      })
    },
    uploadSuccess(res) {
      res = res.data
      if (res.Code === 0) {
        this.handleSubmit()
        setTimeout(() => {
              this.$notification.success({
                message: '成功',
                description: `上传成功 ${res.Data.SuccessCount} 条成绩,上传失败 ${res.Data.FailCount} 条成绩`
              })
            }, 500
        )
      } else {
        this.$notification.error({
          message: '错误',
          description: res.Message,
          duration: 4
        })
      }
      this.loading = false
    },
  },
};
</script>
