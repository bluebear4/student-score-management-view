<template>
  <div class="layout-content">
    <a-table :columns="columns" :data-source="rows"
             :rowKey="(record)=>{return record.user_id+record.subject}"
             :pagination="{defaultPageSize:7}"
             bordered
    />
  </div>
</template>
<script>
import {GetScores} from "@/api/student";


export default {

  data() {
    this.$emit('getKey', ['1']);
    GetScores(this.handleData, this);
    return {
      rows: [],
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '科目',
          dataIndex: 'subject',
          key: 'subject',
          onFilter: (value, record) => record.subject === value,
        },
        {
          title: '分数',
          dataIndex: 'score',
          key: 'score',
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
      ],
    };
  },
  methods: {
    handleData(res) {
      res = res.data
      if (res.Code === 0) {
        this.rows = res.Data.scores
        this.columns[1].filters = []
        for (const v of res.Data.scores) {
          if (v.subject !== '') {
            if (this.columns[1].filters.findIndex(filter => filter.text === v.subject) === -1) {
              this.columns[1].filters.push({text: v.subject, value: v.subject})
            }
          }
        }
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
