<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          日志管理
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row type="flex" justify="start" style="padding-top:10px">
            <Col :xs="24" :lg="12" :style="{marginBottom: '10px'}">
              <div  class="search-title" style="letter-spacing: 6px;margin-right:25px">时间</div>
              <DatePicker type="daterange" format="yyyy/MM/dd" placeholder="时间范围" style="width: 200px; float: left;" :editable="false" @on-change="timeChange"></DatePicker>
            </Col>
            <Col :xs="24" :lg="12">
              <div class="search-title"> 关键字</div>
              <Input  v-model="keyword" icon="ios-close-circle" @on-click="backKeyword" ref="search" placeholder="用户名/操作内容搜索" style="width: 200px; float: left;" @on-change="keywordChange()">
              </Input>
            </Col>
          </Row>
          </Col>
        </Row>
        <!--表格-->
        <div class="tableBox">
          <Table border size="small" :columns="columns" :data="dataTable" ></Table>
        </div>
        <!--分页-->
        <div class="pages-block">
          <div class="pages-right">
            <Page :total="total" :page-size="rows" @on-page-size-change="doPageSizeChange" @on-change="change" show-sizer show-total :page-size-opts="size"
                  ref="tablePage" show-elevator :transfer="true"></Page>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { workLog } from '../../api/api'
  export default {
    data () {
      return {
        keyword: '',
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          K: 'OPERATE_LOG',
          V: {
            pageNum: 1,
            pageSize: 10
          }
        },
        updateModal: {
          stationName: '',
          terminalId: '',
          launcherId: '',
          model: '',
          version: ''
        },
        columns:[
          {
            title: '序号',
            key: 'id',
            align: 'center'
          },
          {
            title: '用户名',
            key: 'userId',
            align: 'center'
          },
          {
            title: '操作',
            key: 'content',
            align: 'center'
          },
          {
            title: '操作结果',
            key: 'result',
            align: 'center',
            render: (h,params) => {
              let text = params.row.result === 1 ? '操作成功' : '操作失败'
              return h('div', text)
            }
          },
          {
            title: '时间',
            key: 'createTime',
            align: 'center'
          }
        ],
        dataTable:[]
      }
    },
    created: function () {
      this.getTableDatas(this.param)
    },
    methods: {
      // 日期格式转换-------------------
      formatDate (date) {
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        var newDate = y + '-' + m + '-' + d
        return newDate
      },
      timeChange (change) {
        if (change[0] !== '' && change[1] !== undefined) {
          this.param.V.beginTime = this.formatDate(new Date(change[0])) + ' 00:00:00'
          this.param.V.endTime = this.formatDate(new Date(change[1])) + ' 23:59:59'
        } else {
          this.param.V.beginTime = undefined
          this.param.V.endTime = undefined
        }
        this.param.V.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      backKeyword () {
        this.keyword = ''
        this.param.V.keyword = undefined
        this.param.V.pageSize = 10
        this.param.V.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      keywordChange () {
        this.param.V.keyword = this.keyword.trim()
        this.param.V.pageSize = 10
        this.param.V.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      // 查询公用方法
      getTableDatas: function (param) {
        let vm = this
        vm.$Loading.start()
        workLog(param).then((res) => {
          vm.$Loading.finish()
          if (res.data.R) {
            vm.dataTable = res.data.V.RESULT.list
            vm.total = res.data.V.RESULT.total
            vm.$refs.tablePage.currentPage = vm.page
          } else {
            vm.dataTable = []
            vm.total = 0
          }
        })
      },
      // 点击分页页码
      change (page) {
        this.page = page
        this.param.V.pageNum = this.page
        this.getTableDatas(this.param)
      },
      // 改变当前显示的行数
      doPageSizeChange: function (size) {
        this.rows = size
        this.param.V.pageSize = this.rows
        this.getTableDatas(this.param)
      }
    }
  }
</script>

<style scoped>
  .body {
    padding: 30px 30px 20px 30px;
    font-family:MicrosoftYaHei;
    text-align: center;
    color:#666;
  }
  .body-content {
    background: #fff;
    border-radius:13px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    padding-bottom:5px;
  }
  .tableBox{
    margin:10px;
    padding:20px;
    border:1px solid #eee;
    border-radius: 18px;
  }
</style>
