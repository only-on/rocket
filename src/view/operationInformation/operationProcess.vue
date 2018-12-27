<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div>
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          作业过程信息统计
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox" style="border:none">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row type="flex" justify="start" style="margin-top: 10px">
            <Col :xs="24" :lg="14" :style="{marginBottom: '10px'}">
              <div class="search-title" style="letter-spacing: 0"> 炮架名称&nbsp;</div>
              <regionGun @region="regionChange"></regionGun>
            </Col>
            <Col :xs="24"  :lg="10" :style="{marginBottom: '10px'}">
              <div  class="search-title" style="letter-spacing: 0;margin-right: 15px">作业时间</div>
              <Select  style="width:180px;float:left" placeholder="作业时间" @on-change="selectTime"  clearable v-model="workTime" :label-in-value="true">
                <Option v-for='(items, index) in timeList' :value='items' :key="index">{{items}}</Option>
              </Select>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col span="24">
              <div  class="search-title" style="letter-spacing: 0;margin-right: 15px">作业批次</div>
              <Select  style="width:405px;float:left" placeholder="作业批次" @on-change="selectBatch"  clearable v-model="batch" :label-in-value="true">
                <Option v-for='(items, index) in keys' :value='items.id' :key="index">{{items.name}}</Option>
              </Select>
            </Col>
          </Row>
          </Col>
        </Row>
      </div>
    </div>
    <div class="body-content" style="margin-top: 20px;background-color: #fff;min-height: 630px;position: relative">
      <Row>
        <Button class="btn-list" v-if="workTime !== '' && workTime !== undefined && batch !== '' && batch !== undefined" @click="checkBtn" style="width:125px;color:#fff;position: absolute;left:20px;top:20px;cursor: pointer" >{{btnText}}</Button>
        <div v-if="workTime === '' || workTime === undefined || batch === '' || batch === undefined" style="font-size: 22px;margin-top: 200px">请先选择查询条件<br>
          <span style="font-size: 18px">(炮架名称、作业时间、作业批次 三个条件必选)</span>
        </div>
        <Timeline style="margin-top: 80px;margin-left: 100px">
          <TimelineItem color="#eff0f4" style="margin-top: 10px;" v-for="(items,indexs) in list" :key="indexs">
          <div style="margin-left: 40px">
            <div class="divPop" style="float:left;width: 70%;padding: 10px">
              <div style="font-size: 16px;color: red;text-align: left;">{{items.time}}</div>
              <div style="font-size: 15px;text-align: left;">
                <span :style="{'color':items.command ==='自检'? '#09AD2C':items.command ==='调炮'? '#ff9900':items.command ==='装订'? '#7660d4' :items.command ==='点火'?'#00B9D3':'#09AD2C'}">
                {{items.command}}
                </span><br>
                <span>
                高低: {{items.heightId}} &nbsp;&nbsp;
                方位: {{items.directionId}} &nbsp;&nbsp;
                <span v-if="items.command === '点火'"> 当前发射弹数: {{items.currentCount}} &nbsp;&nbsp;</span>
                <span v-if="items.command === '点火'"> {{rocketText}}: {{items.totalCount}} &nbsp;&nbsp;</span>
                <span v-if="items.command === '点火' && items.third === 1"> 故障数: {{items.brokenCount}} &nbsp;&nbsp;</span>
                <span v-if="items.command === '点火' && items.third === 1"> 操作员编号: {{items.operatorId}} &nbsp;&nbsp;</span>
                <span v-if="items.command === '装订'"> 抛撒时间: {{items.showTime}}</span> &nbsp;&nbsp;
                <span v-if="items.command === '装订'"> 开伞时间 : {{items.openTime}}</span> &nbsp;&nbsp;
                <span v-if="items.command === '装订'"> 预留时间: {{items.reserveTime}}</span> &nbsp;&nbsp;
                </span>
              </div>
            </div>
            <div class="divPopBefore"></div>
          </div>
          </TimelineItem>
        </Timeline>
      </Row>
    </div>
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
        param: {
          terminalId: '',
          time: ''
        },
        rocketText: '炮架发射总弹数',
        workTime: '',
        timeList: [],
        batch: '',
        sizeM: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        columns:[
          {
            title: '时间',
            key: 'time',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: 'red'
                  }
                }, params.row.time)
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              let showIcon = params.row.action === 0 ? 'load-a' : params.row.action === 1 ? 'ios-timer-outline' : params.row.action === 2 ? 'ios-stopwatch-outline' : params.row.action === 3 ? 'fireball' : params.row.action === 4 ? 'checkmark-round' : 'none'
              let showText = params.row.action === 0 ? '自检' : params.row.action === 1 ? '调炮' : params.row.action === 2 ? '装订' : params.row.action === 3 ? '点火' : params.row.action === 4 ? '结束' :  '-'
              return h('div', [
                h('Button', {
                  props: {
                    type: 'ghost',
                    // fontSize: '18px',
                    icon: showIcon
                  },
                  style: {
                    color: '#48B089',
                    fontSize: '18px'
                  }
                }, showText)
              ])
            }
          },
          {
            title: '高低',
            key: 'name',
            align: 'center'
          },
          {
            title: '方位',
            key: 'name',
            align: 'center'
          }
        ],
        dataTable:[
          {
          name: '100',
          time: '2018-06-12 14:52:07',
          action: 0
          },
          {
            name: '100',
            time: '2018-06-12 14:52:07',
            action: 1
          },
          {
            name: '100',
            time: '2018-06-12 14:52:07',
            action: 2
          },
          {
            name: '100',
            time: '2018-06-12 14:52:07',
            action: 3
          },
          {
            name: '100',
            time: '2018-06-12 14:52:07',
            action: 4
          },
          {
            name: '100',
            time: '2018-06-12 14:52:07',
            action: 0
          },
        ],
        typeList: [],
        keys: [],
        values: [],
        list: [],
        btnText: '标记为模拟作业',
        imitate: '',
        isImitate: [],
        isIm: '',
        startCounts: [],
        startCount: '',
        title: '标记为模拟作业',
        content: '模拟批次作业将不计入数据统计!',
        selectValue: ''
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
          this.param.time = data.value + ' 00:00:00'
          this.getTableDatas(this.param)
        }
        this.batch = ''
        this.keys = []
      },
      // 作业批次
      selectBatch (data) {
        if (data !== undefined) {
          this.selectValue = data.label
          if (this.selectValue.indexOf('模拟') !== -1) {
            let end = data.label.indexOf('模拟')
            this.selectValue = this.selectValue.substring(0,end)
          }
          this.startCount = this.startCounts[data.value]
          this.isIm = this.isImitate[data.value]
          if (this.isIm === 0) {
            this.btnText = '标记为模拟作业'
            this.title = '标记为模拟作业'
            this.content = '模拟批次作业将不计入数据统计!'
          } else if (this.isIm === 1) {
            this.btnText = '标记为正常作业'
            this.title = '标记为正常作业'
            this.content = '确定标记为正常作业?'
          }
          this.list = this.values[data.value]
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].command === -63 || this.list[i].command === -95) {
              this.list[i].command = '自检'
            } else if (this.list[i].command === -61 || this.list[i].command === -93) {
              this.list[i].command = '调炮'
            } else if (this.list[i].command === -87) {
              this.list[i].command = '装订'
            } else if (this.list[i].command === -51) {
              this.list[i].command = '点火'
              this.rocketText = '炮架发射总弹数'
            } else if (this.list[i].command === -83) {
              this.list[i].command = '点火'
              this.rocketText = '剩余弹数'
            } else if (this.list[i].command === -46) {
              this.list[i].third = 1
              this.list[i].command = '点火'
            } else if (this.list[i].command === -49 || this.list[i].command === -81) {
              this.list[i].command = '结束'
            }
          }
        } else {
          this.list = []
        }
      },
      checkText () {
        if (this.imitate = 0) {
          this.btnText = '标记为模拟作业'
          this.title = '标记为模拟作业'
          this.content = '模拟批次作业将不计入数据统计!'
        } else if (this.imitate = 1) {
          this.btnText = '标记为正常作业'
          this.title = '标记为正常作业'
          this.content = '确定标记为正常作业?'
        }
      },
      // 切换按钮
      checkBtn () {
        this.$Modal.confirm({
          title: this.title,
          content: '<p>'+ this.content+ '</p>',
          onCancel: () => {},
          onOk: () => {
            if (this.isIm === 0) {
              this.imitate = 1
            } else if (this.isIm === 1) {
              this.imitate = 0
            }
            let par = {
              K: 'CHANGE_IMITATE',
              V: {
                startCount: this.startCount,
                terminalId: this.param.terminalId,
                imitate: this.imitate,
                workDate:this.selectValue
              }
            }
            Launch(par).then((res) => {
                if (res.data.R) {
                  this.$Message.info('更改成功,请重新选择作业批次!')
                  this.checkText()
                  this.keys = []
                  this.getTableDatas(this.param)
                  this.batch = ''
                  // console.log(this.batch)
                  // this.batch = this.selectValue
                  // console.log(this.selectValue)
                } else {
                  this.$Message.error(res.data.ERR_MSG)
                }
            })
          }
        });
      },
      // 查询公用方法
      getTableDatas: function (param) {
        let vm = this
        vm.$Loading.start()
        let par = {
          K: 'LAUNCH_HISTORY',
          V: param
        }
        Launch(par).then((res) => {
          this.keys = []
          vm.$Loading.finish()
          if (res.data.R) {
            this.values = res.data.V.values
            this.startCounts = res.data.V.startCounts
            this.isImitate = res.data.V.isImitate
            for (let k = 0; k < res.data.V.keys.length; k++) {
              let s
              if (this.isImitate[k] === 0) {
                s = {
                  id: k,
                  name: res.data.V.keys[k]
                }
                this.keys.push(s)
              } else if (this.isImitate[k] === 1) {
                s = {
                  id: k,
                  name: res.data.V.keys[k] +' 模拟'
                }
                this.keys.push(s)
              }

            }
          }
        })
      },
      // 查询作业时间
      timeSea (terminalId) {
        let par = {
          K: 'GET_LAUNCH_DATE_PULL',
          V: {
            terminalId: terminalId
          }
        }
        Launch(par).then((res) => {
          this.timeList = []
          if (res.data.V.RESULT !== undefined) {
            for (let i = 0; i < res.data.V.RESULT.length; i++) {
              this.timeList[i] = res.data.V.RESULT[i].substr(0,10)
            }
          }
        })
      },
      // 区域---------------------------------------------------------------------------------------------
      regionChange (data) {
        this.keys = []
        this.timeList = []
        this.workTime = ''
        this.batch = ''
        if (data !== '' && data !== undefined) {
          if (data.length > 0 && data.length < 5) {
            this.param.terminalId = ''
            this.timeList = []
          } else if (data.length === 5) {
            this.param.terminalId = data[data.length - 1].value
            this.timeSea(this.param.terminalId - 0)
          }
        } else {
          this.param.terminalId = ''
          this.timeList = []
        }
      },
      // 选择终端编号
      searchLanuch (data) {
        this.keys = []
        this.batch = ''
        if (data !== '' && data !== undefined) {
          this.param.terminalId = data.value
        } else {
          // this.param.time = ''
          this.param.terminalId = ''
          this.date = ''
        }
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
  .divPop {
    margin-top: -19px;
    padding: 0px 10px;
    background-color: #fff;
    border-radius:5px 5px 5px 5px;
  }
  .divPopAfter {
    position:relative;
    left: 0;
    bottom:-34px;
    width:0;
    height:0;
    border-width:10px;
    border-style:solid;
    border-color:transparent;
    margin-bottom: 60px;
    border-left-width:20px;
    border-left-color:currentColor;
    color:#fff;
  }
  .divPopBefore {
    position:relative;
    right:0;
    bottom:-10px;
    width:0;
    height:0;
    left: -22px;
    border-width:10px;
    border-style:solid;
    border-color:transparent;
    margin-bottom:60px;
    border-right-width:12px;
    border-right-color: currentColor;
    color:#fff;
  }
  .search-title {
    margin: 5px 10px 5px 20px;
  }
</style>
