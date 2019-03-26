<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          通信地址管理
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row  type="flex" justify="start" style="padding-top: 10px">
            <Row type="flex" justify="start">
              <div class="search-title" style="letter-spacing: 0"> 炮架名称</div>
              <regionGun @region="regionChange"></regionGun>
            </Row>
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
            <Page :total="total" :page-size="rows" @on-page-size-change="doPageSizeChange" @on-change="change" show-sizer show-total :page-size-opts="size"
                  ref="tablePage" show-elevator :transfer="true"></Page>
          </div>
        </div>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
    <Modal
      v-model="addUser"
      title="编辑通信地址"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd">
      <Form :model="updateModal" :label-width="130" ref="updateModal" :rules="ruleValidate">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="炮架名称">
            {{rocketName}}
          </FormItem>
          <FormItem label="IP地址" prop="IP">
            <Input  v-model="updateModal.IP"  style="width: 200px; float: left"  @on-change="ipVal(updateModal.IP)" placeholder="IP地址"></Input>
            <span class="notice" v-if="ipNotice">请输入正确的IP地址</span><br>
          </FormItem>
          <FormItem label="端口" prop="port">
            <Input  v-model="updateModal.port"  style="width: 200px; float: left"  @on-change="portVal(updateModal.port)" placeholder="端口"></Input>
            <span class="notice" v-if="portNotice">请输入正确的端口</span><br>
          </FormItem>
          <FormItem>
            <Col span="24" push="5">
            <Button  class="btn-list" @click="okAdd">保存</Button>
            </Col>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import regionGun from '../../components/regionGun'
  import { Operate } from '../../api/api'
  import store from '../../store/store'
  export default {
    components: {
      regionGun
    },
    data () {
      return {
        rocketName: '',
        station: '',
        spinShow: false,
        addUser: false,
        ipNotice:false,
        portNotice: false,
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          pageNum: 1,
          pageSize: 10
        },
        updateModal: {
            IP: '',
            port: ''
        },
        columns:[
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
            title: '站名',
            key: 'stationName',
            align: 'center'
          },
          {
            title: 'IP地址',
            key: 'ip',
            align: 'center'
          },
          {
            title: '端口',
            key: 'port',
            align: 'center'
          },
          {
            title: '是否在线',
            key: 'online',
            align: 'center',
            render: (h,params) => {
              return h('div',params.row.online === true ? '是' : '否')
            }
            // render: (h, params) => {
            //   return h('div', [
            //     h('Button', {
            //       props: {
            //         type: 'text'
            //       },
            //       style: {
            //         color: '#00B9D3'
            //       },
            //       on: {
            //         click: () => {
            //           this.check(params.row.terminalId)
            //         }
            //       }
            //     }, '监测实时在线状态')])
            // }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              let color = params.row.online === true ? '#00B9D3' : ''
              let dis = params.row.online === true? false : true
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    disabled: dis
                  },
                  style: {
                    color: color
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }, '编辑')])
            }
          }
        ],
        dataTable:[],
        ruleValidate: {
          IP: [
            {required: true, message: 'IP地址不能为空', trigger: 'blur'}
          ],
          port: [
            {required: true, message: '端口不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // check () {
      //   this.$Message.success('正在监测实时状态，请稍后')
      //   this.spinShow = true
      // },
      edit (row) {
        this.addUser = true
        this.ipNotice = false
        this.portNotice = false
        this.rocketName = row.rocketName
        this.updateModal.TID = row.terminalId
        this.updateModal.IP = row.ip
        if (row.port === null) {
          this.updateModal.port = ''
        } else {
          this.updateModal.port = row.port + ''
        }
      },
      // ip校验
      ipVal(string) {
        var validate = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])(\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)){3}$/
        if (string !== '' && string !== undefined) {
          if (validate.test(string.trim())) {
            this.ipNotice = false
          } else {
            this.ipNotice = true
          }
        } else {
          this.ipNotice = true
        }
      },
      // 端口校验
      portVal (string) {
        var validate = /^\d+$/
        if (string !== '' && string !== undefined) {
          if (validate.test(string.trim())) {
            if (string.trim() > 0 && string.trim() <= 65535) {
              this.portNotice = false
            } else {
              this.portNotice = true
            }
          } else {
            this.portNotice = true
          }
        } else {
          this.portNotice = true
        }
      },
      submitVal () {
        if (this.updateModal.IP === '' || this.updateModal.IP === null) {
          this.$Message.error('IP地址不能为空！')
          return false
        } else if (this.ipNotice) {
          this.$Message.error('请输入正确的IP地址！')
        } else if (this.updateModal.port === '' || this.updateModal.port === null) {
          this.$Message.error('端口不能为空！')
          return false
        } else if (this.portNotice) {
          this.$Message.error('请输入正确的端口！')
          return false
        } else {
          return true
        }
      },
      okAdd () {
        if (this.submitVal()) {
          if (this.updateModal.port !== '' && this.updateModal.port !== undefined) {
            this.updateModal.port =  this.updateModal.port - 0
          }
         let par = {
           K: 'CHANGE_TERMINAL_IP',
           V: this.updateModal
         }
         Operate(par).then((res) => {
           if (res.data.R) {
             this.getTableDatas(this.param)
             this.$Message.info('修改成功')
             this.addUser = false
           } else {
             this.$Message.error(res.data.ERR_MSG)
           }
         })
        }
      },
      cancelAdd () {},
      regionChange (data) {
        if (data !== '' && data !== undefined && data[data.length - 1] !== undefined) {
          if (data.length < 5) {
            this.param.stationId = data[data.length -1].value - 0
            this.param.terminalId = ''
          } else if (data.length === 5) {
            this.param.stationId = data[data.length - 2].value - 0
            this.param.terminalId = data[data.length - 1].value - 0
          }
        } else {
          this.param.stationId = ''
          this.param.terminalId = ''
        }
        this.getTableDatas(this.param)
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
          K: 'IP_LIST',
          V: param
        }
        Operate(par).then((res) => {
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
      this.station = store.state.station
      this.param.stationId = this.station - 0
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
