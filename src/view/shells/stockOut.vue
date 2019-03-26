<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          炮弹出库
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row type="flex" justify="start"  style="margin-top: 10px">
            <Col :xs="24" :lg="12" :style="{marginBottom: '10px'}">
            <div  class="search-title" style="letter-spacing: 0"> 炮弹型号</div>
            <shellsType @shells="shellsChangeTable" ></shellsType>
            </Col>
            <Col :xs="24" :lg="12" :style="{marginBottom: '10px'}">
            <div  class="search-title" style="letter-spacing: 0">时间范围</div>
            <DatePicker type="daterange" format="yyyy/MM/dd" placeholder="请选择时间范围" style="width: 200px;float:left;" clearable :editable="false" @on-change="timeChange" ></DatePicker>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col :xs="24" :lg="12" :style="{marginBottom: '10px'}">
            <div class="search-title" style="letter-spacing: 0">是否故障</div>
            <Select v-model="malfunction" clearable style="width:135px;float:left;" @on-change="isMalfun">
              <Option v-for="item in faultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col :xs="24" :lg="12" :style="{marginBottom: '10px'}">
            <div  class="search-title" style="letter-spacing: 5px">关键字</div>
            <Input  v-model="param.keyword" icon="ios-close-circle" @on-click="backKeyword" ref="search" placeholder="站名/厂商/经办人/操作人搜索" style="width: 200px;float: left" @on-change="keywordChange()">
            </Input>
            </Col>
          </Row>
          </Col>
        </Row>
        <!--表格-->
        <div class="tableBox">
          <Row type="flex" justify="start">
            <Button @click="add" class="btn-list"  style="margin-top:-10px;margin-bottom: 10px">添加</Button>
          </Row>
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
    <Modal
      v-model="addUser"
      title="炮弹出库"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="700">
      <Form v-model="updateModal" :label-width="100" :rules="ruleValidate" ref="updateModal">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="站名" prop="stationId">
            <regionSite @region="regionChange" style="float:left;" :regionIds="regionIds"></regionSite>
            <span class="notice" v-if="addressNotice">请选择具体的站点</span>
          </FormItem>
          <FormItem label="炮弹型号" prop="productId">
            <shellsType @shells="shellsChange" :modes="modes"></shellsType>
            <span class="notice" v-if="shellsNotice">炮弹型号不能为空！</span><br>
          </FormItem>
          <FormItem label="数量" prop="qty">
            <InputNumber :min="1" v-model="updateModal.qty" style="width: 200px; float: left"  @on-change="numVal(updateModal.qty)"
                         :formatter="value => `${value}`" :parser="value => value.replace('.', '')"
            ></InputNumber>
            <span class="notice" v-if="nameNotice">数量不能为空！</span><br>
          </FormItem>
          <FormItem label="厂商" prop="vendorId">
            <Select v-model="updateModal.vendorId" clearable style="width:200px">
              <Option v-for="item in factoryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否故障">
            <RadioGroup v-model="isBad">
              <Radio label="0">否</Radio>
              <Radio label="1">是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="经办人" >
            <Input  v-model="updateModal.user"  style="width: 200px; float: left"  placeholder="经办人" @on-change="checkUser(updateModal.user)"></Input>
            <span class="notice" v-if="userNotice">经办人不能超过20个字！</span><br>
          </FormItem>
          <FormItem label="备注" >
            <Input  v-model="updateModal.otherInfo" type="textarea" :rows="2" style="width: 300px; float: left"  placeholder="备注信息"  @on-change="checkLen(updateModal.otherInfo)"></Input>
            <span class="notice" v-if="otherInfoNotice">备注长度不能超过200字！</span><br>
          </FormItem>
          <FormItem>
            <Col span="24" push="8">
            <Button class="btn-list" @click="okAdd">保存</Button>
            </Col>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { shellsStock } from '../../api/api'
  import regionSite from '../../components/regionSite'
  import shellsType from '../../components/shellsType'
  import store from '../../store/store'
  export default {
    components: {
      regionSite,
      shellsType
    },
    data () {
      return {
        station: '',
        regionIds: [],
        modes: [],
        mode: [],
        isBad: '0',
        shellsNotice: false,
        addressNotice: false,
        otherInfoNotice: false,
        userNotice: false,
        factoryList: [],
        malfunction: '',
        faultList: [
          {
            value: 0,
            label: '否'
          },
          {
            value: 1,
            label: '是'
          }
        ],
        addUser: false,
        nameNotice: false,
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          // productId: '',
          // productType: '',
          // beginDate: '',
          // endDate: '',
          // keyword: '',
          pageNum: 1,
          pageSize: 10
        },
        updateModal: {
          productId: '',
          qty: 1,
          stationId: '',
          vendorId: '',
          user: '',
          malfunction: true,
          otherInfo: ''
        },
        columns:[
          {
            title: '单号',
            key: 'id',
            align: 'center'
          },
          {
            title: '站名',
            key: 'stationName',
            align: 'center'
          },
          {
            title: '炮弹类型',
            key: 'productType',
            width: 90,
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
            title: '数量',
            key: 'qty',
            width: 80,
            align: 'center'
          },
          {
            title: '是否故障',
            key: 'malfunction',
            width: 90,
            align: 'center',
            render: (h, params) => {
              return h('div', params.row.malfunction === true ? '是' : '否')
            }
          },
          {
            title: '经办人',
            key: 'user',
            align: 'center'
          },
          {
            title: '备注',
            key: 'otherInfo',
            align: 'center',
            width:200,
            render: (h, params) => {
              let display = params.row.otherInfo === null ? 'none' : 'inline'
              let text = params.row.otherInfo === null ? '-' : params.row.otherInfo
              return h('div', {
                style: {
                  marginRight: '20px',
                  display: display
                }
              },[
                h('Tooltip', {
                  props: { placement: 'bottom-start' }
                }, [
                  h('span',params.row.otherInfo !== null && params.row.otherInfo.length > 10 ? params.row.otherInfo.substr(0,10) + '...' : params.row.otherInfo !== null && params.row.otherInfo.length < 10 ? params.row.otherInfo : ''),
                  h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all'} },params.row.otherInfo)
                ])
              ])
            }
          },
          {
            title: '创建时间',
            key: 'updateTime',
            align: 'center'
          },
          {
            title: '操作人',
            key: 'operator',
            align: 'center'
          }
        ],
        dataTable:[],
        ruleValidate: {
          stationId: [
            {required: true, message: '请选择具体的站点', trigger: 'blur'}
          ],
          productId: [
            {required: true, message: '炮弹型号不能为空', trigger: 'blur'}
          ],
          qty: [
            {required: true, message: '数量不能为空', trigger: 'blur'}
          ],
          vendorId: [
            {required: true, message: '厂商不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    created: function () {
      this.getTableDatas(this.param)
      this.getFactoryList()
    },
    methods: {
      getFactoryList () {
        let p = {
          K: 'GET_ALL_VENDOR',
          V: {}
        }
        let vm = this
        vm.$Loading.start()
        shellsStock(p).then((res) => {
          vm.$Loading.finish()
          if (res.data.R) {
            vm.factoryList = res.data.V.RESULT
          } else {
            vm.factoryList = []
          }
        })
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
        // console.log(change)
        if (change[0] !== '' && change[1] !== undefined) {
          this.param.beginDate = this.formatDate(new Date(change[0])) + ' 00:00:00'
          this.param.endDate = this.formatDate(new Date(change[1])) + ' 23:59:59'
        } else {
          this.param.beginDate = ''
          this.param.endDate = ''
        }
        this.param.pageSize = 10
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      add () {
        this.regionIds = []
        this.modes = []
        this.updateModal = {
          qty: 1
        }
        this.isBad = '0'
        this.addUser = true
        this.addressNotice = false
        this.shellsNotice = false
        this.nameNotice = false
        this.otherInfoNotice = false
        this.userNotice = false
        this.station = store.state.station
        if (this.station.length === 2) {
          this.regionIds[0] = parseInt(this.station)
        } else if (this.station.length === 4) {
          this.regionIds[0] = parseInt(this.station.substr(0,2))
          this.regionIds[1] = parseInt(this.station.substr(0))
        } else if (this.station.length === 6) {
          this.regionIds[0] = parseInt(this.station.substr(0,2))
          this.regionIds[1] = parseInt(this.station.substr(0,4))
          this.regionIds[2] = parseInt(this.station.substr(0))
        } else if (this.station.length > 6) {
          this.regionIds[0] = parseInt(this.station.substr(0,2))
          this.regionIds[1] = parseInt(this.station.substr(0,4))
          this.regionIds[2] = parseInt(this.station.substr(0,6))
          this.regionIds[3] = parseInt(this.station.substr(0))
          this.updateModal.stationId = this.regionIds[3]
        }
      },
      submitVal () {
        if (this.updateModal.stationId === '' || this.updateModal.stationId === undefined) {
          this.$Message.error('站点不能为空！')
          return false
        } else if (this.updateModal.productId === '' || this.updateModal.productId === undefined) {
          this.$Message.error('炮弹型号不能为空！')
          return false
        } else if (this.updateModal.qty === null) {
          this.nameNotice = true
          this.$Message.error('数量不能为空！')
          return false
        } else if (this.updateModal.vendorId === '' || this.updateModal.vendorId === undefined) {
          this.$Message.error('厂商不能为空！')
          return false
        } else if (this.updateModal.user !== undefined && this.updateModal.user.length > 20) {
          this.userNotice = true
          this.$Message.error('经办人不能超过20个字！')
          return false
        } else if (this.updateModal.otherInfo !== undefined && this.updateModal.otherInfo.length > 200) {
          this.otherInfoNotice = true
          this.$Message.error('备注不能超过200字！')
          return false
        } else {
          return true
        }
      },
      // 添加入库
      okAdd () {
        if (this.isBad === '0') {
          this.updateModal.malfunction = false
        } else {
          this.updateModal.malfunction = true
        }
        if (this.submitVal()) {
          let par = {
            K: 'STOCK_OUT',
            V: this.updateModal
          }
          shellsStock(par).then((res) => {
            if (res.data.R) {
              this.regionIds = []
              this.modes = []
              this.updateModal = {
                qty: 1
              }
              this.isBad = '0'
              this.addUser = false
              this.$Message.success('出库成功！')
              this.getTableDatas(this.param)
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      cancelAdd () {},
      numVal (num) {
        if (num === null) {
          this.nameNotice = true
        } else {
          this.nameNotice = false
        }
      },
      checkUser (string) {
        if (string !== '' && String !== undefined) {
          if (string.trim().length > 20) {
            this.userNotice = true
          } else {
            this.userNotice = false
          }
        }
      },
      checkLen (string) {
        if (string !== '' && String !== undefined) {
          if (string.trim().length > 200) {
            this.otherInfoNotice = true
          } else {
            this.otherInfoNotice = false
          }
        }
      },
      isMalfun (change) {
        if (change === 0) {
          this.param.malfunction = 'false'
        } else if (change === 1) {
          this.param.malfunction = 'true'
        } else {
          delete this.param.malfunction
        }
        this.param.pageSize = 10
        this.param.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      backKeyword () {
        this.param.keyword = ''
        this.param.pageSize = 10
        this.param.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      keywordChange () {
        this.param.keyword = this.param.keyword.trim()
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
          K: 'GET_ALL_STOCK_OUT',
          V: param
        }
        shellsStock(par).then((res) => {
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
      },
      // 区域---------------------------------------------------------------------------------------------
      regionChange (data) {
        if (this.regionIds[this.regionIds.length - 1] !== undefined) {
          this.updateModal.stationId = this.regionIds[this.regionIds.length - 1] + ''
        }
        if (data !== '' && data !==undefined && data.length !== 0) {
          let daLen = data[data.length - 1].value + ''
          if (this.updateModal.stationId !== undefined && this.updateModal.stationId.length > daLen.length && this.updateModal.stationId.length > 6) {
            this.updateModal.stationId = this.updateModal.stationId - 0
          } else if (daLen.length <= 6) {
            this.addressNotice = true
            this.updateModal.stationId = ''
          } else {
            this.addressNotice = false
            this.updateModal.stationId = data[data.length - 1].value
          }
        }
      },
      //  炮弹型号---------------------------------------------------------------
      shellsChange (data) {
        // console.log(data);
        if (data[1] === '' || data[1] === undefined) {
          this.shellsNotice = true
          this.updateModal.productId = ''
        } else {
          this.updateModal.productId = data[1]
          this.shellsNotice = false
        }
      },
      shellsChangeTable (data) {
        if (data[1] !== undefined) {
          this.param.productType = data[0]
          this.param.productId = data[1]
        } else if (data[0] !== undefined) {
          this.param.productType = data[0]
          delete this.param.productId
        } else {
          delete this.param.productType
          delete this.param.productId
        }
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
