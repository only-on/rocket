<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          作业问题记录管理
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row type="flex" justify="start" style="margin-top: 10px">
            <Col :xs="24" :lg="18" :style="{marginBottom: '10px'}">
            <div class="search-title" style="letter-spacing: 1px">炮架名称</div>
            <regionGun @region="regionSearch" :reigonIds="regionIds"></regionGun>
            </Col>
            <Col :xs="24" :lg="6" :style="{marginBottom: '10px'}">
            <div  class="search-title" style="margin-right: 30px"> 状态</div>
            <Select v-model="param.status" clearable style="width:150px;float: left" @on-change="selStatus" placeholder="作业问题状态">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col span="24">
            <div  class="search-title" style="margin-right: 12px"> 关键字</div>
            <Input  v-model="param.keyword" icon="ios-close-circle" @on-click="backKeyword" ref="search" placeholder="作业问题/记录人搜索" style="width: 270px; float: left;" @on-change="keywordChange()">
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
      title="添加作业问题记录"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="850px">
      <Form :model="updateModal" :label-width="80" ref="updateModal" :rules="ruleValidate">
        <Row type="flex" justify="center">
          <Col span="22">
          <FormItem label="炮架名称" prop="stationId">
            <regionGun @region="regionChange" style="float:left;" :regionIds="regionIds"></regionGun>
            <span class="notice" v-if="terNotice">炮架名称不能为空</span>
            <br>
          </FormItem>
          <FormItem label="作业时间" prop="workTime">
            <Select  style="width:180px;float:left;text-align: center" placeholder="作业时间" @on-change="selectTime" v-model="workTime" clearable :label-in-value="true">
              <Option v-for='(items, index) in timeList' :value='items' :key="index">{{items}}</Option>
            </Select>
            <br>
          </FormItem>
          <FormItem label="作业批次" prop="batch">
            <Select  style="width:405px;float:left;text-align: center" placeholder="作业批次" @on-change="selectBatch"  clearable v-model="batch" :label-in-value="true">
              <Option v-for='(items, index) in keys' :value='items' :key="index">{{items}}</Option>
            </Select>
            <br>
          </FormItem>
          <FormItem label="作业问题" prop="content" style="width: 600px">
            <Input v-model="updateModal.content" type="textarea" :rows="5"  placeholder="" @on-change="checkCon(updateModal.content)"></Input>
            <span class="notice" v-if="workNoticeNum">作业问题字数不能超过200字</span>
            <span style="float: left;margin-left:500px;">{{wordNum}}/200</span>
            <br>
          </FormItem>
          <FormItem>
            <Col span="24" push="9">
            <Button class="btn-list" @click="okAdd">保存</Button>
            </Col>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Modal
      v-model="editUser"
      title="编辑作业问题记录"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="850px">
      <Form :model="editModal" :label-width="80" ref="editModal" :rules="ruleValidate">
        <Row type="flex" justify="center">
          <Col span="22">
          <FormItem label="炮架名称" prop="stationId">
            <Select  style="width:90px;float:left;text-align: center" placeholder="省" @on-change="changeProvice" clearable v-model="pid" :label-in-value="true">
              <Option v-for='(items, index) in region' :value='items.id' :key="index">{{items.name}}</Option>
            </Select>
            <Select  style="width:90px;float:left;text-align: center" placeholder="市" @on-change="changeCity"  clearable v-model="cid" :label-in-value="true">
              <Option v-for='(items, index) in regionCity' :value='items.id' :key="index">{{items.name}}</Option>
            </Select>
            <Select  style="width:90px;float:left;text-align: center" placeholder="区县" @on-change="changeCountry"  clearable v-model="did" :label-in-value="true">
              <Option v-for='(items, index) in regionCountry' :value='items.id' :key="index">{{items.name}}</Option>
            </Select>
            <Select  style="width:130px;float:left;text-align: center" placeholder="站点" @on-change="changeSite"  clearable v-model="sid" :label-in-value="true">
              <Option v-for='(items, index) in site' :value='items.id' :key="index">{{items.name}}</Option>
            </Select>
            <Select  style="width:130px;float:left;text-align: center" placeholder="炮架名称" @on-change="searchLanuch"  clearable v-model="tid" :label-in-value="true" @on-clear="clearSelect">
              <Option v-for='(items, index) in typeList' :value='items.id' :key="index">{{items.name}}</Option>
            </Select>
            <span class="notice" v-if="terNotice">炮架名称不能为空</span>
            <br>
          </FormItem>
          <FormItem label="作业时间" prop="workTime">
            <Select  style="width:180px;float:left;text-align: center" placeholder="作业时间" @on-change="selectTimeEdit" v-model="workTimeEdit" clearable :label-in-value="true" @on-clear="clearTime">
              <Option v-for='(items, index) in timeList' :value='items' :key="index">{{items}}</Option>
            </Select>
            <br>
          </FormItem>
          <FormItem label="作业批次" prop="batch">
            <Select  style="width:405px;float:left;text-align: center" placeholder="作业批次" @on-change="selectBatchEdit"  clearable v-model="batchEdit" :label-in-value="true" @on-clear="clearBatch">
              <Option v-for='(items, index) in keys' :value='items' :key="index">{{items}}</Option>
            </Select>
            <br>
          </FormItem>
          <FormItem label="作业问题"  style="width: 600px" prop="content">
            <Input v-model="editModal.content" type="textarea" :rows="5"  placeholder="" @on-change="checkConEdit(editModal.content)"></Input>
            <span class="notice" v-if="workNoticeNumEdit">作业问题字数不能超过200字</span>
            <span style="float: left;margin-left:500px;">{{wordNumEdit}}/200</span>
            <br>
          </FormItem>
          <FormItem>
            <Col span="24" push="9">
            <Button class="btn-list" @click="okEdit">保存</Button>
            </Col>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Modal
      v-model="statusEdit"
      title="更改作业问题记录状态"
      ok-text="保存"
      @on-ok="okStatus"
      @on-cancel="cancelAdd">
      <Form :model="editStatus">
        <Row type="flex" justify="center" style="padding: 20px 0">
          <RadioGroup v-model="editStatus.status">
            <Radio label="1" style="margin-right:20px">已解决</Radio>
            <Radio label="2">无效</Radio>
          </RadioGroup>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { workLog, getRegion, Launch } from '../../api/api'
  import regionGun from '../../components/regionGun'
  import store from '../../store/store'
  export default {
    components: {
      regionGun
    },
    data () {
      return {
        station: '',
        pid: '',
        cid: '',
        did: '',
        sid: '',
        tid: '',
        terminalId:'',
        regions: [],
        region: [],
        regionCity: [],
        regionCountry: [],
        site: [],
        typeList: [],
        editModal: {
          id: '',
          stationId: '',
          terminalId: '',
          workTime: '',
          content: ''
        },
        batchEdit: '',
        batchEdit1: '',
        workTimeEdit: '',
        workTimeEdit1: '',
        workTimeEdit2: '',
        workNoticeNum: false,
        workNoticeNumEdit: false,
        statusEdit: false,
        editStatus: {
          id: '',
          status: '1'
        },
        statusList: [
          {
            value: 0,
            label: '未解决'
          },
          {
            value: 1,
            label: '已解决'
          },
          {
            value: 2,
            label: '无效'
          }
        ],
        stationId: '',
        regionIds: [],
        wordNum: 0,
        wordNumEdit: 0,
        workNoticeEdit: false,
        terNotice: false,
        workNotice: false,
        conNotice: false,
        addUser: false,
        editUser: false,
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          pageNum: 1,
          pageSize: 10
        },
        updateModal: {
          stationId: '',
          terminalId: '',
          workTime: '',
          content: ''
        },
        workTime: '',
        beginTime: '',
        timeList: [],
        batch: '',
        keys: [],
        columns:[
          {
            title: '序号',
            key: 'id',
            align: 'center',
            width: 70
          },
          {
            title: '站名',
            key: 'stationName',
            align: 'center'
          },
          {
            title: '地址',
            key: 'stationAddress',
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
            title: '作业问题',
            key: 'content',
            ellipsis: true,
            align: 'center',
            render: (h, params) => {
              let display = params.row.content === null ? 'none' : 'inline'
              return h('div', {
                style: {
                  marginRight: '20px',
                  display: display
                }
              },[
                h('Tooltip', {
                  props: { placement: 'bottom-start' }
                }, [
                  h('span',params.row.content !== null && params.row.content.length > 10 ? params.row.content.substr(0,10) + '...' : params.row.content.length <= 10 ? params.row.content : ''),
                  h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all'} },params.row.content)
                ])
              ])
            }
          },
          {
            title: '记录人',
            key: 'userId',
            align: 'center'
          },
          {
            title: '记录时间',
            key: 'createTime',
            align: 'center'
          },
          {
            title: '作业时间',
            key: 'workTime',
            tooltip: true,
            align: 'center'
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            render: (h, params) => {
              let status = params.row.status === 0 ? '未解决' : params.row.status === 1 ? '已解决' :'无效'
              let text = params.row.status === 0 ? '更改状态' : params.row.status === 1 ? '已解决' :'无效'
              let statu = params.row.status === 0 ? '#00B9D3' : '#666'
              return h('div', [
                h('Tooltip', {
                  props: {
                    placement: 'top'
                  }
                }, [
                  h('div', {
                    style: {
                      color: statu,
                      cursor:'pointer'
                    },
                    on: {
                      click: () => {
                        this.updateStatus(params.row)
                      }
                    }
                  }, status),
                  h('div', {
                    slot: 'content'
                  }, [
                    h('div', [
                      h('div', text)
                    ])
                  ])
                ])
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              let display = params.row.status === 0 ? 'inline-block' : 'none'
              let dis = params.row.isUpdate === true ? false : true
              // let color = params.row.status === 0 ? '#00B9D3' : '#d3d3d3'
              let isUpdate = params.row.isUpdate === true ? '#00B9D3': '#d3d3d3'
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    disabled: dis
                  },
                  style: {
                    color: isUpdate,
                    display: display
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                }, '编辑')
              ])
            }
          }
        ],
        dataTable:[],
        ruleValidate: {
          stationId: [
            {required: true, message: '炮架名称不能为空', trigger: 'blur'}
          ],
          workTime: [
            {required: true, message: '作业时间不能为空', trigger: 'blur'}
          ],
          batch: [
            {required: true, message: '作业批次不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '作业问题不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      updateStatus (row) {
        if (row.status === 0) {
          this.statusEdit = true
          this.editStatus.id = row.id
        } else {
          this.statusEdit = false
        }
      },
      okStatus () {
        this.editStatus.status = this.editStatus.status - 0
        let par = {
          K: 'UPDATE_STUTAS',
          V: this.editStatus
        }
        workLog(par).then((res) => {
          if (res.data.R) {
            this.getTableDatas(this.param)
            this.$Message.success('状态更改成功！')
          } else {
            this.editStatus.status = '1'
            this.$Message.error(res.data.ERR_MSG)
          }
        })
      },
      // 作业时间
      selectTime (data) {
        this.batch = ''
        this.keys = []
        if (data !== '' && data !== undefined) {
          this.beginTime = data.value + ' 00:00:00'
          this.bitchSea(this.beginTime,this.updateModal.terminalId)
        } else {
          this.workTime = ''
        }
      },
      // 作业批次
      selectBatch (data) {
        if (data !== '' && data !== undefined) {
          this.updateModal.workTime = data.value
        } else {
          this.updateModal.workTime = ''
        }
      },
      add () {
        this.workTime = ''
        this.updateModal.workTime = ''
        this.timeList = []
        this.keys = []
        this.wordNum = 0
        this.workNoticeNum = false
        this.updateModal = {
          stationId: '',
          terminalId: '',
          content: ''
        }
        this.regionIds = []
        this.addUser = true
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
      edit (row) {
        this.pid = ''
        this.cid = ''
        this.did = ''
        this.sid = ''
        this.tid = ''
        this.batchEdit1 = ''
        this.workTimeEdit2 = ''
        this.wordNumEdit = 0
        this.workNoticeNumEdit = false
        this.editUser = true
        this.editModal.id = row.id
        this.editModal.content = row.content
        this.editModal.terminalId = row.terminalId
        this.editModal.workTime = row.workTime
        this.timeSea(this.editModal.terminalId)
        if (row.workTime !== null && row.workTime !== undefined) {
          this.workTimeEdit2 = row.workTime.substr(0,10)
        }
        this.workTimeEdit1= this.workTimeEdit2 + ' 00:00:00'
        this.bitchSea(this.workTimeEdit1,this.editModal.terminalId)
        this.batchEdit1 = row.workTime
        if (row.content !== '' && row.content !== undefined) {
          this.wordNumEdit = this.editModal.content.length
        }
        this.stationId = row.stationId.toString()
        this.pid = this.stationId.substr(0,2) - 0
        this.terminalId = row.terminalId
        this.getAllProvice()
        this.getRegionChange()
        this.editModal.terminalId = row.terminalId
        this.editModal.stationId = this.stationId.substr(0) - 0
      },
      // 查询时间
      timeSea (param) {
        let par = {
          K: 'GET_LAUNCH_DATE_PULL',
          V: {
            terminalId: param
          }
        }
        Launch(par).then((res) => {
          if (res.data.R) {
            this.timeList = []
            if (res.data.R) {
              for (let i = 0; i < res.data.V.RESULT.length; i++) {
                this.timeList[i] = res.data.V.RESULT[i].substr(0,10)
              }
            }
            this.workTimeEdit = this.workTimeEdit2
          }
        })
      },
      // 查询批次
      bitchSea (time,terminalId) {
        let par = {
          K: 'WORK_TIME',
          V: {
            terminalId: terminalId,
            beginTime: time
          }
        }
        workLog(par).then((res) => {
          if (res.data.R) {
            this.batchEdit= this.batchEdit1
            if (res.data.V.RESULT.length !== 0) {
              this.keys = res.data.V.RESULT
            }
          }
        })
      },
      // 编辑作业时间
      selectTimeEdit (data) {
        this.batchEdit = ''
        this.keys = []
        if (data !== '' && data !== undefined) {
          this.beginTime = data.value + ' 00:00:00'
          this.bitchSea(this.beginTime,this.editModal.terminalId)
        }
      },
      // 清空作业时间
      clearTime () {
        this.workTimeEdit = ''
        this.batchEdit= ''
        this.batchEdit1 = ''
        this.keys = []
        this.editModal.workTime = ''
      },
      // 编辑作业批次
      selectBatchEdit (data) {
        if (data !== '' && data !== undefined) {
          this.editModal.workTime = data.value
        }
      },
      // 清空作业批次
      clearBatch () {
        this.editModal.workTime = ''
        this.batchEdit = ''
        this.batchEdit1 = ''
      },
      // 终端编号----------------------------------------------------------------
      getAllProvice (param) {
        let par = {
          K: 'GET_STATION_COMPONET',
          V: param
        }
        getRegion(par).then((res) => {
          this.region.push(res.data.V.RESULT)
        })
      },
      changeProvice (change) {
        this.typeList = []
        this.regions = []
        this.cid = ''
        this.did = ''
        this.sid = ''
        this.tid = ''
        if (change !== '' && change !== undefined) {
          this.regions[0] = change
          this.pid = change.value
          let par = {
            K: 'GET_STATION_COMPONET',
            V: {
              stationId: this.pid
            }
          }
          getRegion(par).then((res) => {
            if (res.data.V.RESULT instanceof Array) {
              this.regionCity = res.data.V.RESULT
            } else {
              this.regionCity.push(res.data.V.RESULT)
            }
          })
        } else {
          this.regions = []
          this.regionCity = []
        }
      },
      changeCity (change) {
        this.typeList = []
        this.did = ''
        this.sid = ''
        this.tid = ''
        if (change !== '' && change !== undefined) {
          this.regions[1] = change
          this.cid = change.value
          let par = {
            K: 'GET_STATION_COMPONET',
            V: {
              stationId: this.cid
            }
          }
          getRegion(par).then((res) => {
            if (res.data.V.RESULT instanceof Array) {
              this.regionCountry = res.data.V.RESULT
            } else {
              this.regionCountry.push(res.data.V.RESULT)
            }
          })
        } else {
          this.regions.splice(1, 3)
          this.regionCountry = []
        }
      },
      changeCountry (change) {
        this.typeList = []
        this.sid = ''
        this.tid = ''
        if (change !== '' && change !== undefined) {
          this.regions[2] = change
          this.did = change.value
          let par = {
            K: 'GET_STATION_COMPONET',
            V: {
              stationId: this.did
            }
          }
          getRegion(par).then((res) => {
            if (res.data.V.RESULT instanceof  Array) {
              this.site = res.data.V.RESULT
            } else {
              this.site.push(res.data.V.RESULT)
            }
          })
        } else {
          this.regions.splice(2, 3)
        }
      },
      changeSite (change) {
        this.typeList = []
        this.tid = ''
        if (change !== '' && change !== undefined) {
          this.regions[3] = change
          this.sid = change.value
          this.editModal.stationId = change.value
          let par = {
            K: 'GET_STATION_COMPONET',
            V: {
              stationId: this.sid
            }
          }
          getRegion(par).then((res) => {
            if (res.data.R) {
              for (let i = 0; i < res.data.V.RESULT.length; i++) {
                let s = {
                  id: res.data.V.RESULT[i],
                  name: res.data.V.rocketNames[i]
                }
                this.typeList.push(s)
              }
            }
          })
        } else {
          this.regions.splice(3, 2)
        }
      },
      searchLanuch (change) {
        this.workTimeEdit = ''
        this.timeList = []
        this.batchEdit = ''
        this.keys = []
        if (change !== '' && change !== undefined) {
          this.regions[4] = change
          this.editModal.terminalId = change.value - 0
          this.timeSea(this.editModal.terminalId)
        } else {
          // this.editModal.terminalId = ''
          this.regions.splice(4, 1)
          this.timeList = []
          this.keys = []
        }
      },
      // 清空终编号
      clearSelect() {
        this.editModal.terminalId = ''
        this.editModal.workTime = ''
        this.timeList = []
        this.keys = []
        this.workTimeEdit2 = ''
        this.batchEdit1 = ''
      },
      getRegionChange () {
        let par = {
          K: 'GET_STATION_COMPONET',
          V: {
            stationId: this.pid
          }
        }
        getRegion(par).then((res) => {
          if (res.data.R) {
            if (res.data.V.RESULT instanceof Array) {
              this.regionCity = res.data.V.RESULT
            } else {
              this.regionCity.push(res.data.V.RESULT)
            }
            this.cid = this.stationId.substr(0,4) - 0
            this.regionC(this.cid)
          }
        })
      },
      regionC (stationId) {
        this.regionCountry = []
        let par = {
          K: 'GET_STATION_COMPONET',
          V: {
            stationId: stationId
          }
        }
        getRegion(par).then((res) => {
          if (res.data.R) {
            if (res.data.V.RESULT instanceof  Array) {
              this.regionCountry = res.data.V.RESULT
            } else {
              this.regionCountry.push(res.data.V.RESULT)
            }
            this.did = this.stationId.substr(0,6) - 0
            this.site = []
            this.regionD(this.did)
          }
        })
      },
      regionD (stationId) {
        this.site = []
        let par = {
          K: 'GET_STATION_COMPONET',
          V: {
            stationId: stationId
          }
        }
        getRegion(par).then((res) => {
          if (res.data.R) {
            if (res.data.V.RESULT instanceof  Array) {
              this.site = res.data.V.RESULT
            } else {
              this.site.push(res.data.V.RESULT)
            }
            this.sid = this.stationId.substr(0) - 0
            this.regionT(this.sid)
          }
        })
      },
      regionT (stationId) {
        this.typeList  = []
        let par3 = {
          K: 'GET_STATION_COMPONET',
          V: {
            stationId: stationId
          }
        }
        getRegion(par3).then((res) => {
          if (res.data.R) {
            for (let i = 0; i < res.data.V.RESULT.length; i++) {
              let s = {
                id: res.data.V.RESULT[i],
                name: res.data.V.rocketNames[i]
              }
              this.typeList.push(s)
            }
            this.tid = this.terminalId
          }
        })
      },
      //------------------------------------------------------------------------------
      checkCon (data) {
        if (data !== '' && data !== undefined) {
          this.wordNum = data.trim().length
          if (this.wordNum > 200) {
            this.workNoticeNum = true
          } else {
            this.workNoticeNum = false
          }
        } else {
          this.wordNum = 0
        }
      },
      submitVal () {
        if (this.updateModal.terminalId === '' || this.updateModal.terminalId === undefined) {
          this.$Message.error('请选择炮架名称！')
          return false
        } else if (this.workTime === '' || this.workTime === undefined) {
          this.$Message.error('作业时间为空！')
          return false
        } else if (this.updateModal.workTime === '' || this.updateModal.workTime === undefined) {
          this.$Message.error('作业批次为空！')
          return false
        } else if (this.updateModal.content === '' || this.updateModal.content === undefined || this.wordNum === 0) {
          this.$Message.error('作业问题为空！')
          return false
        } else if (this.wordNum > 200) {
          this.$Message.error('作业问题字数大于200！')
          return false
        } else {
          return true
        }
      },
      // 添加站点
      okAdd () {
        if (this.submitVal()) {
          let par = {
            K: 'ADD',
            V: this.updateModal
          }
          workLog(par).then((res) => {
            if (res.data.R) {
              this.addUser = false
              this.wordNum = 0
              this.workNoticeNum = false
              this.updateModal = {
                stationId: '',
                terminalId: '',
                content: ''
              }
              this.regionIds = []
              this.getTableDatas(this.param)
              this.$Message.success('作业问题记录添加成功！')
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      cancelAdd () {},
      checkConEdit (data) {
        if (data !== '' && data !== undefined) {
          this.wordNumEdit = data.trim().length
          if (this.wordNumEdit > 200) {
            this.workNoticeNumEdit = true
          } else {
            this.workNoticeNumEdit = false
          }
        } else {
          this.wordNumEdit = 0
        }
      },
      submitEdit () {
        if (this.editModal.terminalId === '' || this.editModal.terminalId === undefined) {
          this.$Message.error('请选择炮架名称！')
          return false
        } else if (this.workTimeEdit === '' || this.workTimeEdit === undefined) {
          this.$Message.error('作业时间为空！')
          return false
        } else if (this.editModal.workTime === '' || this.editModal.workTime === undefined) {
          this.$Message.error('作业批次为空！')
          return false
        } else if (this.editModal.content === '' || this.editModal.content === undefined || this.wordNumEdit === 0) {
          this.$Message.error('作业问题为空！')
          return false
        } else if (this.wordNumEdit > 200) {
          this.$Message.error('作业问题字数大于200！')
          return false
        } else {
          return true
        }
      },
      // 编辑
      okEdit () {
        if (this.submitEdit()) {
          let par = {
            K: 'UPDATE',
            V: this.editModal
          }
          workLog(par).then((res) => {
            if (res.data.R) {
              this.editUser = false
              this.getTableDatas(this.param)
              this.$Message.success('作业问题记录编辑成功！')
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      remove (id) {
        // console.log(id)
        var th = this
        th.$Modal.confirm({
          title: '删除作业问题记录信息',
          content: `确定删除作业问题记录？`,
          onOk: function () {
            // let par = {
            //   userId: id
            // }
            // delUser(par).then((res) => {
            //   if (res.data.code === 1000) {
            //     if (th.param.pageNum > 1 && th.dataTable.length === 1) {
            //       th.param.pageNum = th.param.pageNum - 1
            //     }
            //     th.getTableDatas(th.param)
            //     th.$Message.success('告警删除成功！')
            //   } else {
            //     th.$Message.error(res.data.message)
            //   }
            // })
          },
          onCancel: function () {
            th.$Message.success('取消删除操作成功！')
          }
        })
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
      selStatus (data) {
        if (data !== '' && data !== undefined) {
          this.param.status = data
        } else {
          delete this.param.status
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
          K: 'LIST',
          V: param
        }
        workLog(par).then((res) => {
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
      regionSearch (data) {
        if (data !== '' && data !== undefined && data[data.length - 1] !== undefined) {
          if (data.length > 0 && data.length < 5) {
            this.param.stationId = data[data.length - 1].value
            delete this.param.terminalId
          } else if (data.length === 5 && data[data.length - 2] !== undefined) {
            this.param.stationId = data[data.length - 2].value
            this.param.terminalId = data[data.length - 1].value
          } else if (data.length === 5 && data[data.length - 2] === undefined) {
            this.param.stationId = parseInt(sessionStorage.getItem('stationId'))
            this.param.terminalId = data[data.length - 1].value
          } else {
            delete this.param.stationId
            delete this.param.terminalId
          }
        } else {
          delete this.param.stationId
          delete this.param.terminalId
        }
        this.param.pageSize = 10
        this.param.pageNum = 1
        this.page = 1
        this.getTableDatas(this.param)
      },
      regionChangeEdit (data) {
        if (data !== '' && data !== undefined) {
          if (data.length > 0 && data.length < 5) {
            if (data[data.length - 1] !== undefined) {
              this.editModal.stationId = data[data.length - 1].value
            }
            this.editModal.terminalId = ''
          } else if (data.length === 5) {
            if (data[data.length - 2] !== undefined) {
              this.editModal.stationId = data[data.length - 2].value
            }
            this.editModal.terminalId = data[data.length - 1].value
          } else {
            this.editModal.stationId = ''
            this.editModal.terminalId = ''
          }
        } else {
          this.editModal.stationId = ''
          this.editModal.terminalId = ''
        }
        console.log(data)
      },
      regionChange (data) {
        this.workTime = ''
        this.timeList = []
        this.batch = ''
        this.keys = []
        if (data !== '' && data !== undefined) {
          if (data.length > 0 && data.length < 5) {
            this.updateModal.stationId = data[data.length - 1].value
            this.updateModal.terminalId = ''
          } else if (data.length === 5) {
            this.updateModal.stationId = data[data.length - 2].value
            this.updateModal.terminalId = data[data.length - 1].value - 0
            this.timeSea(this.updateModal.terminalId)
          } else {
            this.updateModal.stationId = ''
            this.updateModal.terminalId = ''
          }
        } else {
          this.updateModal.stationId = ''
          this.updateModal.terminalId = ''
        }
        // console.log(data)
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
