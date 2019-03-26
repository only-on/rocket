<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          作业位置信息统计
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row type="flex" justify="start" style="margin-top: 10px">
            <Col :sm="24" :lg="14" :style="{marginBottom: '10px'}">
              <div class="search-title" style="letter-spacing: 0"> 炮架编号</div>
              <regionGun @region="regionChange"></regionGun>
            </Col>
            <Col :sm="24" :lg="10" :style="{marginBottom: '10px'}">
              <div  class="search-title" style="letter-spacing: 0">作业时间</div>
              <Select  style="width:270px;float:left" placeholder="作业时间" @on-change="selectTime"  clearable v-model="workTime" :label-in-value="true">
                <Option v-for='(items, index) in timeList' :value='items' :key="index">{{items}}</Option>
              </Select>
            </Col>
          </Row>
          </Col>
        </Row>
        <!--表格-->
        <div class="tableBox">
          <Table border size="small" :columns="columns" :data="dataTable" :no-data-text="noDataText"></Table>
        </div>
        <!--分页-->
        <div class="pages-block">
          <div class="pages-right">
            <Page :total="total" :page-size="rows" @on-page-size-change="doPageSizeChange" @on-change="change" show-sizer show-total :page-size-opts="size"                    ref="tablePage" show-elevator :transfer="true"></Page>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Location, getRegion } from '../../api/api'
  import regionGun from '../../components/regionGun'
  export default {
    components: {
      regionGun
    },
    data () {
      return {
        workTime: '',
        timeList: [],
        width: '',
        addressId: '',
        typeList: [],
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          pageNum: 1,
          pageSize: 10
        },
        noDataText: '请先选择炮架名称',
        columns:[
          {
            title: '终端编号',
            key: 'terminalId',
            align: 'center'
          },
          {
            title: '炮架名称',
            key: 'terminalName',
            align: 'center'
          },
          {
            title: '经度',
            key: 'x',
            align: 'center'
          },
          {
            title: '纬度',
            key: 'y',
            align: 'center'
          },
          {
            title: '时间',
            key: 'time',
            align: 'center'
          }
        ],
        dataTable:[]
      }
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
      // 作业时间
      selectTime (data) {
        if (data !== '' && data !== undefined) {
          this.param.beginTime = data.value + ' 00:00:00'
        } else {
          this.param.beginTime = ''
        }
        this.param.pageSize = 10
        this.page = 1
        this.getTableDatas(this.param)
      },
      // 区域---------------------------------------------------------------------------------------------
      regionChange (data) {
        this.workTime = ''
        this.timeList = []
        if (data !== '' && data !== undefined) {
          if (data.length > 0 && data.length < 5) {
            this.noDataText = '请先选择炮架名称'
            this.param.addressId = ''
          } else if (data.length === 5) {
            this.param.addressId = data[data.length - 1].value
            let par = {
              K: 'GET_GPS_REPORT_PULL',
              V: {
                terminalId: data[data.length - 1].value - 0
              }
            }
            Location(par).then((res) => {
              this.timeList = []
              if (res.data.R) {
                for (let i = 0; i < res.data.V.RESULT.length; i++) {
                  this.timeList[i] = res.data.V.RESULT[i].substr(0,10)
                }
              }
            })
          }
        }
        this.param.pageSize = 10
        this.param.pageNum = 1
        this.page = 1
        this.getTableDatas(this.param)
      },
      searchLanuch (data) {
        if (data !== '' && data!== undefined) {
          this.param.addressId = data
          this.getTableDatas(this.param)
        } else {
          this.param = {}
          this.getTableDatas(this.param)
          this.noDataText = '请先选择炮架名称'
        }
        this.param.pageSize = 10
        this.param.pageNum = 1
        this.page = 1
      },
      // 查询公用方法
      getTableDatas: function (param) {
        let vm = this
        vm.$Loading.start()
        let par = {
          K: 'GET_GPS_REPORT_LIST',
          V: param
        }
        Location(par).then((res) => {
          vm.$Loading.finish()
          if (res.data.R) {
            vm.dataTable = res.data.V.RESULT.list
            vm.total = res.data.V.RESULT.total
            vm.$refs.tablePage.currentPage = vm.page
            if (res.data.V.RESULT.list.length === 0) {
              this.noDataText = '暂无数据'
            }
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
