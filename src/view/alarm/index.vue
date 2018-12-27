<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          告警规则管理
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row  type="flex" justify="start" style="padding-top: 10px">
            <Col :xs="24" :lg="14" :style="{marginBottom: '10px'}">
            <div class="search-title" style="letter-spacing: 8px;margin-right: 20px"> 站点</div>
            <regionSite @region="regionChange" ></regionSite>
            </Col>
            <Col :xs="24" :lg="10" :style="{marginBottom: '10px'}">
            <div  class="search-title" style="letter-spacing: 0"> 炮弹型号</div>
            <shellsType @shells="shellsChangeTable" ></shellsType>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col span="24">
            <div  class="search-title"> 关键字</div>
            <Input  v-model="keyword" icon="ios-close-circle" @on-click="backKeyword" ref="search" placeholder="告警阈值搜索" style="width: 270px; float: left;" @on-change="keywordChange()">
            </Input>
            </Col>
          </Row>
          </Col>
        </Row>
        <!--表格-->
        <div class="tableBox">
          <Row type="flex" justify="start">
            <Button @click="add" class="btn-list" style="width:100px;margin-top:-10px;margin-bottom: 10px">添加阈值</Button>
          </Row>
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
    <Modal
      v-model="addUser"
      title="添加阈值"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="700px">
      <Form :model="updateModal" :label-width="100" ref="updateModal" :rules="ruleValidate">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="站名" prop="regions">
            <regionSite @region="regionChangeAdd" style="float:left;" :regionIds="regionIds"></regionSite>
            <span class="notice" v-if="addressNotice">请选择具体的站点</span>
          </FormItem>
          <FormItem label="炮弹型号" prop="productId">
            <shellsType @shells="shellsChangeTableAdd" :modes="modes"></shellsType>
            <span class="notice" v-if="shellsNotice">产品型号不能为空！</span><br>
          </FormItem>
          <FormItem label="设定阈值" prop="thresholdVal">
            <InputNumber  :min="1" v-model="updateModal.thresholdVal" @on-change="thresholdCheck(updateModal.thresholdVal)"
                          :formatter="value => `${value}`" :parser="value => value.replace('.', '')"
            ></InputNumber>
            <span class="notice" v-if="thresholdNotice">阈值不能为空</span><br>
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
    <Modal
      v-model="editUser"
      title="编辑阈值"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="700px">
      <Form :model="editModal" :label-width="100" ref="updateModal" :rules="ruleValidate">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="站名" >{{editModal.address }}&nbsp;&nbsp;&nbsp;&nbsp;{{ editModal.stationName}}
          </FormItem>
          <FormItem label="炮弹型号" >{{editModal.productType === 0 ? '火箭弹': '高炮'}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{editModal.productName}}
          </FormItem>
          <FormItem label="设定阈值" prop="thresholdVal">
            <InputNumber  :min="1" v-model="editModal.thresholdVal" @on-change="thresholdCheck(updateModal.thresholdVal)"
                          :formatter="value => `${value}`" :parser="value => value.replace('.', '')"
            ></InputNumber>
            <span class="notice" v-if="thresholdNotice">阈值不能为空</span><br>
          </FormItem>
          <FormItem>
            <Col span="24" push="8">
            <Button class="btn-list" @click="okEdit">保存</Button>
            </Col>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { alarms } from '../../api/api'
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
        stationId: '',
        regionIds: [],
        modes: [],
        addressNotice: false,
        shellsNotice: false,
        keyword: '',
        editModal: {
          regions: '',
          productId: '',
          thresholdVal: 1,
          productName: '',
          address: '',
          stationName: '',
          productType: ''
        },
        modelList: [],
        addUser: false,
        editUser: false,
        thresholdNotice: false,
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          K: 'GET_ALL_RULE',
          V: {
            pageNum: 1,
            pageSize: 10
          }
        },
        updateModal: {
          regions: '',
          productId: '',
          thresholdVal: 1
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
            title: '告警阈值',
            key: 'qty',
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
                      this.edit(params.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    color: '#00B9D3'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row)
                    }
                  }
                }, '删除')])
            }
          }
        ],
        dataTable:[],
        ruleValidate: {
          regions: [
          {required: true, message: '站点不能为空', trigger: 'blur'}
        ],
          productId: [
          {required: true, message: '炮弹型号不能为空', trigger: 'blur'}
        ],
          thresholdVal: [
            {required: true, message: '阈值不能为空', trigger: 'blur'}
          ]
      }
      }
    },
    created: function () {
      this.getTableDatas(this.param)
    },
    methods: {
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
      // 新增=========================================================
      regionChangeAdd(data) {
        this.updateModal.regions = this.regionIds[this.regionIds.length - 1] + ''
        if (data !== '' && data !==undefined && data.length !== 0) {
          let daLen = data[data.length - 1].value + ''
          if (this.updateModal.regions.length > daLen.length && this.updateModal.regions.length > 6) {
            this.updateModal.regions = this.updateModal.regions - 0
          } else if (daLen.length < 6) {
            this.addressNotice = true
            this.updateModal.regions = ''
          } else {
            this.addressNotice = false
            this.updateModal.regions = data[data.length - 1].value
          }
        } else {
          this.updateModal.regions = ''
        }
      },
      shellsChangeTableAdd (data) {
        // console.log(data)
        if (data.length > 1 && data[1] !== undefined) {
          this.updateModal.productId = data[1]
          this.shellsNotice = false
        } else {
          this.shellsNotice = true
        }
      },
      add () {
        this.addUser = true
        this.addressNotice = false
        this.shellsNotice = false
        this.thresholdVal = false
        this.updateModal = {
          regions: '',
          productId: '',
          thresholdVal: 1
        }
        this.regionIds = []
        this.modes = []
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
          this.updateModal.regions = this.regionIds[3]
        }
      },
      edit (row) {
        this.addressNotice = false
        this.shellsNotice = false
        this.thresholdNotice = false
        this.stationId = row.stationId.toString()
        this.regionIds = [this.stationId.substr(0,2) - 0,this.stationId.substr(0,4) - 0,this.stationId.substr(0,6) - 0,this.stationId.substr(0) - 0, true]
        // this.modes = [row.productType,row.productId, true]
        this.editModal.regions = row.stationId
        this.editModal.productId = row.productId
        this.editModal.thresholdVal = row.qty
        this.editModal.productName = row.productName
        this.editModal.productType = row.productType
        this.editModal.address = row.address
        this.editModal.stationName = row.stationName
        this.editUser = true
      },
      submitVal () {
        if (this.updateModal.regions === '' || this.addressNotice === true) {
          this.$Message.error('站点为空，操作失败')
          return false
        } else if (this.updateModal.productId === '' || this.shellsNotice === true) {
          this.shellsNotice = true
          this.$Message.error('炮弹型号为空，操作失败')
          return false
        } else if (this.updateModal.thresholdVal === '' || this.thresholdNotice === true) {
          this.thresholdNotice = true
          this.$Message.error('阈值不能为空，操作失败')
          return false
        } else {
          return true
        }
      },
      // 添加站点
      okAdd () {
        if (this.submitVal()) {
          let par = {
            K: "ALARM_RULE_IN",
            V: {
              stationId: this.updateModal.regions,
              productId: this.updateModal.productId,
              qty: this.updateModal.thresholdVal
            }
          }
          let vm = this
          vm.$Loading.start()
          alarms(par).then((res) => {
            vm.$Loading.finish()
            if (res.data.R) {
              this.updateModal = {
                regions: '',
                productId: '',
                thresholdVal: 1
              },
              this.regionIds = []
              this.modes = []
              this.addUser = false
              this.$Message.success('新增成功！')
              this.getTableDatas(vm.param)
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      cancelAdd () {},
      submitValEdit () {
        if (this.editModal.thresholdVal === '' || this.editModal.thresholdVal === null || this.thresholdNotice === true) {
          this.thresholdNotice = true
          this.$Message.error('阈值不能为空，操作失败')
          return false
        } else {
          return true
        }
      },
      // 编辑用户
      okEdit () {
        if (this.submitValEdit()) {
          let par = {
            K: "ALARM_RULE_UPDATE",
            V: {
              stationId: this.editModal.regions,
              productId: this.editModal.productId,
              qty: this.editModal.thresholdVal
            }
          }
          let vm = this
          vm.$Loading.start()
          alarms(par).then((res) => {
            vm.$Loading.finish()
            if (res.data.R) {
              this.editUser = false
              this.$Message.success('修改成功！')
              this.getTableDatas(vm.param)
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      // 阈值验证
      thresholdCheck (string) {
        if (string !== '' && string !== undefined && string !== null) {
          this.thresholdNotice = false
        } else {
          this.thresholdNotice = true
        }
      },
      remove (id) {
        // console.log(id)
        var th = this
        th.$Modal.confirm({
          title: '删除告警规则',
          content: `确定删除告警规则？`,
          onOk: function () {
            let par = {
              K: 'ALARM_RULE_DELETE',
              V: {
                stationId: id.stationId,
                productId: id.productId
              }
            }
            alarms(par).then((res) => {
              if (res.data.R) {
                if (th.param.V.pageNum > 1 && th.dataTable.length === 1) {
                  th.param.V.pageNum = th.param.V.pageNum - 1
                  th.page = th.page - 1
                }
                th.getTableDatas(th.param)
                th.$Message.success('告警规则删除成功！')
              } else {
                th.$Message.error(res.data.ERR_MSG)
              }
            })
          },
          onCancel: function () {
            th.$Message.success('取消删除操作成功！')
          }
        })
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
      },
      // 区域---------------------------------------------------------------------------------------------
      regionChangeEdit (data) {
        if (data.length < 4) {
          this.addressNotice = true
        } else {
          this.editModal.regions = data[data.length - 1].value
          this.addressNotice = false
        }
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
