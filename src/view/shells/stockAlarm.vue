<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          库存告警
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row type="flex" justify="start" style="margin-top: 10px">
            <Col :xs="24" :lg="14" :style="{marginBottom: '10px'}">
              <div class="search-title" style="margin-right: 30px"> 站点</div>
              <regionSite @region="regionChange"></regionSite>
            </Col>
            <Col :xs="24" :lg="10" :style="{marginBottom: '10px'}">
              <div  class="search-title" style="letter-spacing: 0;margin-right: 12px"> 炮弹型号</div>
              <shellsType @shells="shellsChangeTable" ></shellsType>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col span="24">
              <div  class="search-title"> 关键字</div>
              <Input  v-model="keyword" icon="ios-close-circle" @on-click="backKeyword" ref="search" placeholder="输入告警阈值搜索" style="width: 270px; float: left;" @on-change="keywordChange()">
              </Input>
            </Col>
          </Row>
          </Col>
        </Row>
        <!--表格-->
        <div class="tableBox">
          <Table border size="small" :columns="columns" :data="dataTable"></Table>
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
  import { alarms } from '../../api/api'
  import regionSite from '../../components/regionSite'
  import shellsType from '../../components/shellsType'
  import store from '../../store/store'
  import * as types from '../../store/types'
  export default {
    components: {
      regionSite,
      shellsType
    },
    data () {
      return {
        stationId: '',
        regionIds: [],
        modes: [],
        keyword: '',
        modelList: [],
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          K: 'ALARM_NOTIFY_LIST',
          V: {
            pageNum: 1,
            pageSize: 10
          }
        },
        columns:[
          {
            title: '站名',
            key: 'stationName',
            align: 'center'
          },
          {
            title: '炮弹类型',
            key: 'productType',
            align: 'center',
            render: (h, params) => {
              return h('div', params.row.productType === 0 ? '火箭弹' : '高炮')
            }
          },
          {
            title: '炮弹型号',
            key: 'productName',
            align: 'center'
          },
          {
            title: '当前库存（正常）',
            key: 'currentQty',
            align: 'center'
          },
          {
            title: '当前库存（故障）',
            key: 'malfunctionQty',
            align: 'center'
          },
          {
            title: '告警阈值',
            key: 'alarmQty',
            align: 'center'
          },
          // {
          //   title: '操作',
          //   key: 'action',
          //   align: 'center',
          //   render: (h, params) => {
          //     let btn = params.row.productType === 0 ? '标记为已读' : '已读'
          //     let btnColor = params.row.productType === 0 ? '#00B9D3' : '#666666'
          //     let dis = params.row.productType === 0 ? false : true
          //     return h('div', [
          //       h('Button', {
          //         props: {
          //           type: 'text',
          //           disabled: dis
          //         },
          //         style: {
          //           color: btnColor
          //         },
          //         on: {
          //           click: () => {
          //             this.remove(params.row)
          //           }
          //         }
          //       }, btn)])
          //   }
          // }
        ],
        dataTable:[]
      }
    },
    created: function () {
      this.getTableDatas(this.param)
    },
    methods: {
      remove () {},
      backKeyword () {
        this.keyword = ''
        this.param.V.alarmQty = undefined
        this.param.V.pageSize = 10
        this.param.V.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      keywordChange () {
        if (this.keyword.trim() === '') {
          this.param.V.alarmQty = undefined
        } else {
          this.param.V.alarmQty = this.keyword.trim()
        }
        this.param.V.pageSize = 10
        this.param.V.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      shellsChangeTable (data) {
        // console.log(data)
        if (data.length > 1) {
          this.param.V.productType = data[0]
          this.param.V.productId = data[1]
        } else if (data.length > 0) {
          this.param.V.productType = data[0]
          this.param.V.productId = undefined
        } else {
          this.param.V.productType = undefined
          this.param.V.productId = undefined
        }
        this.getTableDatas(this.param)
      },
      // 区域---------------------------------------------------------------------------------------------
      regionChange (data) {
        // console.log(data)
        if (data !== '' && data != undefined && data[data.length - 1] !== undefined) {
          if (data.length > 0) {
            this.param.V.stationId = data[data.length - 1].value
          } else {
            this.param.V.stationId = undefined
          }
        }
        this.param.V.pageSize = 10
        this.param.V.pageNum = 1
        this.page = 1
        // console.log(this.param)
        var thi = this
        thi.getTableDatas(thi.param)
      },
      // 查询公用方法
      getTableDatas: function (param) {
        let vm = this
        vm.$Loading.start()
        alarms(param).then((res) => {
          vm.$Loading.finish()
          if (res.data.R) {
            vm.dataTable = res.data.V.RESULT.list
            vm.total = res.data.V.RESULT.total
            vm.$refs.tablePage.currentPage = vm.page
          } else {
            vm.dataTable = []
            vm.total = 0
          }
          store.commit(types.Num, JSON.stringify(vm.total))
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
  .notice{
    color:red;
    margin-left: 5px;
  }
</style>
