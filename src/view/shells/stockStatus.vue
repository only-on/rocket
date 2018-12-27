<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          库存状态
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row type="flex" justify="start" style="margin-top: 10px">
            <Col :xs="24" :lg="14" :style="{marginBottom: '10px'}">
              <div  class="search-title" style="margin-right: 30px"> 站点</div>
              <regionSite @region="regionChange"></regionSite>
            </Col>
            <Col :xs="24" :lg="10" :style="{marginBottom: '10px'}">
              <div  class="search-title" style="letter-spacing: 0;margin-right: 12px"> 炮弹型号</div>
              <shellsType @shells="shellsChangeTable" ></shellsType>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :xs="24" :lg="14" :style="{marginBottom: '10px'}">
              <div class="search-title" style="letter-spacing: 0;margin-right: 13px">是否故障 </div>
              <Select v-model="malfunction" clearable style="width:200px;float: left" @on-change="isMalfun">
                <Option v-for="item in faultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col :xs="24" :lg="10" :style="{marginBottom: '10px'}">
              <div  class="search-title" style="letter-spacing: 0;margin-right: 18px" >关 键 字 </div>
              <Input  v-model="keyword" icon="ios-close-circle" @on-click="backKeyword" ref="search" placeholder="厂商搜索" style="width:270px; float: left;" @on-change="keywordChange()">
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
            <Page :total="total" :page-size="rows" @on-page-size-change="doPageSizeChange" @on-change="change" show-sizer show-total :page-size-opts="size"                    ref="tablePage" show-elevator :transfer="true"></Page>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { shellsStock } from '../../api/api'
  import regionSite from '../../components/regionSite'
  import shellsType from '../../components/shellsType'
  export default {
    components: {
      regionSite,
      shellsType
    },
    data () {
      return {
        width: '',
        keyword: '',
        malfunction: '',
        faultList: [
          {
            value: 'false',
            label: '否'
          },
          {
            value: 'true',
            label: '是'
          }
        ],
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          K: 'GET_ALL_STOCK_LIST',
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
            title: '厂商',
            key: 'vendorName',
            align: 'center'
          },
          {
            title: '库存数量',
            key: 'qty',
            align: 'center'
          },
          {
            title: '故障数量',
            key: 'malfunctionQty',
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
        if (data !== '' && data !== undefined && data[data.length - 1] !== undefined) {
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
      isMalfun (change) {
        this.param.V.malfunction = change
        this.param.V.pageSize = 10
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
        // console.log(param)
        let vm = this
        vm.$Loading.start()
        shellsStock(param).then((res) => {
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
  .notice{
    color:red;
    margin-left: 5px;
  }
</style>
