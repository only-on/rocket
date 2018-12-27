<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          炮架管理
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row type="flex" justify="start" style="margin-top: 20px">
            <Col :xs="24" :lg="14" :style="{marginBottom: '10px'}">
            <div class="search-title" style="margin-right: 30px"> 站点</div>
            <regionSite @region="regionSearch"></regionSite>
            </Col>
            <Col :xs="24" :lg="10" :style="{marginBottom: '10px'}">
            <div  class="search-title">关键字</div>
            <Input  v-model="param.condition" icon="ios-close-circle" @on-click="backKeyword" ref="search" placeholder="终端编号/炮架名称搜索" style="width: 270px; float:left;" @on-change="keywordChange()">
            </Input>
            </Col>
          </Row>
          </Col>
        </Row>
        <!--表格-->
        <div class="tableBox">
          <Row type="flex" justify="start">
            <Button @click="add" class="btn-list"  style="width:100px;margin-top:-10px;margin-bottom: 10px">注册炮架</Button>
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
    <!--注册炮架-->
    <Modal
      v-model="addUser"
      title="注册炮架"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="700">
      <Form :model="updateModal" :label-width="110" ref="updateModal" :rules="ruleValidate">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="站名" prop="stationId">
            <regionSite @region="regionChange" style="float:left;"  :regionIds="regionIds"></regionSite>
            <span class="notice" v-if="addressNotice">请选择到具体的站点</span>
          </FormItem>
          <FormItem label="终端编号" prop="terminalId">
            <Input  v-model="updateModal.terminalId"  style="width: 200px; float: left"  @on-change="terminalVal(updateModal.terminalId)" placeholder="终端编号"></Input>
            <span class="notice" v-if="terNotice">终端编号不能为空</span>
            <span class="notice" v-if="terminalNotice">请输入0 ~ 2147483647的整数</span>
            <!--<span class="notice" v-if="terminalsNotice">终端编号不能超过10位</span>-->
            <br>
          </FormItem>
          <FormItem label="炮架编号" prop="launcherId">
            <Input  v-model="updateModal.launcherId"  style="width: 200px; float: left"  @on-change="launchVal(updateModal.launcherId)" placeholder="炮架编号"></Input>
            <span class="notice" v-if="lanNotice">炮架编号不能为空</span>
            <span class="notice" v-if="launchsNotice">请输入0 ~ 32767的整数</span>
            <!--<span class="notice" v-if="launchsNotice">炮架编号不能超过10位</span>-->
            <br>
          </FormItem>
          <FormItem label="炮架名称" prop="name">
            <Input  v-model="updateModal.name"  style="width: 200px; float: left"  @on-change="launchName(updateModal.name)" placeholder="炮架名称"></Input>
            <span class="notice" v-if="lanNaNotice">炮架名称不能为空</span>
            <!--<span class="notice" v-if="launchNotice">炮架名称</span>-->
            <span class="notice" v-if="lanNasNotice">炮架名称不能超过10位</span>
            <br>
          </FormItem>
          <FormItem label="发射架类型" prop="model">
            <Select v-model="updateModal.model" style="width:200px">
            <Option v-for="item in modelList" :value="item.name" :key="item.name">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <!--<FormItem label="监控板信息" prop="version">-->
            <!--<Select v-model="updateModal.version" style="width:200px">-->
              <!--<Option v-for="item in versionList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
            <!--</Select>-->
          <!--</FormItem>-->
          <FormItem>
            <Col span="24" push="8">
            <Button class="btn-list" @click="okAdd">保存</Button>
            </Col>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <!--绑定炮架-->
    <Modal
      v-model="blindLanuch"
      title="绑定气象站"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="700">
      <Form :model="blindModal" :label-width="90">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="站名">
            <regionSite @region="regionBlind" style="float:left;"  :regionIds="regionIds"></regionSite><br>
            <span class="notice" v-if="blindNotice">请选择具体的站点</span>
          </FormItem>
          </Col>
          <FormItem>
            <Col span="24" pull="12">
            <Button  class="btn-list" @click="okBlind">保存</Button>
            </Col>
          </FormItem>
        </Row>
      </Form>
    </Modal>
    <!--编辑-->
    <Modal
      v-model="editUser"
      title="编辑炮架"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="600">
      <Form :model="editModal" :label-width="200" ref="editModal" :rules="ruleValidate">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="站名">
            {{editModal.stationName}}
          </FormItem>
          <FormItem label="终端编号">
            {{editModal.terminalId}}
            <br>
          </FormItem>
          <FormItem label="炮架编号">
            {{editModal.launcherId}}
            <br>
          </FormItem>
          <FormItem label="炮架名称" prop="name">
            <Input  v-model="editModal.name"  style="width: 200px; float: left"  @on-change="launchName(editModal.name)" placeholder="炮架名称"></Input>
            <span class="notice" v-if="lanNaNotice">炮架名称不能为空</span>
            <!--<span class="notice" v-if="launchNotice">炮架名称</span>-->
            <span class="notice" v-if="lanNasNotice">炮架名称不能超过10位</span>
            <br>
          </FormItem>
          <FormItem label="发射架类型">
            {{editModal.model}}
          </FormItem>
          <FormItem>
            <Col span="24" push="3">
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
  import { getRegion, Launch,Station } from '../../api/api'
  import regionSite from '../../components/regionSite'
  import * as types from '../../store/types'
  import store from '../../store/store'
  export default {
    components: {
      regionSite
    },
    data () {
      return {
        editUser: false,
        lanNaNotice: false,
        lanNasNotice: false,
        station: '',
        regionIds: [],
        addUser: false,
        addressNotice: false,
        blindLanuch: false,
        terNotice: false,
        terminalNotice: false,
        lanNotice: false,
        launchNotice: false,
        launchsNotice: false,
        blindNotice: false,
        terminalsNotice: false,
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          pageNum: 1,
          pageSize: 10
        },
        editModal: {
          stationName: '',
          terminalId: '',
          launcherId: '',
          model: '',
          version: '',
          name: ''
        },
        updateModal: {
          stationId: '',
          terminalId: '',
          launcherId: '',
          model: '',
          version: '',
          name: ''
        },
        blindModal: {
          stationId: '',
          terminalId: ''
        },
        modelList: [],
        versionList: [],
        columns:[
          {
            title: '站名',
            key: 'stationName',
            align: 'center',
            render: (h,params) => {
              return h('div',params.row.stationName === null ? '-' : params.row.stationName)
            }
          },
          {
            title: '地址',
            key: 'address',
            align: 'center',
            render: (h,params) => {
              return h('div',params.row.address === null ? '-' : params.row.address)
            }
          },
          {
            title: '终端编号',
            key: 'terminalId',
            align: 'center'
          },
          {
            title: '炮架编号',
            key: 'launcherId',
            align: 'center'
          },
          {
            title: '炮架名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '发射架类型',
            key: 'model',
            align: 'center',
            width: 120
          },
          // {
          //   title: '监控板信息',
          //   key: 'version',
          //   align: 'center'
          // },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 330,
            render: (h, params) => {
              let display = (params.row.stationName === null || params.row.stationName === '' || params.row.stationName === undefined) ? 'inline-block' : 'none'
              let show = (params.row.stationName === null || params.row.stationName === '' || params.row.stationName === undefined) ? 'none' : 'inline-block'
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    color: '#00B9D3',
                    display: display
                  },
                  on: {
                    click: () => {
                      this.bind(params.row)
                    }
                  }
                }, '绑定气象站'),
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    color: '#00B9D3',
                    display: show
                  },
                  on: {
                    click: () => {
                      this.unbind(params.row.terminalId)
                    }
                  }
                }, '解绑气象站'),
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
                      this.remove(params.row.terminalId)
                    }
                  }
                }, '删除炮架')
              ])
            }
          }
        ],
        dataTable:[],
        ruleValidate: {
          stationId: [
            {required: true, message: '请选择具体的站点', trigger: 'blur'}
          ],
          terminalId: [
            {required: true, message: '终端编号不能为空', trigger: 'blur'}
          ],
          launcherId: [
            {required: true, message: '炮架编号不能为空', trigger: 'blur'}
          ],
          model: [
            {required: true, message: '请选择发射架类型', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '炮架名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      add () {
        this.regionIds = []
        this.updateModal = {
          stationId: '',
          terminalId: '',
          launcherId: '',
          model: '',
          version: ''
        }
        this.addUser = true
        this.terNotice = false
        this.terminalsNotice = false
        this.terminalNotice = false
        this.lanNotice = false
        this.launchNotice = false
        this.launchsNotice = false
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
        // this.$refs.updateModal.resetFields()
      },
      submitVal () {
        if (this.updateModal.stationId === '' || this.updateModal.stationId === undefined) {
          this.$Message.error('请选择具体的站点！')
          return false
        } else if (this.updateModal.terminalId === '' || this.updateModal.terminalId === undefined || this.terNotice) {
          this.$Message.error('终端编号为空！')
          return false
        } else if (this.terminalNotice) {
          this.$Message.error('终端编号请输入0 ~ 2147483647的整数！')
          return false
        } else if (this.updateModal.launcherId === '' || this.updateModal.launcherId === undefined || this.launchNotice) {
          this.$Message.error('炮架编号为空！')
          return false
        } else if (this.launchsNotice) {
          this.$Message.error('炮架编号请输入0 ~ 32767的整数！')
          return false
        } else if (this.updateModal.name === '' || this.updateModal.name === undefined || this.lanNaNotice) {
          this.$Message.error('炮架名称为空！')
          return false
        }  else if (this.lanNasNotice) {
          this.$Message.error('炮架名称不能超过10位！')
          return false
        } else if (this.updateModal.model === '' || this.updateModal.model === undefined) {
          this.$Message.error('发射架类型不能为空！')
          return false
        } else {
          return true
        }
      },
      // 添加
      okAdd () {
        if (this.submitVal()) {
          if (this.updateModal.model === '高炮') {
            this.updateModal.version = 'TS-1270'
          } else if (this.updateModal.model === '火箭弹') {
            this.updateModal.version = 'TS-1272'
          } else if (this.updateModal.model === '火箭弹(旧)') {
            this.updateModal.version = 'Third'
          }
          let par = {
            K: 'ADD_ROCKET',
            V: this.updateModal
          }
          getRegion(par).then((res) => {
            if (res.data.R) {
              this.addUser = false
              this.regionIds = []
              this.updateModal = {
                stationId: '',
                terminalId: '',
                launcherId: '',
                model: '',
                version: '',
                name: ''
              }
              this.$Message.success('炮架注册成功！')
              this.getTableDatas(this.param)
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      cancelAdd () {},
      // 绑定炮架
      bind (row) {
        this.regionIds = []
        this.blindNotice = false
        this.blindLanuch = true
        this.blindModal.terminalId = row.terminalId
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
          this.blindModal.stationId = this.regionIds[3]
        }
      },
      submitBlind () {
        if (this.blindModal.stationId === '') {
          this.$Message.error('请选择具体的站点！')
          return false
        } else {
          return true
        }
      },
      okBlind () {
        if (this.submitBlind()) {
          let par = {
            K: 'BIND_ROCKET',
            V: this.blindModal
          }
          getRegion(par).then((res) => {
            if (res.data.R) {
              this.blindLanuch = false
              this.getTableDatas(this.param)
              this.$Message.success('绑定成功！')
            } else {
              this.$Message.error('绑定失败')
            }
          })
        }
      },
      // 终端编号
      terminalVal (string) {
        var validate = /^\+?[1-9][0-9]*$/
        if (string !== '' && string !== undefined) {
          if (string.trim().length === 0) {
            this.terNotice = true
          } else {
            this.terNotice = false
            if (validate.test(string.trim())) {
              if (string.trim() >= 0 && string.trim() <= 2147483647) {
                this.terminalNotice = false
              } else {
                this.terminalNotice = true
              }
            } else {
              this.terminalNotice = true
            }
          }
        } else {
          this.terNotice = true
          this.terminalNotice = false
        }
      },
      // 炮架编号
      launchVal (string) {
        var validate = /^\+?[1-9][0-9]*$/
        if (string !== '' && string !== undefined) {
          if (string.trim().length === 0) {
            this.launchNotice = true
          } else {
            this.launchNotice = false
            if (validate.test(string.trim())) {
              if (string.trim() >= 0 && string.trim() <= 32767) {
                this.launchsNotice = false
              } else {
                this.launchsNotice = true
              }
            } else {
              this.launchsNotice = true
            }
          }
        } else {
          this.launchNotice = true
          this.launchsNotice = false
        }
      },
      // 炮架名称
      launchName (string) {
        if (string !== '' && string !== undefined) {
          if (string.trim().length !== 0) {
            this.lanNaNotice = false
            if (string.trim().length > 10) {
              this.lanNasNotice = true
            } else {
              this.lanNasNotice = false
              this.lanNaNotice = false
            }
          } else {
            this.lanNaNotice = true
            this.lanNasNotice = false
          }
        }
      },
      // 编辑
      edit (row) {
        this.lanNaNotice = false
        this.lanNasNotice = false
        this.editUser = true
        this.editModal.stationName = row.stationName !== null ? row.stationName : '-'
        this.editModal.terminalId = row.terminalId
        this.editModal.launcherId = row.launcherId
        this.editModal.model = row.model
        this.editModal.name = row.name
      },
      okEdit () {
        if (this.editModal.name === '' || this.editModal.name === undefined || this.lanNaNotice) {
          this.$Message.error('炮架名称不能为空！')
        } else if (this.lanNasNotice) {
          this.$Message.error('炮架名称不能超过10个字！')
        } else {
          let par = {
            K: 'UPDATE_ROCKET_NAME',
            V: {
              terminalId: this.editModal.terminalId,
              name: this.editModal.name
            }
          }
          Station(par).then((res) => {
            if (res.data.R) {
              this.$Message.success('编辑成功！')
              this.getTableDatas(this.param)
              this.editUser = false
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      // 解除绑定
      unbind (id) {
        var th = this
        th.$Modal.confirm({
          title: '解绑气象站',
          content: `确定解除绑定？`,
          onOk: function () {
            let par = {
              K: 'UNBIND_ROCKET',
              V: {
                ids: [id]
              }
            }
            getRegion(par).then((res) => {
              if (res.data.R) {
                th.getTableDatas(th.param)
                th.$Message.success('解绑成功！')
              } else {
                th.$Message.error(res.data.ERR_MSG)
              }
            })
          },
          onCancel: function () {
            th.$Message.success('取消解除绑定操作成功！')
          }
        })
      },
      // 删除炮架
      remove (id) {
        // console.log(id)
        var th = this
        th.$Modal.confirm({
          title: '删除炮架信息',
          content: `确定删除炮架？`,
          onOk: function () {
            let par = {
              K: 'DELETE_ROCKET',
              V: {
                terminalId: id
              }
            }
            getRegion(par).then((res) => {
              if (res.data.R) {
                if (th.param.pageNum > 1 && th.dataTable.length === 1) {
                  th.param.pageNum = th.param.pageNum - 1
                }
                th.getTableDatas(th.param)
                th.$Message.success('炮架删除成功！')
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
      backKeyword () {
        this.param.condition = ''
        this.param.pageSize = 10
        this.param.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      keywordChange () {
        this.param.condition = this.param.condition.trim()
        this.param.pageSize = 10
        this.param.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      regionSearch (data) {
        if (data !== '' && data !== undefined) {
          if (data.length > 0  && data[data.length - 1] !== undefined) {
            this.param.address = data[data.length - 1].value
          } else {
            this.param = {}
            delete this.param.address
          }
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
          K: 'GET_ALL_ROCKETS',
          V: param
        }
        getRegion(par).then((res) => {
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
        if ( this.regionIds[this.regionIds.length - 1] !== undefined) {
          this.updateModal.stationId = this.regionIds[this.regionIds.length - 1] + ''
        }
        if (data !== '' && data !== undefined && data.length !== 0) {
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
        } else {
          this.updateModal.stationId = ''
        }
      },
      regionBlind (data) {
        if (this.regionIds[this.regionIds.length - 1] !== undefined) {
          this.blindModal.stationId = this.regionIds[this.regionIds.length - 1] + ''
        }
        if (data !== '' && data !== undefined && data.length !== 0) {
          let daLen = data[data.length - 1].value + ''
          if (this.blindModal.stationId !== undefined && this.blindModal.stationId.length > daLen.length && this.blindModal.stationId.length > 6) {
            this.blindModal.stationId = this.blindModal.stationId - 0
          } else if (daLen.length <= 6) {
            this.blindNotice = true
            this.blindModal.stationId = ''
          } else {
            this.blindNotice = false
            this.blindModal.stationId = data[data.length - 1].value
          }
        } else {
          this.blindModal.stationId = ''
        }
      }
    },
    created:function () {
      this.getTableDatas(this.param)
      // 发射架类型
      let par= {
        K: 'LAUNCHER_TYPE',
        V: {}
      }
      Launch(par).then((res) => {
        if (res.data.R) {
          this.modelList = res.data.V.RESULT
        }
      })
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
