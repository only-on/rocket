<template>
  <div class="body">
    <!--内容-->
    <Row class="body-content  demo-spin-container" :gutter="16" style="min-width: 1650px">
      <Spin  fix v-if="isShow">
        <div class="loading">{{loadTime}}</div>
      </Spin>
      <!--左侧-->
      <Col span="1">
      <div class="left">
        <div class="point"></div>
        <div class="point point1"></div>
        <div class="point point2"></div>
        <div class="point point3"></div>
      </div>
      </Col>
      <!--中间-->
      <Col span="16" style="margin-left: -10px">
      <div class="right">
        <!--选择炮架-->
        <Row type="flex" justify="start" style="margin-bottom: 16px;">
          <Col span="24">
          <div class="item">
            <Row type="flex" justify="start" style="padding:10px 0 10px 20px;font-size:20px;min-width: 1020px">
              智能远程作业
              <Col span="17">
              <RadioGroup v-model="switchText" @on-change="checkSw" style="margin-left: 20px">
                <Radio label="0">
                  <span>远程</span>
                </Radio>
                <Radio label="1">
                  <span>本地</span>
                </Radio>
              </RadioGroup>
              </Col>
              <Col span="4">
              <Button class="addRecord" @click="addWork" disabled>
                <Icon type="md-add" />
                作业问题记录
              </Button>
              </Col>
            </Row>
            <div style="background:rgba(240,240,240,1);height: 1px"></div>
            <Row style="padding:25px 20px">
              <div class="selectRoc">
                <span class="title">选择炮架</span>
                <regionGun @region="regionChange" :regionIds="regionIds" ></regionGun>
                <span class="notice" v-if="tidNotice" style="display:block;margin-top: 5px">请选择终端编号</span>
              </div>
              <div class="comGps">
                <span class="circle" ref="comEle"></span>
                <span style="float:left;margin-right:10px;font-size:14px">通讯状态</span>
                <span class="circle" ref="gpsEle"></span>
                <span style="float:left;font-size:14px">GPS</span>
              </div>
            </Row>
          </div>
          </Col>
        </Row>
        <!--调整发射架-->
        <Row type="flex" justify="start" class="item" style="margin-bottom: 16px;padding: 20px;min-width: 1020px">
          <Col :lg="14">
          <Row class="title1">调整发射架</Row>
          <Row type="flex" style="margin:10px">
            <!--<span class="circle1"></span>-->
            <Button  class="selfBtn switchBtn" disabled @click="selfCheck">自检</Button>
          </Row>
          <Row style="padding: 20px 0;min-width: 610px">
            <span style="font-size: 14px;color: #888">方向角度</span>
            <Slider v-model="angleAmiz" show-input :min="0" :max="360" :step="0.01" style="margin-left:100px;margin-top:-30px" :disabled="dis"></Slider>
          </Row>
          <Row style="padding: 20px 0;min-width: 610px">
            <span style="font-size: 14px;color: #888">高低角度</span>
            <Slider  v-model="angleHeight" show-input :min="0" :max="90" :step="0.01" style="margin-left:100px;margin-top: -30px" :disabled="dis"></Slider>
          </Row>
          </Col>
          <!--实时数据-->
          <Col :lg="10"  style="position: relative">
          <Row style="min-width:420px;margin-top: -15px">
            <div id="main" style="height:200px;"></div>
          </Row>
          <Row type="flex" justify="center">
            <!--<Col :lg="3" >-->
            <Button class="setBegin switchBtn" style="position: absolute;left:170px" disabled @click="beginSet">开始设置</Button>
            <!--</Col>-->
          </Row>
          </Col>
        </Row>
        <!--火箭弹设定-->
        <Row type="flex" style="margin-bottom: 16px;min-width:1020px">
          <Col span="24">
          <div class="item" style="padding: 20px" >
            <Row class="title1">火箭弹设定</Row>
            <Row style="margin-top: 25px">
              <Col :lg="12" :xs="6" style="margin-bottom: 10px;">
              <span class="boTime">播撒时间</span>
              <Input v-model="bosaTime" class="timeInput" disabled>
              <span slot="append">秒</span>
              </Input>
              <!--<Button  class="searchRoc switchBtn" disabled @click="checkBosa">查询</Button>-->
              </Col>
              <Col :lg="12" :xs="6">
              <span class="boTime">重新设定时间</span>
              <Input v-model="setTime" class="timeInput" :disabled="setDis" @on-change="checkTime(setTime)">
              <span slot="append">秒</span>
              </Input>
              <Button  class="searchRoc switchBtn"  disabled @click="setBind">装定充电</Button>
              <span class="notice" v-if="numNotice">请输入正数</span>
              <span class="notice" v-if="setTimeNotice">播撒时间必须是3s~25s</span>
              </Col>
            </Row>
          </div>
          </Col>
        </Row>
        <!--火箭弹发射-->
        <Row type="flex" style="min-width: 1020px">
          <Col span="24">
          <div class="item" style="padding: 25px 20px">
            <Row class="title1" style="margin-bottom: 20px">火箭弹发射</Row>
            <Row>
              <Col :lg="14" :xs="10">
              <div class="rockets">
                <div class="rocket"  v-for="(item,index) in rocketArray" :key="index">
                  <div class="iconRocket">
                    <img :src="item.imgPic" alt="">
                  </div>
                  <span class="rocketText">{{item.statusText}}</span>
                </div>
              </div>
              </Col>
              <Col :lg="2" :xs="1">
              <div class="connact"></div>
              </Col>
              <Col :lg="5" :xs="10">
              <div class="operation">
                <Row type="flex" justify="center">
                  <Button class="searchBtn switchBtn" disabled @click="rocketSearch">查询</Button>
                </Row>
                <Row type="flex" justify="center">
                  <Button  class="unlock switchBtn"  disabled @click="unlock">{{lockText}}</Button>
                  <Button class="lanuch switchBtn" disabled @click="lanuch">发射</Button>
                </Row>
                <Row type="flex" justify="center">
                  <Button class="end switchBtn" disabled @click="endRoc">结束</Button>
                </Row>
              </div>
              </Col>
            </Row>
          </div>
          </Col>
        </Row>
      </div>
      </Col>
      <!--右侧-->
      <Col span="7">
      <!--禁射区-->
      <Row style="margin-bottom: 16px;min-width: 480px">
        <div class="card1" style="padding: 10px 20px">
          <Row style="font-size: 16px;">
            禁射区
          </Row>
          <Row class="mapEle">
            <div id="gunMap"></div>
          </Row>
        </div>
      </Row>
      <!--视频-->
      <Row class="card1 card2" style="min-width: 480px">
        <Col span="24">
        <Row style="font-size: 16px">
          实时视频
        </Row>
        <div class="middleV">
          <video-player  class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
        </div>
        </Col>
      </Row>
      <!--天气-->
      <Row class="card3" style="min-width: 480px">
        <Col>
        <Row style="color: #666;font-size: 16px;padding: 10px 20px;">
          <Col span="20">
          操作信息
          </Col>
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px;margin-bottom: 7px"></div>
        <div class="area1" style="overflow-y: scroll;height:75px;padding: 0 20px">
          <div v-for="(item,index) in logList" v-if="logList.length !== 0" :key="index" style="font-size: 14px;margin-bottom:5px;word-wrap:break-word">
            {{item}}
          </div>
          <div v-if="logList.length === 0" style="font-size: 18px;text-align: center;line-height:70px">
            暂无操作信息
          </div>
          <Row class="box2" style="padding: 0 10px"></Row>
        </div>
        </Col>
      </Row>
      </Col>
    </Row>
    <!--添加作业问题记录-->
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
            <regionGun @region="recordChange" style="float:left;" :regionIds="regionId"></regionGun>
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
    <!--弹框提示-->
    <Modal v-model="infoModal" :closable="false">
      <p slot="header" style="color:#ff9900;text-align:left">
        <Icon type="ios-information-circle" size="22"></Icon>
        <span>系统提示</span>
      </p>
      <p>
        <span style="font-size: 14px;margin-left:30px;display:block;">{{infoContent}}</span>
      </p>
      <div slot="footer">
        <Button style="background: #53C79F;width:60px;color:#fff;"   @click="okInfo">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import imgSelect from '../../assets/online2.png'
  import imgNone from '../../assets/rocketw.png'
  import imgGreen from '../../assets/rocketr.png'
  import img from '../../assets/video.jpg'
  import imgRed from '../../assets/red.png'
  import { getRegion, Operate,Launch,workLog } from '../../api/api'
  import echarts from 'echarts'
  import bmap from 'echarts/extension/bmap/bmap'
  import regionGun from '../../components/gis'
  import { videoPlayer } from 'vue-video-player'
  import store from '../../store/store'
  import $ from 'jquery'

  export default {
    components: {
      regionGun,
      videoPlayer
    },
    data() {
      return {
        infoModal: false,
        infoContent: '',
        loadTime: 60,
        isShow: false,
        statusList: [],
        errMsg: '',
        nativeFlag: true,
        finishTimer: 0,
        tempCount: -1,
        tempDir: '',
        tempHeight: '',
        clearFlag: true,
        clearFlag1: true,
        addRecordBtn: '',
        proLng: '',
        proLat: '',
        regionId: [],
        wordNum: 0,
        terNotice: false,
        workNotice: false,
        workNoticeNum: false,
        workTime: '',
        beginTime: '',
        timeList: [],
        batch: '',
        keys: [],
        station: '',
        updateModal: {
          stationId: '',
          terminalId: '',
          workTime: '',
          content: ''
        },
        polar1:{},
        angleAxis1: {
          show: false
        },
        radiusAxis1: {
          show: false
        },
        series1: [],
        polar: {
          center: ['50%', '50%']
        },
        angleAxis: {
          show: true,
          max: 360,//定义极坐标最大角度为360，方便运算
          axisLine: { //坐标轴轴线设置
            lineStyle: {
              color: "#1075ff"
            }
          },
          axisTick: { //坐标轴刻度设置
            show: true
          },
          axisLabel: { //刻度标签设置
            margin: 0, //刻度与坐标轴之间的距离
            textStyle: {
              color: "#1075ff",
              fontSize: 14
            }
          },
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //     color: '#00B9D3'
          //   }
          // }
        },
        radiusAxis: {
          max: 90,//定义极坐标最大半径100，方便计算
          show: true,
          interval: 30,
          inverse: true,//反向坐标轴
          axisLine: { //坐标轴轴线设置
            lineStyle: {
              color: "#1075ff"
            }
          },
          axisTick: { //坐标轴刻度设置
            show: false
          },
          axisLabel: { //刻度标签设置
            margin: 0, //刻度与坐标轴之间的距离
            textStyle: {
              color: "#1075ff",
              fontSize: 14
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#1075ff'
            }
          }
        },
        data: [],
        Arr: [],
        ruleTime: null,
        naTimer: null,
        pointArr: [],
        imgSelect: imgSelect,
        imgRed: imgRed,
        selectTid: false,
        regionIds: [],
        bmap: '',
        time1: 100,
        area1: '',
        box1: '',
        box2: '',
        logList: [],
        inialH: '',
        inialD: '',
        mytimer: null,
        mytimer1: null,
        endFlag: false,
        backDir: '',
        backHei: '',
        backCount: 0,
        setFlag: true,
        switchText:'0',
        switchBtn: '',
        checkFlag: true,
        checkStatus: '远程',
        flag1: true,
        codeText: '获取验证码',
        timer: 60,
        disable: false,
        Interval: null,
        codeEle: '',
        gpsTime: null,
        imgPic: imgNone,
        rocketArray: [
          {
            imgPic: imgNone,
            statusText: '无弹'
          },
          {
            imgPic: imgNone,
            statusText: '无弹'
          },
          {
            imgPic: imgNone,
            statusText: '无弹'
          },
          {
            imgPic: imgNone,
            statusText: '无弹'
          }
        ],
        form:{
          code: ''
        },
        addUser: false,
        selfBtn: '',
        setBegin: '',
        searchBosa: '',
        searchSet: '',
        searchBtn: '',
        end: '',
        marker: '',
        stationName: '',
        stationRuleList: [],
        point: [],
        tidNotice: false,
        tid: '',
        comStatus: '',
        gpsStatus: '',
        comEle: '',
        gpsEle: '',
        echartData: [[{value:0}],[{value:0}]],
        setSuccess: false,
        rocketStatus: '',
        rocketList: [],
        rocketNomal: [],
        img: img,
        weaParam: {
          location: '',
          key: '9c519bfba3e746e5abad49f5632652b7'
        },
        weather: {
          city: '北京',
          status:'晴',
          temperature: '29',
          humidity: '60',
          windDirection: '东',
          windPower:'8',
          fl: '28',
          vis: '',
          cloud: ''
        },
        dis: true,
        shell: '',
        angleHeight: 0,
        angleAmiz: 0,
        bosaTime: '',
        setTime: '',
        setDis: true,
        numNotice: false,
        setTimeNotice: false,
        stationList: [],
        iconRocket: '',
        map: '',
        lockEle: '',
        lockText: '解锁',
        lanuchEle: '',
        fireCount: '',
        endStatus: '',
        endList: [],
        playerOptions: {
//        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4",
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" //你的视频地址（必填）
          }],
          poster: img, //你的封面地址
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          // controlBar: {
          //   timeDivider: true,
          //   durationDisplay: true,
          //   remainingTimeDisplay: false,
          //   fullscreenToggle: true  //全屏按钮
          // }
        },
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
      addWork () {
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
        this.regionId = []
        this.addUser = true
        if (this.tid !== '' && this.tid !== undefined) {
          this.station = this.station + ''
          this.regionId[0] = parseInt(this.station.substr(0,2))
          this.regionId[1] = parseInt(this.station.substr(0,4))
          this.regionId[2] = parseInt(this.station.substr(0,6))
          this.regionId[3] = parseInt(this.station.substr(0))
          this.regionId[4] = this.tid
          this.updateModal.stationId = this.tid
        }
      },
      recordChange (data) {
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
              this.regionId = []
              this.$Message.success('作业问题记录添加成功！')
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      cancelAdd () {},
      // 清空页面
      clearData () {
        this.logList = []
        this.point[0].style.animationPlayState = "running"
        this.point[0].style.background = '#7ac37b'
        for (let p = 1; p < this.point.length; p++) {
          this.point[p].style.animationPlayState = "paused"
          this.point[p].style.background = '#fff'
        }
        // 按钮置灰
        for (let i = 0; i < this.switchBtn.length; i++) {
          this.switchBtn[i].style.cssText = 'background: #f3f3f3;color:#666'
          this.switchBtn[i].disabled = true
        }
        this.comStatus = false
        this.angleHeight = 0
        this.angleAmiz = 0
        this.showDirect(this.angleHeight,this.angleAmiz)
        this.rocketStatus = ''
        this.rocketList = []
        global.rocketList = []
        this.statusList = [0,0,0,0]
        // 火箭弹状态
        for (let i = 0; i < this.statusList.length; i++) {
          this.getStatus(i,this.statusList[i])
        }
        this.setTime = ''
        this.bosaTime = ''
        this.rocketNomal = []
        this.fireCount = ''
        this.endStatus = ''
        this.endList = []
        this.lockText = '解锁'
        this.comFlag = true
        this.tempCount = -1
      },
      // 远程本地切换按钮
      checkSw (change) {
        // 清空页面
        this.clearData()
        if (change === '1') {
          // 本地
          this.checkFlag = false
          if (this.tid !== '' && this.tid !== undefined) {
            this.nativeTimer()
          }
          // 按钮置灰
          for (let i = 0; i < this.switchBtn.length; i++) {
            this.switchBtn[i].style.cssText = 'background: #f3f3f3;color:#666'
            this.switchBtn[i].disabled = true
          }
          // 清除远程定时器
          clearTimeout(this.gpsTime)
          this.gpsTime = null
        } else if (change === '0') {
          // 远程
          // 清除本地定时器
          clearTimeout(this.naTimer)
          this.naTimer = null
          this.checkFlag = true
          if (this.tid !== '' && this.tid !== undefined) {
            this.getCom()
          }
        }
      },
      cancelAdd () {},
      // 本地作业
      localWork () {
        let par = {
          K: 'GET_TERMINAL_STATUS',
          V: {
            TID: this.tid
          }
        }
        Operate(par).then((res) => {
          if (res.data.R) {
            this.comStatus = res.data.V.RESULT.comStatus
            this.gpsStatus = res.data.V.RESULT.gpsStatus
            // 通讯状态、GPS
            if (this.comStatus) {
              this.comEle.style.background = '#7ac37b'
              this.native()
            } else {
              this.comEle.style.background = '#FF4F4F'
            }
            if (this.gpsStatus) {
              this.gpsEle.style.background = '#7ac37b'
            } else {
              this.gpsEle.style.background = '#FF4F4F'
            }
          } else {
            this.$Message.config({
              duration: 3
            })
            this.$Message.error(res.data.ERR_MSG)
          }
          if (this.selfBtn !== null && this.$route.path === '/operateIntelligent') {
            this.naTimer = setTimeout(this.localWork,10000)
          }
        })
      },
      nativeTimer () {
        this.naTimer = setTimeout(this.localWork,1000)
      },
      // 本地作业
      native () {
        let par = {
          K: 'NATIVE_WORK',
          V: {
            terminalId: this.tid
          }
        }
        Operate(par).then((res) =>{
          if (res.data.R) {
            this.point[0].style.animationPlayState = "paused"
            this.point[0].style.background = '#7ac37b'
            this.point[1].style.background = '#7ac37b'
            this.point[2].style.background = '#7ac37b'
            this.point[3].style.background = '#7ac37b'
            let result = res.data.V.RESULT

            // 自检
            if (result.selfCheckAbstractRep !== null && !this.checkFlag) {
              this.angleHeight = result.selfCheckAbstractRep.height
              this.angleAmiz = result.selfCheckAbstractRep.direct
              this.echartData[1][0].value = this.angleHeight
              this.echartData[0][0].value = this.angleAmiz
              this.$nextTick(function () {
                this.drawBar('main', this.echartData)
              })
              this.rocketStatus = result.selfCheckAbstractRep.rocket
              this.rocketList = this.rocketStatus.split(';',4)
              // global.rocketList = this.rocketList
              // 火箭弹状态
              if (this.nativeFlag) {
                for (let i = 0; i < this.rocketList.length; i++) {
                  this.rocketList[i] = this.rocketList[i].substr(2,1)
                  if (this.rocketList[i] === '1') {
                    this.rocketArray [i] = {
                      imgPic:imgGreen,
                      statusText: '有弹'
                    }
                    global.rocketList[i] = '1'
                    this.rocketText[i].innerHTML =' <span class="rocketText">有弹</span>'
                    this.iconRocket[i].classList.remove('rocketBad')
                    this.iconRocket[i].classList.remove('rocketCharge')
                    this.iconRocket[i].classList.remove('rocketNomal')
                  } else {
                    this.rocketArray [i] = {
                      imgPic:imgNone,
                      statusText: '无弹'
                    }
                    global.rocketList[i] = '0'
                    this.rocketText[i].innerHTML =' <span class="rocketText">无弹</span>'
                    this.iconRocket[i].classList.remove('rocketBad')
                    this.iconRocket[i].classList.remove('rocketCharge')
                    this.iconRocket[i].classList.remove('rocketNomal')
                  }
                }
                this.nativeFlag = false
              } else {
                for (let i = 0; i < this.rocketList.length; i++) {
                  this.rocketList[i] = this.rocketList[i].substr(2,1)
                  // 异常弹状态不再置为1有弹
                  if (this.rocketList[i] === '1' && global.rocketList[i] !== '3') {
                    this.rocketArray [i] = {
                      imgPic:imgGreen,
                      statusText: '有弹'
                    }
                    global.rocketList[i] = '1'
                    this.rocketText[i].innerHTML =' <span class="rocketText">有弹</span>'
                    this.iconRocket[i].classList.remove('rocketBad')
                    this.iconRocket[i].classList.remove('rocketCharge')
                    this.iconRocket[i].classList.remove('rocketNomal')
                  }
                }
              }

            }
            // 开始设置
            if (result.autoAdjustEndAbstractRep !== null) {
              this.angleHeight = result.autoAdjustEndAbstractRep.height
              this.angleAmiz = result.autoAdjustEndAbstractRep.direct
              this.echartData[1][0].value = this.angleHeight
              this.echartData[0][0].value = this.angleAmiz
              this.$nextTick(function () {
                this.drawBar('main', this.echartData)
              })
            }
            // 装订
            if (result.launchBind1272Rep !== null) {
              this.bosaTime = result.launchBind1272Rep.bind.showTime
              this.setTime = result.launchBind1272Rep.bind.showTime
              this.rocketNomal = result.launchBind1272Rep.bind.status.split(';',4)
              for (let j = 0; j < this.rocketNomal.length; j++) {
                this.rocketNomal[j] = this.rocketNomal[j].substr(2,1)
              }
              for (let i = 0; i < global.rocketList.length; i++) {
                // 有弹且状态为0为就绪状态，否则异常状态
                // 无弹0有弹1就绪2异常3放电成功4
                if (global.rocketList[i] === '1' && this.rocketNomal[i] === '0') {
                  this.rocketArray [i] = {
                    imgPic:imgNone,
                    statusText: '就绪'
                  }
                  global.rocketList[i] = '2'
                  this.rocketText[i].innerHTML =' <span class="rocketText">就绪</span>'
                  this.iconRocket[i].classList.remove('rocketBad')
                  this.iconRocket[i].classList.remove('rocketCharge')
                  this.iconRocket[i].classList.add('rocketNomal')

                } else if (global.rocketList[i] === '1' && this.rocketNomal[i] !== '0') {
                  this.rocketArray[i] = {
                    imgPic:imgNone,
                    statusText: '异常'
                  }
                  global.rocketList[i] = '3'
                  this.rocketText[i].innerHTML =' <span class="rocketText">异常</span>'
                  this.iconRocket[i].classList.remove('rocketNomal')
                  this.iconRocket[i].classList.remove('rocketCharge')
                  this.iconRocket[i].classList.add('rocketBad')
                }
              }
            }
            // 查询
            if (result.launchRocketStatus1272Rep !== null) {
              this.bosaTime = result.launchRocketStatus1272Rep.lrsr.showTime
              this.rocketNomal = result.launchRocketStatus1272Rep.lrsr.status.split(';',4)
              for (let j = 0; j < this.rocketNomal.length; j++) {
                this.rocketNomal[j] = this.rocketNomal[j].substr(2,2)
              }
              // 火箭弹状态
              for (let i = 0; i < global.rocketList.length; i++) {
                // 有弹且状态为33为就绪状态，否则异常状态
                if (global.rocketList[i] === '1' && this.rocketNomal[i] === '33') {
                  this.rocketArray [i] = {
                    imgPic:imgNone,
                    statusText: '就绪'
                  }
                  global.rocketList[i] = '2'
                  this.rocketText[i].innerHTML =' <span class="rocketText">就绪</span>'
                  this.iconRocket[i].classList.remove('rocketBad')
                  this.iconRocket[i].classList.remove('rocketCharge')
                  this.iconRocket[i].classList.add('rocketNomal')
                } else if (global.rocketList[i] === '1' && this.rocketNomal[i] !== '33') {
                  this.rocketArray [i] = {
                    imgPic:imgNone,
                    statusText: '异常'
                  }
                  global.rocketList[i] = '3'
                  this.rocketText[i].innerHTML =' <span class="rocketText">异常</span>'
                  this.iconRocket[i].classList.remove('rocketNomal')
                  this.iconRocket[i].classList.remove('rocketCharge')
                  this.iconRocket[i].classList.add('rocketBad')
                }
              }
            }
            // 发射
            if (result.fireRetAbstractRep !== null) {
              this.angleHeight = result.fireRetAbstractRep.height
              this.angleAmiz = result.fireRetAbstractRep.direct
              this.echartData[1][0].value = this.angleHeight
              this.echartData[0][0].value = this.angleAmiz
              this.$nextTick(function () {
                this.drawBar('main', this.echartData)
              })
              this.fireCount = result.fireRetAbstractRep.count
              if (this.fireCount === 0) {
                // 火箭弹状态
                // 发射弹数为0将第一枚有弹状态改为异常
                if (global.rocketList.indexOf('2') !== -1) {
                  let start = global.rocketList.indexOf('2')
                  this.rocketArray [start] = {
                    imgPic:imgNone,
                    statusText: '异常'
                  }
                  this.rocketText[start].innerHTML =' <span class="rocketText">异常</span>'
                  // 异常弹跳过，将异常弹是否就绪有弹状态改为3
                  global.rocketList[start] = '3'
                  this.iconRocket[start].classList.remove('rocketNomal')
                  this.iconRocket[start].classList.remove('rocketCharge')
                  this.iconRocket[start].classList.add('rocketBad')
                }
              } else if (this.fireCount === 1) {
                // 发射弹数为1将第一枚就绪有弹状态改为无弹
                if (global.rocketList.indexOf('2') !== -1) {
                  let start1 = global.rocketList.indexOf('2')
                  global.rocketList[start1] = '0'
                  this.rocketArray [start1] = {
                    imgPic:imgNone,
                    statusText: '无弹'
                  }
                  this.rocketText[start1].innerHTML =' <span class="rocketText">无弹</span>'
                  this.iconRocket[start1].classList.remove('rocketNomal')
                  this.iconRocket[start1].classList.remove('rocketBad')
                  this.iconRocket[start1].classList.remove('rocketCharge')
                }
              }
            }
            // 结束
            if (result.termEndRetAbstractRep !== null) {
              this.angleHeight = result.termEndRetAbstractRep.height
              this.angleAmiz = result.termEndRetAbstractRep.direct
              this.echartData[1][0].value = this.angleHeight
              this.echartData[0][0].value = this.angleAmiz
              this.$nextTick(function () {
                this.drawBar('main', this.echartData)
              })
            }
          } else {
            this.$Message.config({
              duration:2
            })
            this.$Message.error(res.data.ERR_MSG)
          }
        })
      },
      // 地图圈住
      provinceMap(color) {
        let par = {
          K: 'GET_ALL_CONTROL_STATION',
          V: {}
        }
        getRegion(par).then((res) => {
          if (res.data.R) {
            // let thi = this
            // var myGeo = new BMap.Geocoder()
            // myGeo.getPoint(res.data.V.RESULT.province,function(point){
            //   console.log(point.lng)
            //   thi.proLng = point.lng
            //   thi.proLat = point.lat
            // })
            this.getBoundary(this.bmap, res.data.V.RESULT.province,color)
          }
        })
      },
      // 定时器
      getTimer () {
        if (this.tid !== '' && this.tid !== undefined) {
          setTimeout(this.getCom,3000)
        }
        setTimeout(this.getRule,1000)
      },
      getLog (string) {
        let len = this.logList.length + 1
        this.logList.push(len + '、' + string)
      },
      // 自检按钮亮
      showSelf () {
        this.point[0].style.animationPlayState = "paused"
        this.point[0].style.background = '#7ac37b'
        if (this.comFlag) {
          this.point[1].style.animationPlayState = "running"
          this.point[1].style.background = '#7ac37b'
          this.comFlag = false
        }
        // 自检按钮亮
        this.selfBtn.style.cssText = 'background:#53C79F;color:#fff'
        this.selfBtn.disabled = false
        this.clearFlag = true
      },
      // 查询通讯状态
      getCom () {
        if (this.tid !== '' && this.tid !== undefined) {
          let par = {
            K: 'GET_TERMINAL_STATUS',
            V: {
              TID: this.tid
            }
          }
          Operate(par).then((res) => {
            if (res.data.R) {
              this.comStatus = res.data.V.RESULT.comStatus
              this.gpsStatus = res.data.V.RESULT.gpsStatus
            } else {
              this.$Message.config({
                duration: 3
              })
              this.$Message.error(res.data.ERR_MSG)
            }
            // 通讯状态、GPS
            if (this.comStatus) {
              this.comEle.style.background = '#7ac37b'
            } else {
              this.comEle.style.background = '#FF4F4F'
            }
            if (this.gpsStatus) {
              this.gpsEle.style.background = '#7ac37b'
            } else {
              this.gpsEle.style.background = '#FF4F4F'
            }
            // 通讯状态成功进行下一步
            if (this.comStatus) {
              if (this.tempCount === -1 || this.tempCount !== res.data.V.RESULT.startCount) {
                // 自检按钮亮
                this.showSelf()
                this.tempCount = res.data.V.RESULT.startCount
              }
            } else {
              if (this.clearFlag) {
                this.clearFlag = false
                this.drawMap('gunMap',116.340331,39.98667,this.polar1,this.angleAxis1,this.radiusAxis1,[],[])
                this.provinceMap('transparent')
                this.point[0].style.animationPlayState = "running"
                this.point[0].style.background = '#7ac37b'
                for (let p = 1; p < this.point.length; p++) {
                  this.point[p].style.animationPlayState = "paused"
                  this.point[p].style.background = '#fff'
                }
                // 所有按钮置灰
                for (let i = 0; i < this.switchBtn.length; i++) {
                  this.switchBtn[i].style.cssText = 'background: #f3f3f3;color:#666'
                  this.switchBtn[i].disabled = true
                }
                // 初始化，（如果通讯状态为true,根据this.tempCount来判断自检按钮状态）
                this.tempCount = -1
              }
            }
          })
          if (this.selfBtn !== null && this.$route.path === '/operateIntelligent') {
            this.gpsTime = setTimeout(this.getCom,3000)
          }
        }
      },
      regionChange(data) {
        this.clearData()
        this.logList = []
        // 初始化，
        this.tempCount = -1
        if (data !== '' && data !== undefined) {
          this.comEle = this.$refs.comEle
          this.gpsEle = this.$refs.gpsEle
          if (data === 'clear' || data.length === 2) {
            this.clearData()
            clearTimeout(this.gpsTime)
            this.gpsTime = null
            this.tid = ''
            // 选中的炮架
            this.selectTid = false
            this.drawMap('gunMap',116.340331,39.98667,this.polar1,this.angleAxis1,this.radiusAxis1,[],[])
            this.provinceMap('transparent')
            // 添加作业问题记录
            this.addRecordBtn.style.cssText = 'background:#f3f3f3;color:#666'
            this.addRecordBtn.disabled = true
          } else if (data.length === 5) {
            // this.clearMarker(this.bmap)
            this.addRecordBtn.style.cssText = 'background:#53C79F;color:#fff'
            this.addRecordBtn.disabled = false
            if (data[data.length - 2] !== undefined) {
              this.station = data[3].value
            } else {
              this.station = parseInt(sessionStorage.getItem('sid'))
            }
            this.tidNotice = false
            this.tid = data[4].value
            this.selectTid = true
            if (this.checkFlag) {
              // 通讯状态查询 远程作业
              this.getCom()
            } else {
              // 本地作业
              this.nativeTimer()
            }
            this.getRule()
          }
        }
      },
      // 禁射区
      getRule () {
        let par1 = {
          K: 'STATION_RULE_LIST',
          V: {}
        }
        Operate(par1).then((res) => {
          if (res.data.R) {
            if (res.data.V.RESULT.length > 0) {
              this.clearFlag1 = true
              for (let i = 0; i < res.data.V.RESULT.length; i++) {
                let longitude = res.data.V.RESULT[i].longitude
                let latitude = res.data.V.RESULT[i].latitude
                let point = new BMap.Point(longitude,latitude)
                let rocName = res.data.V.RESULT[i].rocketName
                let tid
                let stationId = res.data.V.RESULT[i].stationId
                if (res.data.V.RESULT[i].terminalId !== undefined && res.data.V.RESULT[i].terminalId !== null) {
                  tid = res.data.V.RESULT[i].terminalId
                } else {
                  tid = -1
                }
                let selectT = 0
                // 选中的炮架进行标识，selectT为1表示被选中
                if (this.selectTid) {
                  if (this.tid !== '' && this.tid !== undefined && res.data.V.RESULT[i].terminalId === this.tid) {
                    selectT = 1
                  } else {
                    selectT = 0
                  }
                } else {
                  selectT = 0
                }
                this.stationName = res.data.V.RESULT[i].stationName
                this.stationRuleList = res.data.V.RESULT[i].stationRuleList
                this.addMarker(this.bmap,point,this.stationName,tid,this.stationRuleList,rocName,stationId,selectT)
              }
            } else {
              if (this.clearFlag1) {
                this.drawMap('gunMap',116.340331,39.98667,this.polar1,this.angleAxis1,this.radiusAxis1,[],[])
                this.provinceMap('transparent')
                this.clearFlag1 = false
                this.$nextTick(function() {
                  let nodeList = document.querySelectorAll('.BMap_Marker')
                  for (let n = 0; n < nodeList.length; n++) {
                    nodeList[n].innerHTML = ''
                  }
                  let pop = document.querySelector('.BMap_pop')
                  let shadow = document.querySelector('.BMap_shadow')
                  if (pop !== null ) {
                    pop.innerHTML = ''
                    shadow.innerHTML = ''
                  }
                })
              }
            }
          } else {
            this.$Message.config({
              duration:2
            })
            this.$Message.error(res.data.ERR_MSG)
          }
        })
        if (this.selfBtn !== null && this.$route.path === '/operateIntelligent') {
          this.ruleTime = setTimeout(this.getRule,3000)
        }
      },
      getStatus (num,status) {
        if (status === 0) {
          this.rocketArray [num] = {
            imgPic:imgNone,
            statusText: '无弹'
          }
          this.rocketText[num].innerHTML =' <span class="rocketText">无弹</span>'
          this.iconRocket[num].classList.remove('rocketBad')
          this.iconRocket[num].classList.remove('rocketNomal')
        } else if (status === 1) {
          this.rocketArray [num] = {
            imgPic:imgGreen,
            statusText: '有弹'
          }
          this.rocketText[num].innerHTML =' <span class="rocketText">有弹</span>'
          this.iconRocket[num].classList.remove('rocketBad')
          this.iconRocket[num].classList.remove('rocketNomal')
        } else if (status === 2) {
          this.rocketArray [num] = {
            imgPic:imgNone,
            statusText: '就绪'
          }
          this.rocketText[num].innerHTML =' <span class="rocketText">就绪</span>'
          this.iconRocket[num].classList.remove('rocketBad')
          this.iconRocket[num].classList.add('rocketNomal')
        } else if (status === 3) {
          this.rocketArray [num] = {
            imgPic:imgNone,
            statusText: '异常'
          }
          this.rocketText[num].innerHTML =' <span class="rocketText">异常</span>'
          this.iconRocket[num].classList.remove('rocketNomal')
          this.iconRocket[num].classList.add('rocketBad')
        }
      },
      // 倒计时
      loadAnmation () {
        let thi = this
        if (this.loadTime === 0) {
          thi.isShow = false
        } else {
          if (thi.isShow) {
            this.loadTime--
            setTimeout(function () {
              thi.loadAnmation()
            },1000)
          }
        }
      },
      // 遮罩显示
      maskShow (time) {
        this.loadTime= time
        this.isShow = true
        this.loadAnmation()
      },
      // 状态码1127提示框确定
      okInfo () {
        this.infoModal = false
        this.clearData()
      },
      // 自检
      selfCheck () {
        this.maskShow(120)
        var thi = this
        thi.logList = []
        thi.lockText = '解锁'
        if (thi.comStatus) {
          let par = {
            K: 'SELF_CHECK',
            V: {
              TID: thi.tid
            }
          }
          Operate(par).then((res) => {
            this.isShow = false
            if (res.data.R) {
              thi.getLog(res.data.V.operate)
              thi.$Message.success('自检成功！')
              let h = res.data.V.RESULT.height
              let d = res.data.V.RESULT.direct
              thi.inialH = h
              thi.inialD = d
              // 开始设置
              thi.backHei = h
              thi.backDir = d
              // -----
              thi.angleHeight = h
              thi.angleAmiz = d
              // 角度、方位的展示
              thi.showDirect(thi.angleHeight,thi.angleAmiz)
              // 播撒时间和装定时间
              thi.bosaTime = 5
              thi.setTime = 5
              // 火箭弹状态
              thi.statusList = res.data.V.rocketStatus
              for (let i = 0; i < thi.statusList.length; i++) {
                thi.getStatus(i,thi.statusList[i])
              }
              thi.dis = false
              // 除了装订下面的按钮，其他按钮变亮
              for (let i = 0; i < this.switchBtn.length; i++) {
                if (i === 1 || i === 2) {
                  // 开始设置和装订按钮变亮
                  thi.switchBtn[i].style.cssText = 'background:#53C79F;color:#fff'
                  thi.switchBtn[i].disabled = false
                }
              }
              // 设置开始设置按钮的位置
              thi.setBegin.style.cssText='position:absolute;left:165px;background:#53C79F;color:#fff'
              thi.setBegin.disabled = false
              // 重新设定input可输入
              thi.setDis = false
              thi.point[1].style.animationPlayState = "paused"
              thi.point[1].style.background = '#7ac37b'
              thi.point[2].style.background = '#7ac37b'
              thi.point[3].style.background = '#7ac37b'
            } else {
              if (res.data.ERR_MSG !== '1127') {
                thi.getLog(res.data.ERR_MSG)
                thi.dis = true
                thi.$Message.config({
                  duration:4
                })
                thi.$Message.error(res.data.ERR_MSG)
                thi.angleHeight = 0
                thi.angleAmiz = 0
                thi.inialH = 0
                thi.inialD = 0
                thi.backDir = 0
                thi.backHei = 0
                thi.showDirect(thi.angleHeight,thi.angleAmiz)
                this.statusList = [0,0,0,0]
                // 火箭弹状态
                for (let i = 0; i < this.statusList.length; i++) {
                  this.getStatus(i,this.statusList[i])
                }
              } else {
                thi.infoContent = '设备检弹失败,请重新操作！'
                // 弹框出现
                thi.infoModal = true
              }
            }
          })
        }
      },
      // 开始设置
      beginSet () {
        this.finishTimer = 0
        this.backCount = 0
        this.errMsg = ''
        this.setTimer()
        this.maskShow(30)
        this.tempDir = this.angleAmiz
        this.tempHeight = this.angleHeight
        if (this.comStatus && !this.dis) {
          let par = {
            K: 'AUTO_ADJUST',
            V: {
              direct: this.angleAmiz,
              height: this.angleHeight,
              TID: this.tid
            }
          }
          Operate(par).then((res) => {
            this.isShow = false
            // finishTimer = 1，请求成功停止定时器的标志
            this.finishTimer = 1
            if (res.data.R) {
              this.getLog(res.data.V.operate)
              this.$Message.success('设置成功！')
              this.angleAmiz = res.data.V.RESULT.direct
              this.angleHeight = res.data.V.RESULT.height
              this.showDirect(this.angleHeight,this.angleAmiz)
              let vm=this
              vm.$nextTick(function () {
                vm.drawBar('main', vm.echartData)
              })
              // 调炮成功自检按钮置灰
              this.selfBtn.style.cssText = 'background: #f3f3f3;color:#666'
              this.selfBtn.disabled = true
            } else {
              this.getLog(res.data.ERR_MSG)
              this.$Message.config({
                duration:8
              })
              if (res.data.ERR_MSG.includes('禁射区')) {
                this.errMsg = res.data.ERR_MSG
              } else {
                this.errMsg = ''
              }
              this.$Message.error(res.data.ERR_MSG)
              // 调炮失败，将自检的结果显示到页面
              this.backCount = 0
              this.angleAmiz = this.inialD
              this.angleHeight = this.inialH
              this.showDirect(this.angleHeight,this.angleAmiz)
            }
          })
        } else {
          this.finishTimer = 0
        }
      },
      autoJust () {
        let par1 = {
          K: 'AUTO_ADJUST_ANGLE_TIMER',
          V: {
            terminalId: this.tid,
            directSet: this.tempDir,
            heightSet: this.tempHeight,
            direct: this.backDir,
            height: this.backHei,
            count: this.backCount
          }
        }
        Operate(par1).then((res) => {
          if (res.data.R) {
            if (this.selfBtn !== null && this.$route.path === '/operateIntelligent' && this.finishTimer !== 1) {
              this.mytimer = setTimeout(this.autoJust,3000)
              this.backCount = res.data.V.RESULT.count
              this.backDir = res.data.V.RESULT.direct
              this.backHei = res.data.V.RESULT.height
              this.endFlag = res.data.V.RESULT.end
              if (this.endFlag) {
                clearTimeout(this.mytimer)
                this.mytimer = null
              }
              this.angleAmiz = this.backDir
              this.angleHeight = this.backHei
              this.showDirect(this.angleHeight,this.angleAmiz)
              let vm=this
              vm.$nextTick(function () {
                vm.drawBar('main', vm.echartData)
              })
            } else {
              // 将自检的结果显示到页面
              clearTimeout(this.mytimer)
              this.mytimer = null
              if (this.errMsg !== '') {
                this.angleAmiz = this.inialD
                this.angleHeight = this.inialH
                this.showDirect(this.angleHeight,this.angleAmiz)
              }
            }
          } else {
            // 将自检的结果显示到页面
            clearTimeout(this.mytimer)
            this.mytimer = null
            this.$Message.config({
              duration:4
            })
            this.$Message.error(res.data.ERR_MSG)
            this.backCount = 0
            this.angleAmiz = this.inialD
            this.angleHeight = this.inialH
            this.showDirect(this.angleHeight,this.angleAmiz)
          }
        })
      },
      // 角度、方位的展示
      showDirect (height,direct) {
        let thi = this
        thi.echartData[1][0].value = height
        thi.echartData[0][0].value = direct
        thi.$nextTick(function () {
          thi.drawBar('main', thi.echartData)
        })
      },
      setTimer () {
        this.mytimer = setTimeout(this.autoJust,3000)
      },
      // 查询播撒时间
      // checkBosa () {
      //   this.maskShow(30)
      //   let parSea = {
      //     K: 'LAUNCH_ROCKET_STATUS',
      //     V: {
      //       TID:this.tid
      //     }
      //   }
      //   Operate(parSea).then((res) => {
      //     this.isShow = false
      //     if (res.data.R) {
      //       this.setDis = false
      //       this.getLog(res.data.V.operate)
      //       this.bosaTime = res.data.V.RESULT.lrsr.showTime
      //       this.setTime = res.data.V.RESULT.lrsr.showTime
      //       this.$Message.success('查询成功！')
      //     } else {
      //       this.getLog(res.data.V.operate)
      //       this.$Message.config({
      //         duration:4
      //       })
      //       this.$Message.error(res.data.ERR_MSG)
      //     }
      //   })
      // },
      // 装订时间验证
      checkTime (change) {
        if (change !== '' && change !== undefined) {
          let validate = /^\d+$/
          if (validate.test(change)) {
            this.numNotice = false
            if (change >= 3 && change <= 25) {
              this.setTimeNotice = false
            } else {
              this.setTimeNotice = true
            }
          } else {
            this.numNotice = true
          }
        }
      },
      // 装订
      setBind () {
        this.maskShow(30)
        if (this.setTime !== '' && this.setTime !== undefined) {
          let parSet = {
            K: 'LAUNCH_BIND',
            V: {
              TID: this.tid,
              showTime: this.setTime - 0,
              reserveTime: 0
            }
          }
          Operate(parSet).then((res) => {
            this.isShow = false
            if (res.data.R) {
              this.getLog(res.data.V.operate)
              this.bosaTime = res.data.V.RESULT.bind.showTime
              this.setTime = res.data.V.RESULT.bind.showTime
              this.$Message.success('请求成功！')
              this.statusList = res.data.V.rocketStatus
              for (let i = 0; i < this.statusList.length; i++) {
                this.getStatus(i,this.statusList[i])
              }
              // 查询按钮亮
              this.searchBtn.style.cssText = 'background:#53C79F;color:#fff'
              this.searchBtn.disabled = false
              // 弹的数量
              let totalNum = this.getTotalNum(this.statusList, 0)
              // 异常弹的数量
              let errorNum = this.getErrorNum(this.statusList, 3)
              // 弹的总数量不等于异常弹的数量时，解锁按钮亮
              if (totalNum !== errorNum) {
                // 解锁按钮
                this.lockEle.style.cssText = 'background:#53C79F;color:#fff'
                this.lockEle.disabled = false
              }
            } else {
              this.getLog(res.data.ERR_MSG)
              this.$Message.config({
                duration:4
              })
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      // 异常弹的数量
      getErrorNum (arr,errorStatus) {
        var count = arr.filter(function(item) {
          return item === errorStatus
        })
        return count.length
      },
      // 有弹（就绪和异常）的数量
      getTotalNum (arr,isNoStatus) {
        var total = arr.filter(function(item) {
          return item !== isNoStatus
        })
        return total.length
      },
      // 火箭弹查询
      rocketSearch () {
        this.maskShow(90)
        let parRoc = {
          K: 'CHECK_ROCKET',
          V: {
            TID: this.tid
          }
        }
        Operate(parRoc).then((res) => {
          this.isShow = false
          if (res.data.R) {
            // 查询没有操作日志 返回结果无operate字段
            this.$Message.success('查询成功！')
            this.statusList = res.data.V.rocketStatus
            for (let i = 0; i < this.statusList.length; i++) {
              this.getStatus(i,this.statusList[i])
            }
            // 弹的数量
            let totalNum = this.getTotalNum(this.statusList, 0)
            // 异常弹的数量
            let errorNum = this.getErrorNum(this.statusList, 3)
            // 弹的总数量不等于异常弹的数量时，解锁按钮亮
            if (totalNum !== errorNum) {
              // 解锁按钮
              this.lockEle.style.cssText = 'background:#53C79F;color:#fff'
              this.lockEle.disabled = false
            } else {
              // 解锁按钮
              this.lockEle.style.cssText = 'background: #f3f3f3;color:#666'
              this.lockEle.disabled = true
            }
          } else {
            if (res.data.ERR_MSG !== '1127') {
              this.getLog(res.data.ERR_MSG)
              this.$Message.config({
                duration:4
              })
              this.$Message.error(res.data.ERR_MSG)
            } else {
              this.infoContent = '设备检弹失败,请重新操作！'
              this.infoModal = true
            }
          }
        })
      },
      // 解锁
      unlock() {
        this.lockText = '就绪'
        // 发射按钮
        this.lanuchEle.style.cssText = 'background:#53C79F;color:#fff'
        this.lanuchEle.disabled = false
      },
      // 发射
      lanuch() {
        this.maskShow(120)
        let thi = this
        let par = {
          K: 'FIRE',
          V: {
            TID: thi.tid,
            count: 1
          }
        }
        Operate(par).then((res) => {
          this.isShow = false
          if (res.data.R) {
            thi.getLog(res.data.V.operate)
            thi.fireCount = res.data.V.RESULT.count
            thi.statusList = res.data.V.rocketStatus
            for (let i = 0; i < thi.statusList.length; i++) {
              this.getStatus(i,thi.statusList[i])
            }
            // 弹如果只剩无弹和异常弹（不存在可以发射的弹），结束按钮亮，其他按钮置灰
            if (thi.statusList.indexOf(2) === -1) {
              //结束按钮亮，其他按钮置灰
              for (let i = 0; i < this.switchBtn.length; i++) {
                // 最后一个按钮
                if (i !== this.switchBtn.length - 1) {
                  this.switchBtn[i].style.cssText = 'background: #f3f3f3;color:#666'
                  this.switchBtn[i].disabled = true
                }
              }
            }
          } else {
            if (res.data.ERR_MSG !== '1127') {
              thi.getLog(res.data.ERR_MSG)
              thi.$Message.config({
                duration:4
              })
              thi.$Message.error(res.data.ERR_MSG)
            } else {
              thi.infoContent = '设备检弹失败,请重新操作！'
              thi.infoModal = true
            }
          }
        })
      },
      // 结束
      endRoc () {
        this.maskShow(30)
        let thi = this
        let par = {
          K: 'TERM_END',
          V:{
            TID: thi.tid
          }
        }
        Operate(par).then((res) => {
          this.isShow = false
          if (res.data.R) {
            thi.getLog(res.data.V.operate)
            thi.$Message.success('请求成功！')
            // 所有按钮置灰
            for (let i = 0; i < this.switchBtn.length; i++) {
              this.switchBtn[i].style.cssText = 'background: #f3f3f3;color:#666'
              this.switchBtn[i].disabled = true
            }
          } else {
            thi.getLog(res.data.ERR_MSG)
            thi.$Message.config({
              duration:4
            })
            thi.$Message.error(res.data.ERR_MSG)
          }
        })
      },
      // 操作信息滚动
      stockUp () {
        let vm = this
        vm.$nextTick(()=>{
          // 在线情况滚动
          this.area1 = document.querySelector('.area1')
          this.box1 = document.querySelector('.box1')
          this.box2 = document.querySelector('.box2')
          if (this.box1 !== null && this.box2 !==null) {
            if (this.logList.length === 2) {
              for (let i = 0; i < 2; i++) {
                this.logList.push(this.logList[i])
              }
              this.box2.innerHTML = this.box1.innerHTML
            }
            if (this.logList.length > 2) {
              this.box2.innerHTML = this.box1.innerHTML
            } else {
              this.box2.innerHTML = ''
            }
          }
          if (this.area1 !== null && this.logList.length > 2) {
            if (this.area1.scrollTop >= this.box1.offsetHeight) {
              this.area1.scrollTop = 0
            } else {
              this.area1.scrollTop =  this.area1.scrollTop + 2
            }
          }
          this.mytimer1 = setTimeout(this.stockUp,this.time1)
        })
      },
      moveStock () {
        let vm = this
        vm.$nextTick(()=>{
          // 在线情况滚动
          this.area1 = document.querySelector('.area1')
          this.mytimer1 = setTimeout(this.stockUp,this.time1)
        })
      },
      drawBar(id, edata) {
        let vm = this
        if (document.getElementById(id) === null) {
          return false
        }
        let _chart = {}
        _chart[id] = echarts.init(document.getElementById(id))
        vm.chart = Object.assign({}, vm.chart, _chart)
        vm['chart'][id].setOption({
          tooltip: {
            show: true,
            backgroundColor: '#fff',
            borderColor: '#d3d3d3',
            borderWidth: '1px',
            textStyle: {
              color: '#00B9D3'
            },
            formatter: function (param) {
              if (param.seriesIndex == 0) {
                return '<em style="color:' + param.color + ';">发射方位:' + param.value + '</em> °'
              }
              if (param.seriesIndex == 1) {
                return '<em style="color:' + param.color + ';">发射角度:' + param.value + '</em> °'
              }
            }
          },
          series: [{
            name: '发射方位',
            type: 'gauge',
            min: 0,
            max: 360,
            startAngle: 90,
            endAngle: -269.9999,
            radius: '65%',
            splitNumber: 12,
            axisLine: {
              lineStyle: {
                width: 3,
                shadowBlur: 0,
                color: [
                  [0.25, '#00B9D3'],
                  [0.5, '#00B9D3'],
                  [0.75, '#00B9D3'],
                  [1, '#00B9D3']
                ]
              }
            },
            axisTick: {
              show: true,
              splitNumber: 1
            },
            splitLine: {
              length: 0,
              lineStyle: {
                width: 2
              }
            },
            axisLabel: {
              formatter: function (e) {
                switch (e + "") {
                  case "0":
                    return "北 0";
                  case "360":
                    return "";
                  case "180":
                    return "南180";
                  case "90":
                    return "东 90";
                  case "270":
                    return "270 西";
                  default:
                    return e;
                }
              },
              textStyle: {
                fontSize: 10,
                fontWeight: ""
              }
            },
            pointer: {
              show: 4,
              length: '65%',
              width: 3
            },
            detail: {
              formatter: function (param) {
                return "发射方位:" + "(" + param + "°)";
              },
              offsetCenter: [0, 80],
              textStyle: {
                fontSize: 14
              }
            },
            data: edata[0]
          }, {
            name: '发射角度',
            type: 'gauge',
            center: ['35%', '30%'],
            radius: '50%',
            min: 0,
            max: 90,
            startAngle: 180,
            endAngle: 90,
            splitNumber: 12,
            animation: 0,
            pointer: {
              show: 1,
              length: '60%',
              width: 2
            },
            itemStyle: {
              normal: {
                color: '#5cb85c',
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10,
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            },
            axisLine: {
              lineStyle: {
                color: [
                  [1, '#5cb85c']
                ],
                width: 3
              }
            },
            splitLine: {
              show: 1,
              length: 6,
              lineStyle: {
                width: 1
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: 1,
              distance: 1,
              textStyle: {
                color: '#5cb85c'
              },
              formatter: function (t) {
                switch (t + '') {
                  case '0':
                    return '0';
                  case '45':
                    return '45';
                  case '90':
                    return '90';

                }
              }
            },
            detail: {
              formatter: function (param) {
                return "发射角度:" + param + "°";
              },
              offsetCenter: [-50, 30],
              textStyle: {
                fontSize: 14
              }
            },
            data: edata[1]
          }]

        })
      },
      drawMap(id,lng,lat,polar,angleAxis,radiusAxis,edata,arr) {
        let vm = this
        if (document.getElementById(id) === null) {
          return false
        }

        let _chart = {}
        _chart[id] = echarts.init(document.getElementById(id))
        vm.chart = Object.assign({}, vm.chart, _chart)
        vm['chart'][id].setOption({
          bmap: {
            center: [lng,lat],
            zoom: 14,
            roam: true,
            mapStyle: {
              styleJson: [{}]
            }
          },
          polar: polar,
          angleAxis: angleAxis,
          radiusAxis: radiusAxis,
          series: [{
            type: 'custom',
            radius: '50%',
            coordinateSystem: 'polar',
            renderItem (params, api) {
              let children = []
              let start, end,s
              for (let i = 0; i < edata.length; i+=2) {
                start = api.coord([60,api.value(i)])
                end = api.coord([60,api.value(i+1)])
                s= {
                  type: 'sector',
                  shape: {
                    cx: params.coordSys.cx,//中心x坐标
                    cy: params.coordSys.cy,//中心y坐标
                    r0: 1.5*(arr[i]) ,
                    r: 1.5*(arr[i+1]),
                    startAngle: start[3],//起始角度弧度值
                    endAngle: end[3]//终止角度弧度值
                  },
                  style: {
                    fill: 'red',//填充色
                    opacity: 0.4
                  }
                }
                children.push(s)
              }
              return {
                type: 'group',
                children: children
              }
            },
            data: [edata]
          }],
        })
        // 获取百度地图实例，使用百度地图自带的控件
        vm.bmap = vm['chart'][id].getModel().getComponent('bmap').getBMap()
      },
      loadmap() {
        const map = new BMap.Map('gunMap', {
          enableMapClick: false
        })
        this.bmap = map
        // 设置地图中心坐标
        this.bmap.centerAndZoom(new BMap.Point(114.114129, 35.550339), 4)
        // 设置地图鼠标滚轮放大缩小
        this.bmap.enableScrollWheelZoom()
      },
      getBoundary(map, province,color) {
        var thi = this
        var bdary = new BMap.Boundary()
        bdary.get(province, function (rs) {       //获取行政区域
          // map.clearOverlays()        //清除地图覆盖物
          var count = rs.boundaries.length; //行政区域的点有多少个
          if (count === 0) {
            thi.$Message.error('未能获取当前行政区域');
            return
          }
          var pointArray = []
          for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {
              strokeWeight: 2,
              strokeColor: "blue",
              fillColor: color,
              fillOpacity: 0.1
            }) //建立多边形覆盖物
            map.addOverlay(ply)
            //禁止覆盖物在 map.clearOverlays 方法中被清除
            ply.disableMassClear()
            pointArray = pointArray.concat(ply.getPath())
          }
          map.setViewport(pointArray)   //调整视野
        })
      },
      addMarker(map, point,name,tid,ruleList,rocName,stationId,selectT) {
        // 选中的炮架为标注
        var thi = this
        thi.marker = {}
        if (selectT === 0) {
          var redIcon = new BMap.Icon(thi.imgRed, new BMap.Size(25,30),{anchor: new BMap.Size(14, 26),infoWindowAnchor: new BMap.Size(10, 0)})
          thi.marker = new BMap.Marker(point,{icon:redIcon})
        } else if (selectT === 1) {
          var myIcon = new BMap.Icon(thi.imgSelect, new BMap.Size(25,30),{anchor: new BMap.Size(17, 26),infoWindowAnchor: new BMap.Size(10, 0)})
          thi.marker = new BMap.Marker(point,{icon:myIcon})  // 创建标注
          // this.openInfoWindow.isOpen()
          // 选中的炮架禁射区出现
          thi.data = [],thi.Arr = []
          for (let i = 0; i < ruleList.length; i++) {
            thi.data.push(90-ruleList[i].altitudeLow)
            thi.data.push(90-ruleList[i].altitudeHigh)
            thi.Arr.push(540-ruleList[i].angleStart)
            thi.Arr.push(540-ruleList[i].angleEnd)
          }
          let lng = point.lng
          let lat = point.lat
          thi.drawMap('gunMap',lng,lat,thi.polar,thi.angleAxis,thi.radiusAxis,thi.Arr,thi.data)
        }
        map.addOverlay(thi.marker)//添加点覆盖物
        thi.marker .addEventListener("mouseover", function (e) {
          this.openInfoWindow(infoWindow);
        })
        thi.marker .addEventListener("mouseout", function (e) {
        })
        var title = ''
        if (tid ===  -1) {
          title = "<div style='height:100px; width:250px; font-size:14px; color:#555;background:#FFF;overflow: scroll;overflow-x: hidden'>" +
            "<div style='height:30px; width:250px;float:left;margin-left:5px;'>" +
            "<span style='width:250px;margin-top:4px;line-height:10px; font-size:18px;'>" + "禁射区信息" + "</span>" + "<span style='font-size: 14px;margin-left: 10px'>"+
            "<div style='height:22px; width:260px;margin-top:15px; line-height:10px; font-size:14px;color:#333'>站名: "+ name +
            "</div>"
        } else {
          title = "<div style='height:100px; width:250px; font-size:14px; color:#555;background:#FFF;overflow: scroll;overflow-x: hidden'>" +
            "<div style='height:30px; width:250px;float:left;margin-left:5px;'>" +
            "<span style='width:250px;margin-top:4px;line-height:10px; font-size:18px;'>" + "禁射区信息" + "</span>" + "<span style='font-size: 14px;margin-left: 10px'>"+
            "<div style='height:22px; width:260px;margin-top:15px; line-height:10px; font-size:14px;color:#333'>站名: "+ name +
            "</div>" +
            "<div style='width:260px;margin-top:4px; line-height:10px; font-size:14px;color:#333;'>终端编号: "+ tid +
            "<div style='width:260px;margin-top:15px; line-height:10px; font-size:14px;color:#333'>炮架名称: "+ rocName +
            "</div>"
        }
        var sContent = ''
        let s = 0
        sContent += title
        for (let i = 0; i < ruleList.length; i++) {
          s = i + 1
          sContent +="<div style='width:250px;height: 40px'>"+
            "<div style='width:250px;margin-top:15px; line-height:10px; font-size:12px;float: left;margin-right: 10px;color:red'>区域" + s + ": </div>" +
            "<div style='font-size:12px;'>" +
            "<span  style='margin-top:8px;line-height:10px;float: left;margin-right: 10px'>方位起始角度: " + ruleList[i].angleStart + "</span>" +
            "<span style='margin-top:8px;line-height:10px;float: left'>方位结束角度: " +ruleList[i].angleEnd + "</span>" +
            "<span style='margin-top:8px;line-height:10px;float: left;margin-right: 10px'>高低起始角度: " + ruleList[i].altitudeLow + "</span>" +
            "<span style='margin-top:8px;line-height:10px;float: left'>高低结束角度: " + ruleList[i].altitudeHigh + "</span>" +
            "</div>"
        }
        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
        thi.marker.addEventListener("click", function () {
          thi.regionIds = []
          this.openInfoWindow(infoWindow)
          stationId = stationId + ''
          if (stationId.length >= 6) {
            thi.regionIds = [parseInt(stationId.substr(0,2)), parseInt(stationId.substr(0,4)), parseInt(stationId.substr(0,6)),parseInt(stationId), tid]
            // thi.regionIds[0] = parseInt(stationId.substr(0,2))
            // thi.regionIds[1] = parseInt(stationId.substr(0,4))
            // thi.regionIds[2] = parseInt(stationId.substr(0,6))
            // thi.regionIds[3] = parseInt(stationId.substr(0))
          }
          // thi.regionIds[4] = tid
          thi.tid = tid
        })
      },
    },
    mounted() {
      // this.loadmap()
      let vm = this
      vm.$nextTick(function () {
        vm.drawBar('main', this.echartData)
        // vm.drawMap('gunMap',this.polar,this.angleAxis,this.radiusAxis,[540, 520, 460, 450],[0, 30, 80, 90])
        vm.drawMap('gunMap',116.340331,39.98667,this.polar1,this.angleAxis1,this.radiusAxis1,[],[])
        this.selfBtn = document.querySelector('.selfBtn')
        this.setBegin = document.querySelector('.setBegin')
        this.searchBosa = document.querySelectorAll('.searchRoc')[0]
        this.searchSet = document.querySelectorAll('.searchRoc')[1]
        this.searchBtn = document.querySelector('.searchBtn')
        this.iconRocket = document.querySelectorAll('.iconRocket')
        this.rocketText = document.querySelectorAll('.rocketText')
        // 解锁
        this.lockEle = document.querySelector('.unlock')
        this.codeEle = document.getElementById('codeEle')
        // 发射
        this.lanuchEle = document.querySelector('.lanuch')
        // 结束
        this.end = document.querySelector('.end')
        // 页面所有按钮
        this.switchBtn = document.querySelectorAll('.switchBtn')
        // 添加作业问题记录
        this.addRecordBtn = document.querySelector('.addRecord')
      })

    },
    // 离开页面清除定时器
    beforeRouteLeave (to,from,next) {
      if (from.name === 'operateIntelligent') {
        clearTimeout(this.gpsTime)
        clearTimeout(this.mytimer1)
        clearTimeout(this.naTimer)
        clearTimeout(this.ruleTime)
        this.gpsTime = null
        this.mytimer1 = null
        this.naTimer = null
        this.ruleTime = null
        this.tid = ''
        this.bmap = ''
        // 利用页面按钮是否存在来判断是否执行定时器
        this.selfBtn = null
      }
      next()
    },
    created: function () {
      this.getTimer()
      this.$nextTick(function () {
        this.point = document.querySelectorAll(".point")
        for (let i = 1; i < this.point.length; i++) {
          this.point[i].style.animationPlayState = "paused"
          this.point[i].style.background = '#fff'
        }
      })
      this.provinceMap("#0000ff")
    }
  };
</script>

<style scoped>
  .body {
    font-family:MicrosoftYaHei;
    background: #eff0f4;
    color: #666;
  }
  .demo-spin-container{
    display: inline-block;
    width: 100%;
    height: 100%;
    position: relative;
  }
  .loading{
    width: 40px;height: 40px;
    position: relative;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    background: #fff;
    color:#53C79F;
  }
  .loading::after{
    position: absolute;
    content: '';
    background:linear-gradient(#53C79F, #fff) ;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    z-index: -1;
    border-radius: 50%;
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg) scale(1.1);}
    50%  { transform: rotate(180deg) scale(1.1);}
    to   { transform: rotate(360deg) scale(1.1);}
  }
  .body-content {
    padding: 40px 30px 20px 30px;
  }
  .left{
    margin-top: 75px;
    margin-left: 23px;
    width: 1px;
    height: 610px;
    background: #d3d3d3;
    float: left;
    position: relative;
    z-index: 2;
  }
  .selectRoc{
    width: 780px;
    float: left;
  }
  .comGps{
    /*width: 200px;*/
    float: left;
    margin-top: 5px;
  }
  .weather{
    color:#FFCA80;
    font-size: 20px;
    margin-left: 5px;
  }
  @keyframes donghua {
    0% {
      /*box-shadow:0 0 0 0px rgba(92,184,92,0.8)*/
      transform: scale(1)
    }
    100%{
      transform: scale(1.5)
      /*box-shadow:0 0 0 5px rgba(92,184,92,0.8)*/
    }
  }
  .point{
    width: 20px;
    height: 20px;
    background: #5cb85c;
    border-radius: 50%;
    border: 1px solid #d3d3d3;
    position: absolute;
    top:-4px;
    left:-10px;
    animation:donghua 1.5s infinite;
    animation-fill-mode:backwards;
  }
  .point1{
    position: absolute;
    top: 200px;
    left:-10px;
  }
  .point2{
    position: absolute;
    top: 415px;
    left:-10px;
  }
  .point3{
    position: absolute;
    top: 590px;
    left:-10px;
  }
  .item{
    position: relative;
    background: #fff;
    border-radius:6px;
    box-shadow: 0 0 10px  rgba(0,0,0,0.1);
  }
  .title{
    float: left;
    color:#888;
    font-size:16px;
    margin-right: 10px;
    margin-top:2px;
  }
  .circle{
    width: 18px;
    height: 18px;
    background: #fff;
    border: 1px solid #d3d3d3;
    border-radius: 50%;
    float: left;
    margin-right: 10px;
    margin-top: 3px;
  }
  .title1{
    color:#888;
    font-size:16px;
  }
  .circle1{
    width: 18px;
    height: 18px;
    background: #fff;
    border: 1px solid #d3d3d3;
    border-radius: 50%;
    float: left;
    margin-right: 10px;
    margin-top: 7px;
  }
  /*远程按钮*/
  .checkBtn{
    background-color: #53C79F;
    width: 60px ;
    border-radius: 5px;
    color: #fff;
  }
  /*自检按钮*/
  .selfBtn{
    background-color: #f3f3f3;
    width: 60px ;
    border-radius: 5px;
    color: #666;
  }
  /*火箭弹查询*/
  .searchRoc{
    background-color: #f3f3f3;
    width: 85px;
    border-radius: 5px;
    color: #666;
    margin-top: -5px;
  }
  .rockets{
    border:1px solid #dcdcdc;
    border-radius: 16px;
    display: flex;
    justify-content: space-around;
    padding: 20px 15px;
  }
  .connact{
    height: 1px;
    background:#dcdcdc;
    margin-top: 83px;
  }
  .operation{
    border:1px solid #dcdcdc;
    border-radius: 16px;
    padding:10px;
    margin-top: 10px;
  }
  .rocket{
    text-align: center;
  }
  .iconRocket{
    width:110px;
    height: 110px;
    border-radius: 50%;
    background:#eff0f4;
  }
  /*异常*/
  .rocketBad{
    background: #FF4F4F;
  }
  /*正常*/
  .rocketNomal{
    background:#53C79F ;
  }
  /*放电成功*/
  .rocketCharge{
    background:#ff9900 ;
  }
  .iconRocket>img{
    width: 60%;
    height: 60%;
    margin-top: 25px;
  }
  canvas{
    width: 300px;
  }
  .boTime{
    float:left;
    font-size: 14px;
    color:#888;
    margin-right:20px;
  }
  .timeInput{
    width: 100px;
    margin-top: -5px;
    float: left;
    margin-right: 20px;
  }
  .rocketText{
    font-size: 16px;
    display: block;
    margin-top: 5px;
  }
  /*查询*/
  .searchBtn{
    width: 100px;
    background: #f3f3f3;
    color:#666;
    margin-bottom:10px;
  }
  /*解锁*/
  .unlock{
    width: 52px;
    background: #f3f3f3;
    color:#666;
    text-align: center;
    margin-bottom: 10px;
    margin-right: 3px;
    padding-left: 11px;
  }
  /*发射*/
  .lanuch{
    width: 52px;
    background-color: #f3f3f3;
    color: #666;
    text-align: center;
    margin-bottom:10px;
    padding-left: 11px;
  }
  .end{
    width:100px;
    background-color: #f3f3f3;
    color: #666;
  }
  .card1{
    /*height:150px;*/
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 0 8px rgba(0,0,0,0.1);
  }
  .card2{
    height: 275px;
    padding: 5px 20px;
    position: relative;
  }
  .card3{
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 0 8px rgba(0,0,0,0.1);
    margin-top: 16px;
    /*height: 133px;*/
  }
  /*地图*/
  #gunMap{
    width: 100%;
    height: 100%;
  }
  .mapEle{
    width: 95%;
    height:340px;
    margin:10px;
  }
  .middleV{
    width: 410px;
    padding-top: 5px;
    position: absolute;
    left: 0;
    right:0;
    margin-left: auto;
    margin-right: auto;
  }

  /*开始设置*/
  .setBegin{
    background-color: #f3f3f3;
    color: #666;
    width: 85px ;
    border-radius: 5px;
  }
  .addRecord{
    background: #f3f3f3;
    color:#666;
    width: 120px ;
    border-radius: 5px !important;
    padding-left:8px !important;
  }
  .area1{
    /*overflow-y: scroll;*/
    height: 75px;
  }
  .area2{
    height: 75px;
  }
</style>

