<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          发射数量统计
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row type="flex" justify="start" style="padding:10px 0">
            <Col :sm="24" :lg="14" :style="{marginBottom: '10px'}">
              <div class="search-title" style="letter-spacing: 0">炮架名称</div>
              <regionGun @region="regionChange"></regionGun>
            </Col>
            <Col :sm="24" :lg="10" :style="{marginBottom: '10px'}">
              <div  class="search-title" style="letter-spacing: 0">作业时间</div>
              <DatePicker type="daterange" format="yyyy/MM/dd" placeholder="请选择时间范围" style="width: 200px;float: left" clearable :editable="false" @on-change="timeChange" ></DatePicker>
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
            <Page :total="total" :page-size="rows" @on-page-size-change="doPageSizeChange" @on-change="change" show-sizer show-total :page-size-opts="size"  ref="tablePage" show-elevator :transfer="true"></Page>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-model="addModel"
      title="详情"
      ok-text="关闭"
      cancel-text=" "
      @on-ok="okAdd"
      @on-cancel="" width="900">
      <Form :model="updateModal"   ref="updateModal">
        <Row type="flex" justify="center">
          <Col span="24">
          <Table border size="small" :columns="columnsM" :data="dataTableM" ></Table>
          <div class="pages-block">
            <div class="pages-right">
              <Page :total="totalM" :page-size="rowsM" @on-page-size-change="doPageSizeChangeM" @on-change="changeM" show-sizer show-total :page-size-opts="sizeM"
                     show-elevator :transfer="true" ></Page>
            </div>
          </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { Launch } from '../../api/api'
  import regionGun from '../../components/regionGun'
  export default {
    components: {
      regionGun
    },
    data () {
      return {
        stationId: '',
        columnsM:[
          {
            title: '终端编号',
            key: 'terminalId',
            width: 120,
            align: 'center'
          },
          {
            title: '炮架名称',
            key: 'rocketName',
            align: 'center'
          },
          {
            title: '方位角度',
            key: 'directionId',
            width: 100,
            align: 'center'
          },
          {
            title: '高低角度',
            key: 'heightId',
            width: 100,
            align: 'center'
          },
          {
            title: '发射弹数(单位:枚)',
            key: 'count',
            width: 150,
            align: 'center'
          },
          {
            title: '时间',
            key: 'launchTime',
            align: 'center'
          }
        ],
        dataTableM:[],
        sizeM: [10, 20, 30, 40, 50],
        totalM: 0,
        pageM: 1,
        rowsM: 10,
        paramM: {
          pageNum: 1,
          pageSize: 10
        },
        param: {
          pageNum: 1,
          pageSize: 10
        },
        updateModal: {},
        addModel: false,
        typeList: [],
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        columns:[
          {
            title: '站名',
            key: 'stationName',
            align: 'center'
          },
          {
            title: '地址',
            key: 'address',
            align: 'center'
          },
          {
            title: '终端编号',
            key: 'terminalId',
            align: 'center'
          },
          {
            title: '炮架名称',
            key: 'rocketName',
            align: 'center'
          },
          {
            title: '发射弹数(单位:枚)',
            key: 'launchCount',
            align: 'center'
          },
          {
            title: '作业日期',
            key: 'work_time',
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    color: '#00B9D3'
                  },
                  on: {
                    click: () => {
                      this.check(params.row)
                    }
                  }
                }, '详情')])
            }
          }
        ],
        dataTable:[]
      }
    },
    methods: {
      check (row) {
        this.addModel = true
        this.paramM.terminalId = row.terminalId
        this.paramM.startCount = row.startCount
        this.getTableDatasM(this.paramM)
      },
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
          this.param.beginTime = this.formatDate(new Date(change[0]))+ ' 00:00:00'
          this.param.endTime = this.formatDate(new Date(change[1]))+ ' 00:00:00'
        } else {
          this.param.beginTime = ''
          this.param.endTime = ''
        }
        this.param.pageSize = 10
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      // 查询公用方法
      getTableDatasM: function (param) {
        let vm = this
        vm.$Loading.start()
        let par = {
          K: 'GET_EXACT_LAUNCH_RESULT',
          V: param
        }
        Launch(par).then((res) => {
          vm.$Loading.finish()
          if (res.data.R) {
            vm.dataTableM = res.data.V.RESULT.list
            vm.totalM = res.data.V.RESULT.total
            // vm.$refs.tablePage.currentPage = vm.page
          } else {
            vm.dataTableM = []
            vm.totalM = 0
          }
        })
      },
      // 点击分页页码
      changeM (page) {
        this.pageM = page
        this.paramM.pageNum = this.pageM
        this.getTableDatasM(this.paramM)
      },
      // 改变当前显示的行数
      doPageSizeChangeM: function (size) {
        this.rowsM = size
        this.paramM.pageSize = this.rows
        this.getTableDatasM(this.paramM)
      },
      // 添加用户
      okAdd () {
      },
      cancelAdd () {
        this.$Message.error('取消!')
      },
      // 区域---------------------------------------------------------------------------------------------
      regionChange (data) {
        if (data !== '' && data !== undefined && data[data.length - 1] !== undefined) {
          if (data.length > 0 && data.length < 5) {
            this.param.addressId = data[data.length - 1].value
            delete this.param.terminalId
          } else if (data.length === 5 && data[data.length - 2]!== undefined) {
            this.param.addressId = data[data.length - 2].value
            this.param.terminalId = data[data.length - 1].value
          } else if (data.length === 5 && data[data.length - 2] === undefined) {
            this.param.addressId = parseInt(sessionStorage.getItem('stationId'))
            this.param.terminalId = data[data.length - 1].value
          } else {
            this.param.addressId = ''
            delete this.param.terminalId
          }
        }
        this.param.pageSize = 10
        this.param.pageNum = 1
        this.page = 1
        this.getTableDatas(this.param)
      },
      searchLanuch (data) {
        if (data !== '' && data!== undefined) {
          this.param.terminalId = data
        } else {
          delete this.param.terminalId
        }
        this.param.pageSize = 10
        this.param.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      // 查询公用方法
      getTableDatas: function (param) {
        let vm = this
        vm.$Loading.start()
        let par = {
          K: 'GET_ALL_LAUNCH_TOTAL_COUNT',
          V: param
        }
        Launch(par).then((res) => {
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
        this.param.pageNum = this.page
        this.getTableDatas(this.param)
      },
      // 改变当前显示的行数
      doPageSizeChange: function (size) {
        this.rows = size
        this.param.pageSize = this.rows
        this.getTableDatas(this.param)
      }
    },
    created:function () {
      this.getTableDatas(this.param)
    }
  }
</script>

<style scoped>
  .body {
    padding: 30px 30px 20px 30px;
    font-family:MicrosoftYaHei;
    text-align: center;
    color:#666;
    min-width: 1366px;
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
  .notice{
    color:red;
    margin-left: 5px;
  }
</style>
