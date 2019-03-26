<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          炮架禁射区管理
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox" style="padding-top: 15px">
          <Col span="24">
          <Row type="flex" justify="start">
            <span style="font-size: 14px;margin-bottom: 10px">站名:  {{stationName}}</span>
          </Row>
          <Row type="flex" justify="start">
            <span style="font-size: 14px;margin-bottom: 5px">禁射区（方位起始角度，方位结束角度，高低起始角度，高低结束角度）:  {{angles}}</span>
          </Row>
          </Col>
        </Row>
        <div class="tableBox">
          <Row type="flex" justify="start">
            <Button @click="back" class="btn-list" style="width:130px;margin:-10px 20px 10px 0px ">返回站点禁射区</Button>
            <Input  v-model="param.condition" icon="ios-close-circle" @on-click="backKeyword" ref="search" placeholder="终端编号/炮架编号搜索" style="width: 300px;margin-top: -10px" @on-change="keywordChange()"></Input>
          </Row>
          <Table border size="small" :columns="columns" :data="dataTable" :no-data-text="noText"></Table>
        </div>
        <div class="pages-block">
          <div class="pages-right">
            <Page :total="total" :page-size="rows" @on-page-size-change="doPageSizeChange" @on-change="change" show-sizer show-total :page-size-opts="size"                    ref="tablePage" show-elevator :transfer="true"></Page>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-model="editUser"
      title="禁射区编辑"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="830">
      <Form :model="updateModal" ref="updateModal">
        <Row type="flex" justify="start">
          <Col span="24">
          <div style="margin-bottom: 10px">
            <span style="font-size: 14px;font-weight:600;margin-right:10px">炮架名称:</span>{{rockerName}}
          </div>
          <Row type="flex" justify="start">
            <Col span="12">
            <Button   @click="handleAdd" class="btn-list">添加</Button>
            </Col>
          </Row>
          <FormItem label="">
            <Row v-for="(item, index) in updateModal.angleList" :key="index" style="margin-bottom: 10px">
              <Col span="24">
              <span style="font-size: 14px;font-weight: 600">方位：</span>
              起始角度<InputNumber :max="360" :min="0" :step="0.05" v-model="item.angleStart"  @on-change="startVal(index)" style="margin-right: 10px;margin-left: 10px"></InputNumber>
              结束角度<InputNumber :max="360" :min="0" :step="0.05"  v-model="item.angleEnd" @on-change="endVal(index)"  style="margin-right: 10px;margin-left: 10px" ></InputNumber>
              <span style="font-size: 14px;font-weight: 600">高低：</span>
              起始角度<InputNumber :max="360" :min="0" :step="0.05" v-model="item.altitudeLow" @on-change="azimuthVal(index)"  style="margin-right: 10px;margin-left: 10px"  ></InputNumber>
              结束角度<InputNumber :max="360" :min="0" :step="0.05"  v-model="item.altitudeHigh" @on-change="heightVal(index)"  style="margin-right: 10px;margin-left: 10px" ></InputNumber>
              <Button type="text" style="color:#00B9D3;" @click="handleRemove(index)">删除</Button>
              </Col>
              <Col span="6">
              <span class="notice" v-if="item.startNotice">请输入方位起始角度</span>
              </Col>
              <Col span="6">
              <span class="notice" v-if="item.endNotice">请输入方位结束角度</span>
              <span class="notice" v-if="item.comNotice">方位结束角度应大于起始角度</span>
              </Col>
              <Col span="6">
              <span class="notice" v-if="item.azimuthNotice">请输入高低起始角度</span>
              </Col>
              <Col span="6">
              <span class="notice" v-if="item.heightNotice">请输入高低结束角度</span>
              <span class="notice" v-if="item.comhNotice">高低结束角度应大于起始角度</span>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Col span="24" push="11">
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
  import { stationRule } from '../../api/api'
  export default {
    data () {
      return {
        obj: {},
        noText: '',
        editUser: false,
        trueList: [],
        rockerName: '',
        angles: '',
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          stationId: '',
          pageNum: 1,
          pageSize: 10
        },
        stationName: '',
        updateModal: {
          terminalId: '',
          address: '',
          angleList: []
        },
        submit: {
          terminalId: '',
          stationRules: []
        },
        columns:[
          {
            title: '终端编号',
            key: 'terminalId',
            align: 'center',
            width: 200
          },
          {
            title: '炮架编号',
            key: 'launcherId',
            align: 'center',
            width: 200
          },
          {
            title: '炮架名称',
            key: 'rockerName',
            align: 'center',
            width: 200
          },
          {
            title: '炮架类型',
            key: 'model',
            align: 'center',
            width: 200
          },
          {
            title: '禁射区（方位起始角度，方位结束角度，高低起始角度，高低结束角度）',
            key: 'angles',
            align: 'center',
            render: (h, params) => {
              if (params.row.angles.length !== 0) {
                for (let i = 0; i < params.row.angles.length; i++) {
                  params.row.angles[i] = '(' + params.row.angles[i].replace("\"", "") + ')  '
                }
                return h('div',params.row.angles)
              } else {
                return h('div','-')
              }
            }
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
                }, '编辑')])
            }
          }
        ],
        dataTable:[]
      }
    },
    methods: {
      back () {
        this.$router.push({name:'operationManage', params: {param: this.$route.params.param}})
      },
      edit (row) {
        this.updateModal.angleList = []
        this.editUser = true
        this.rockerName = row.rockerName
        this.updateModal.launcherId = row.launcherId
        this.updateModal.terminalId = row.terminalId
        if (row.angles.length !== 0) {
          for (let i = 0; i < row.angles.length; i++) {
            let angle = row.angles[i].replace("\(","").replace("\)  ","").split(',') //["30", "40", "0", "30"]
            let s = {}
            for (let j = 0; j < angle.length; j++) {
              angle[j] = parseInt(angle[j])
              s = {
                angleStart: angle[0],
                angleEnd: angle[1],
                altitudeLow: angle[2],
                altitudeHigh: angle[3],
              }
            }
            this.updateModal.angleList[i] = s
          }
        }
      },
      submitVal () {
        this.trueList = []
        for (let i = 0; i < this.updateModal.angleList.length; i++) {
          if (this.updateModal.angleList[i].angleStart === null) {
            this.$Message.error('请输入方位起始角度')
            return false
          } else if (this.updateModal.angleList[i].angleEnd === null) {
            this.$Message.error('请输入方位结束角度')
            return false
          } else if (this.updateModal.angleList[i].angleEnd < this.updateModal.angleList[i].angleStart) {
            this.updateModal.angleList[i].comNotice = true
            this.$Message.error('方位结束角度应大于起始角度')
            return false
          } else if (this.updateModal.angleList[i].altitudeLow === null) {
            this.$Message.error('请输入高低起始角度')
            return false
          } else if (this.updateModal.angleList[i].altitudeHigh === null) {
            this.$Message.error('请输入高低结束角度')
            return false
          } else if (this.updateModal.angleList[i].altitudeHigh < this.updateModal.angleList[i].altitudeLow) {
            this.updateModal.angleList[i].comhNotice = true
            this.$Message.error('高低结束角度应大于起始角度')
            return false
          } else {
            this.trueList[i] = true
          }
        }
        if (this.updateModal.angleList.length === this.trueList.length) {
          return true
        } else if (this.updateModal.angleList.length === 0) {
          return true
        }
      },
      okEdit () {
        this.submit.stationRules = []
        this.submit.terminalId = this.updateModal.terminalId
        if (this.updateModal.angleList.length !== 0) {
          for (let i = 0; i < this.updateModal.angleList.length; i++) {
            var s = {
              angleStart: this.updateModal.angleList[i].angleStart,
              angleEnd: this.updateModal.angleList[i].angleEnd,
              altitudeLow: this.updateModal.angleList[i].altitudeLow,
              altitudeHigh: this.updateModal.angleList[i].altitudeHigh,
            }
            this.submit.stationRules[i] = s
          }
        } else {
          this.submit.stationRules = []
        }
        if (this.submitVal()) {
          let par = {
            K: 'SAVE_TERMINAL_RULE',
            V: this.submit
          }
          stationRule(par).then((res) => {
            if (res.data.R) {
              this.editUser = false
              this.$Message.info('编辑成功')
              this.getTableDatas(this.param)
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      cancelAdd () {},
      startVal (index) {
        if (this.updateModal.angleList[index].angleStart === null) {
          this.updateModal.angleList[index].startNotice = true
        } else {
          this.updateModal.angleList[index].startNotice = false
        }
      },
      endVal (index) {
        if (this.updateModal.angleList[index].angleEnd === null) {
          this.updateModal.angleList[index].endNotice = true
        } else {
          if (this.updateModal.angleList[index].angleEnd < this.updateModal.angleList[index].angleStart) {
            this.updateModal.angleList[index].comNotice = true
          } else {
            this.updateModal.angleList[index].comNotice = false
          }
          this.updateModal.angleList[index].endNotice = false
        }
      },
      azimuthVal (index) {
        if (this.updateModal.angleList[index].altitudeLow === null) {
          this.updateModal.angleList[index].azimuthNotice = true
        } else {
          this.updateModal.angleList[index].azimuthNotice = false
        }
      },
      heightVal (index) {
        if (this.updateModal.angleList[index].altitudeHigh === null) {
          this.updateModal.angleList[index].heightNotice = true
        } else {
          if (this.updateModal.angleList[index].altitudeHigh < this.updateModal.angleList[index].altitudeLow) {
            this.updateModal.angleList[index].comhNotice = true
          } else {
            this.updateModal.angleList[index].comhNotice = false
          }
          this.updateModal.angleList[index].heightNotice = false
        }
      },
      handleAdd () {
        if (this.updateModal.angleList.length > 0 && this.updateModal.angleList.length < 5) {
          if (this.updateModal.angleList[this.updateModal.angleList.length - 1].angleStart === null) {
            this.updateModal.angleList[this.updateModal.angleList.length - 1].startNotice = true
          } else if (this.updateModal.angleList[this.updateModal.angleList.length - 1].angleEnd === null) {
            this.updateModal.angleList[this.updateModal.angleList.length - 1].endNotice = true
          } else if (this.updateModal.angleList[this.updateModal.angleList.length - 1].angleEnd < this.updateModal.angleList[this.updateModal.angleList.length - 1].angleStart) {
            this.updateModal.angleList[this.updateModal.angleList.length - 1].comNotice = true
          } else if (this.updateModal.angleList[this.updateModal.angleList.length - 1].altitudeLow === null) {
            this.updateModal.angleList[this.updateModal.angleList.length - 1].azimuthNotice = true
          } else if (this.updateModal.angleList[this.updateModal.angleList.length - 1].altitudeHigh === null) {
            this.updateModal.angleList[this.updateModal.angleList.length - 1].heightNotice = true
          }  else if (this.updateModal.angleList[this.updateModal.angleList.length - 1].altitudeHigh < this.updateModal.angleList[this.updateModal.angleList.length - 1].altitudeLow) {
            this.updateModal.angleList[this.updateModal.angleList.length - 1].comhNotice = true
          } else {
            var s = {
              angleStart: 0,
              angleEnd: 0,
              altitudeLow: 0,
              altitudeHigh: 0,
              startNotice: false,
              endNotice: false,
              comNotice: false,
              azimuthNotice: false,
              heightNotice: false,
              comhNotice: false
            }
            // this.updateModal.angleList[this.updateModal.angleList.length - 1].heightNotice = false
            this.updateModal.angleList.push(s)
          }
        } else if (this.updateModal.angleList.length === 0) {
          var s = {
            angleStart: 0,
            angleEnd: 0,
            altitudeLow: 0,
            altitudeHigh: 0,
            startNotice: false,
            endNotice: false,
            comNotice: false,
            azimuthNotice: false,
            heightNotice: false,
            comhNotice: false
          }
          this.updateModal.angleList.push(s)
        } else {
          this.$Message.error('最多添加5条！')
        }
      },
      handleRemove (index) {
        this.updateModal.angleList.splice(index, 1)
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
      // 查询公用方法
      getTableDatas: function (param) {
        let vm = this
        this.noText = '加载中'
        vm.$Loading.start()
        let params = {
          K: 'TERMINAL_RULE_LIST',
          V: param
        }
        stationRule(params).then((res) => {
          vm.$Loading.finish()
          if (res.data.R) {
            vm.dataTable = res.data.V.RESULT.list
            vm.total = res.data.V.RESULT.total
            vm.$refs.tablePage.currentPage = vm.page
            if (res.data.V.RESULT.list.length === 0) {
              this.noText = '该站点暂无炮架'
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
    created: function () {
      let para = localStorage.getItem('para')
      if (para !== null) {
        this.obj = JSON.parse(para)
        this.param.stationId = this.obj.stationId
        this.angles = this.obj.angleList
        this.stationName = this.obj.stationName
      } else {
        this.param.stationId = this.$route.params.index.stationId
        if (this.$route.params.index.angles[0] !== null) {
          for (let i = 0; i < this.$route.params.index.angles.length; i++) {
            this.$route.params.index.angles[i] = this.$route.params.index.angles[i].replace("\"", "")
            this.angles += this.$route.params.index.angles[i] + ''
          }
        }
        this.stationName = this.$route.params.index.stationName
      }
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
