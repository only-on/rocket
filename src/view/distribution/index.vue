<template>
  <div class="body">
    <!--导航菜单-->
    <Row type="flex" justify="start" :gutter="16" style="min-width:1660px">
      <Col span="16">
      <Row type="flex" justify="start" :gutter="16" >
        <!--火箭架在线情况-->
        <Col span="12">
          <Row class="card1" style="height:165px;min-width:410px">
          <Row type="flex" justify="start" style="color:#666;font-size: 16px;padding: 10px 20px">
            火箭架在线情况
          </Row>
          <div style="background:rgba(240,240,240,1);height: 1px"></div>
          <Row class="rocketBox" >
            <Col span="11" style="padding: 40px 0px 30px 20px">
            <div class="shell">
              <img src="../../assets/shells.png" alt="">
            </div>
            <Row style="float: left;margin-top: -5px;margin-right:10px;text-align: center">
              <Col span="24">
              <Row style="color:#666;font-size:14px;">
                在线
              </Row>
              <Row style="color:#E96F5C;font-size:14px;">
                {{onlineCount}}
              </Row>
              </Col>
            </Row>
            <Row style="float: left;margin-top: -5px;text-align: center">
              <Col span="24">
              <Row style="color:#666;font-size:14px;">
                离线
              </Row>
              <Row style="color:#E96F5C;font-size:14px;">
                {{offlineCount}}
              </Row>
              </Col>
            </Row>
            </Col>
            <Col span="13" class="area" style="min-width:240px;padding:0px 30px 0 0px;overflow:hidden;height:60px;margin-top: 30px">
              <Row class="box1">
                <Row type="flex" justify="end" :gutter="3" style="margin-bottom: 5px;" v-for="(item,index) in onlineRockets" :key="index"  v-if="onlineRockets.length !== 0">
                  <Col  style="font-size: 14px;color:#666;float: left;" :lg="10" :xs="24">
                  {{item.name}}
                  </Col>
                  <Col  style="font-size: 14px;color:#666;float: left;" :lg="10">
                  {{item.rocketName}}
                  </Col>
                  <Col style="font-size: 14px;color:#E96F5C;float: left" :lg="4" :xs="24">
                  在线
                  </Col>
                </Row>
                <Row type="flex" justify="end" style="margin-bottom: 5px" v-if="onlineRockets.length === 0" >
                  <Col  style="font-size: 14px;color:#666;float: right;margin-right: 20px;margin-top:20px">
                  暂无炮架在线
                  </Col>
                </Row>
              </Row>
            <Row>
              <div class="box2"></div>
            </Row>
            </Col>
          </Row>
        </Row>
        </Col>
        <!--天气-->
        <Col span="12">
        <Row class="card1" style="padding:9px 20px 3px;height:165px;min-width: 540px">
          <Row style="color:#afafaf" type="flex" justify="center" >
          <Col span="18" style="font-size: 14px">
          {{weatherRegion}}
          </Col>
          <Col span="6">
            <img :src="imgPic" alt="" style="width:40px;height: 40px;margin-top: -5px">
            <span  style="font-size: 14px">{{weather.status}}</span>
          </Col>
          </Row>
          <Row type="flex" justify="center" >
          <Col style="color: #63E0B5;font-size:28px;font-weight:600">
          {{weather.temperature}}&#176;
          </Col>
          </Row>
          <Row type="flex" justify="center" style="color:#D9D9D9;font-size: 12px" :gutter="24">
            <Col span="6">
            <Row type="flex" justify="center" style="width: 100%;height:35px">
              <span style="font-size: 18px;color:#666;font-weight:400;">{{weather.windDirection}}</span>
            </Row>
            <Row type="flex" justify="center">
              <span class="weather"><{{weather.windPower}}级</span>
            </Row>
            </Col>
            <Col span="6">
            <Row type="flex" justify="center" style="width: 100%;height: 35px">
              <img src="../../assets/windSpeed.png" alt="" style="width: 30px;height: 100%;text-align: center">
            </Row>
            <Row type="flex" justify="center">
              <span style="margin-top: 5px">风速</span>
              <span class="weather">{{weather.wind_spd}}km/h</span>
            </Row>
            </Col>
          <Col span="6">
            <Row type="flex" justify="center" style="width: 100%;height: 35px">
              <img src="../../assets/tem.png" alt="" style="width: 30px;height: 100%;text-align: center">
            </Row>
            <Row type="flex" justify="center">
              <span style="margin-top: 5px">体感温度</span>
              <span class="weather">{{weather.fl}}&#176;</span>
            </Row>
          </Col>
          <Col span="6">
            <Row type="flex" justify="center" style="width: 100%;height: 35px">
              <img src="../../assets/hum.png" alt="" style="width: 30px;height: 100%;text-align: center">
            </Row>
            <Row type="flex" justify="center">
              <span style="margin-top: 5px">空气湿度</span>
              <span class="weather">{{weather.humidity}}%</span>
            </Row>
          </Col>
          </Row>
        </Row>
        </Col>
      </Row>
      <!--地图-->
      <Row type="flex" justify="start" class="body-content">
        <div style="height: 30px;font-size:20px;color: #555;padding: 5px 0">站点分布信息</div>
        <!--<Row>站点分布信息</Row>-->
        <Col span="24" style="margin-top: -320px">
        <div id="outer-box">
          <div id="container" class="map"></div>
        </div>
        </Col>
      </Row>
      </Col>
      <!--右侧------------------------------------------>
      <Col span="8">
      <!--实时监控打弹数据-->
      <Row class="card2" style="min-width: 400px">
        <Col>
        <Row style="color: #666;font-size: 16px;padding: 10px 20px">
          <Col :lg="10" :xs="24">
          监控打弹数据
          </Col>
          <Col :lg="12" :xs="24" v-if="unOnline" style="font-size: 14px">
          (暂无炮架在线)
          </Col>
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px;margin-bottom: 8px"></div>
        <!--气象站次数-->
        <Row style="font-size:14px;color: #666;padding: 15px 20px 0 20px" type="flex" justify="center">
          <Col :lg="14" :xs="24" style="margin-bottom:10px">
          <span style="letter-spacing: 8px">气象站:</span>
          <Select v-model="site" style="width:130px;margin-left: -3px" clearable @on-change="checkStation">
            <Option v-for="item in stationListOnline" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          </Col>
          <Col :lg="10" :xs="24" style="margin-top: 5px">
          <span>总发射次数:</span>
          <span style="color:#E75F49;margin-left: 10px">{{launchTimes}} 次</span>
          </Col>
        </Row>
        <!--发射弹数-->
        <Row style="font-size:14px;color: #666;padding: 0px 20px;margin-bottom:-10px" type="flex" justify="center">
          <Col :lg="14" :xs="24" style="margin-bottom: 20px">
          <span style="letter-spacing: 3px">炮架名称:</span>
          <Select v-model="terminalId" style="width:130px" clearable @on-change="checkTerminalId">
            <Option v-for="item in onlineTermialIds[num]" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          </Col>
          <Col :lg="10" :xs="24" style="margin-top: 5px">
          <span>总发射弹数:</span>
          <span style="color:#E75F49;margin-left: 10px">{{launchCount}} 枚</span>
          </Col>
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px;margin-top: 10px"></div>
        <!--比例-->
        <Row style="padding: 28px 50px;">
          <Col :lg="12" :xs="24">
          <div class="yuan">{{launchTimes}}次</div>
          </Col>
          <Col :lg="12" :xs="24">
          <div class="yuan yuan1">{{launchCount}}枚</div>
          </Col>
        </Row>
        </Col>
      </Row>
      <!--总数-->
      <Row class="card2" style="padding-bottom: 10px">
        <Col>
        <Row style="color: #666;font-size: 16px;padding: 10px 20px">总数</Row>
        <div style="background:rgba(240,240,240,1);height: 1px;margin-bottom: 30px"></div>
        <!--气象站次数-->
        <Row id="chart"></Row>
        </Col>
      </Row>
      <!--库存告警-->
      <Row class="card2">
        <Col>
        <Row style="color: #666;font-size: 16px;padding: 10px 20px">
          <Col span="20">
          库存告警信息
          </Col>
          <Col span="4" style="color:#E96F5C;font-size: 12px;margin-top: 3px;cursor: pointer" @click.native="alarm">
          详情
          <Icon type="ios-arrow-forward" />
          </Col>
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px;margin-bottom: 7px"></div>
        <div class="area1" style="overflow: hidden;height:85px">
          <Row class="box3" @click.native="alarm">
            <Col class="textAlarm" v-for="(item,index) in alarmList" :key="index" v-if="alarmList.length !== 0">
            {{item.address}}  {{item.stationName}} &nbsp;&nbsp; 炮弹型号: {{item.rocketName}} &nbsp;&nbsp; 库存阈值:  {{item.alarmCount}}  &nbsp;&nbsp; 现有库存:  {{item.currentCount}}
            </Col>
            <Col class="textAlarm1" v-if="alarmList.length === 0">
            暂无库存告警信息
            </Col>
          </Row>
          <Row class="box4"></Row>
        </div>
        </Col>
      </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
  import img from '../../assets/online.png'
  import img100 from '../../assets/100.png'
  import img101 from '../../assets/101.png'
  import img104 from '../../assets/104.png'
  import img200 from '../../assets/200.png'
  import img306 from '../../assets/306.png'
  import img401 from '../../assets/401.png'
  import img511 from '../../assets/511.png'
  import echarts from 'echarts'
  import { getRegion, alarms} from '../../api/api'
  import $ from 'jquery'
  export default {
    data () {
      return {
        img100: img100,
        img101: img101,
        img104: img104,
        img200: img200,
        img306: img306,
        img401: img401,
        img511: img511,
        imgPic: '',
        temp: [],
        onlineArr: [],
        weaParam: {
          location: '',
          key: '9c519bfba3e746e5abad49f5632652b7'
        },
        provinceName: '',
        clearScroll: '',
        img: img,
        alarmCopy: [],
        onlineCopy: [],
        weatherRegion: '',
        unOnline: false,
        onlineCount: '',
        offlineCount: '',
        onlineRockets:[],
        weather: {
          city: '北京',
          status:'晴',
          temperature: '29',
          humidity: '60',
          windDirection: '东',
          windPower:'8',
          fl: '28',
          vis: '',
          cloud: '',
          wind_spd: ''
        },
        weaTimer: '',
        weaData: {},
        address: '',
        stationListOnline: [],
        onlineTermialIds: [],
        stationList: [],
        num: '',
        terminalId: '',
        launchTimes: 0,
        launchCount: 0,
        map: '',
        launchTimesCount: '',
        launchRocketCount: '',
        alarmList: [],
        area: '',
        box1: '',
        box2: '',
        mytimer: null,
        time: 150,
        area1:'',
        box3: '',
        box4: '',
        mytimer1: null,
        time1: 100,
        site: '',
        chartData: {
          barWidth:15,
          color: ['#E6EDFD', '#6186DD'],
          legend: ['发射总次数', '发射总弹数'],
        },
        weatherMap: {}
      }
    },
    methods: {
      // 站点分布
      distribution () {
        let par = {
          K: 'GET_ALL_CONTROL_STATION',
          V: {}
        }
        getRegion(par).then((res) => {
          if (res.data.R) {
            this.stationList = res.data.V.RESULT.stationList
            for (let i = 0; i < this.stationList.length; i++) {
              let gpsX = this.stationList[i].gpsX
              let gpsY = this.stationList[i].gpsY
              let point = new BMap.Point(gpsX,gpsY)
              let name = this.stationList[i].name
              let lauCount = this.stationList[i].launcherCount
              let online = this.stationList[i].online
              let id = this.stationList[i].id
              let address
              if (this.stationList[i].address === null) {
                address = '无'
              } else {
                address = this.stationList[i].address
              }
              let rocCount
              if (this.stationList[i].rocketCount === null) {
                rocCount = 0
              } else {
                rocCount = this.stationList[i].rocketCount
              }
              this.addMarker(id,this.map,point,name,online,lauCount,rocCount,address)
            }
          }
        })
      },
      // 所在省圈住
      roundUp () {
        let par = {
          K: 'GET_ALL_CONTROL_STATION',
          V: {}
        }
        getRegion(par).then((res) => {
          if (res.data.R) {
            this.getBoundary(this.map,res.data.V.RESULT.province)
          }
        })
      },
      // 定时器
      weatherTime (){
        this.weaTimer=setInterval(()=>{
          if (this.mytimer1) {
            clearTimeout(this.mytimer1)
            this.mytimer1 = null
          }
          if (this.mytimer) {
            clearTimeout(this.mytimer)
            this.mytimer = null
          }
          // 在线设备统计
          this.onlineStatus()
          // 火箭架在线情况滚动r
          this.move()
          // 实时监控打弹数据
          this.monitor()
          // 库存告警信息滚动
          this.moveStock()
          // 库存告警接口
          this.checkAlarm()
          // 站点分布
          this.distribution()
        },180000)
      },
      // 火箭架在线情况统计
      onlineStatus () {
        let para = {
          K: 'GET_ONLINE_ROCKET',
          V: {}
        }
        getRegion(para).then((res) => {
          this.onlineRockets = []
          if (res.data.R) {
            this.onlineRockets = []
            if (res.data.V.RESULT.onlineCount === null) {
              this.onlineCount = 0
            } else {
              this.onlineCount = res.data.V.RESULT.onlineCount
            }
            if (res.data.V.RESULT.offlineCount === null) {
              this.offlineCount = 0
            } else {
              this.offlineCount = res.data.V.RESULT.offlineCount
            }
            this.onlineRockets = res.data.V.RESULT.onlineRockets
            this.onlineCopy = this.onlineRockets
          }
        })
      },
      // 火箭架在线情况滚动
      scrollUp () {
        let vm = this
        vm.$nextTick(()=>{
          // 在线情况滚动
          this.area = document.querySelector('.area')
          this.box1 = document.querySelector('.box1')
          this.box2 = document.querySelector('.box2')
          if (this.box1 !== null && this.box2 !==null) {
              if (this.onlineRockets.length === 0) {
                this.box2.style.height = 0
                this.box2.innerHTML = ''
              } else if (this.onlineRockets.length < 3) {
                this.box2.style.height = 0
                this.box2.innerHTML = ''
                this.box1.style.marginTop = '15px'
              } else {
                this.box2.innerHTML = this.box1.innerHTML
              }
          }
          if (this.area !== null && this.onlineRockets.length >= 3) {
            if (this.area.scrollTop >= this.box1.offsetHeight) {
              this.area.scrollTop = 0
            } else {
              this.area.scrollTop =this.area.scrollTop + 2
            }
          }
          this.mytimer = setTimeout(this.scrollUp,this.time)
        })
      },
      move () {
        let vm = this
        vm.$nextTick(()=>{
          // 在线情况滚动
          this.area = document.querySelector('.area')
          this.mytimer = setTimeout(this.scrollUp,this.time)
        })
      },
      // 选择气象站下拉框
      checkStation (change) {
        this.terminalId = ''
        if (change !== '' && change !== undefined) {
          this.num = change
          this.terminalId = this.onlineTermialIds[this.num][0].value
          this.checkTerminalId(this.terminalId)
        } else {
          this.site = ''
          this.num = ''
          this.launchTimes = 0
          this.launchCount = 0
        }
      },
      monitor () {
        let par1 = {
          K: 'ONLINE_ROCKET_PULL',
          V: {}
        }
        getRegion(par1).then((res) => {
          this.stationListOnline = []
          this.onlineTermialIds = []
          this.temp = []
          if (res.data.R) {
            for (let i = 0; i < res.data.V.RESULT.length; i++) {
              let s = {
                value: i,
                label: res.data.V.RESULT[i].stationName
              }
              this.stationListOnline[i] = s
              this.onlineTermialIds[i]= res.data.V.RESULT[i].rocketInners
              for (let j = 0; j < this.onlineTermialIds[i].length; j++) {
                let tt = {
                  value: this.onlineTermialIds[i][j].terminalId,
                  label: this.onlineTermialIds[i][j].stationName
                }
                this.onlineTermialIds[i][j] = tt
              }
            }
            // 气象站默认选择第一个
            if (res.data.V.RESULT.length !== 0) {
              this.site = this.stationListOnline[0].value
              this.unOnline = false
            } else {
              // 无在线炮架文本显示
              this.unOnline = true
              this.site = ''
              this.terminalId = ''
              this.stationListOnline = []
              this.onlineTermialIds = []
              this.launchTimes = 0
              this.launchCount = 0
            }
            // 终端编号默认第一个
            if (res.data.V.RESULT.length !== 0 && this.onlineTermialIds.length !== 0) {
              this.num = 0
              this.terminalId = this.onlineTermialIds[0][0].value
              this.checkTerminalId(this.terminalId)
            }
          }
        })
      },
      checkTerminalId (change) {
        if (change !== '' && change !== undefined) {
          let par = {
            K: 'ONLINE_ROCKET_LAUNCH_COUNT',
            V: {
              terminalId: change
            }
          }
          getRegion(par).then((res) => {
            if (res.data.R){
              let result = res.data.V.RESULT
              if (result.launchTimes === null) {
                this.launchTimes = 0
              } else {
                this.launchTimes = result.launchTimes
              }
              if (result.launchCount === null) {
                this.launchCount = 0
              } else {
                this.launchCount = result.launchCount
              }
            }
          })
        } else {
          this.launchTimes = 0
          this.launchCount = 0
        }
      },
      // 库存告警信息滚动
      stockUp () {
        let vm = this
        vm.$nextTick(()=>{
          // 在线情况滚动
          this.area1 = document.querySelector('.area1')
          // console.log( this.area1)
          this.box3 = document.querySelector('.box3')
          this.box4 = document.querySelector('.box4')
          if (this.box4 !== null && this.box3 !==null) {
            if (this.alarmList.length <= 2) {
              // this.box4.style.height = 0
              this.box4.innerHTML = ''
              this.box3.style.marginTop = '15px'
            } else {
              this.box4.innerHTML = this.box3.innerHTML
            }
          }
          // console.log(this.area1.scrollTop)
          if (this.area1 !== null && this.alarmList.length > 2) {
            if (this.area1.scrollTop >= this.box3.offsetHeight) {
              this.area1.scrollTop = 0
            } else {
              this.area1.scrollTop =  this.area1.scrollTop + 2
            }
          }
          // console.log(this.box3.offsetHeight)
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
      checkAlarm () {
        let par2 = {
          K: 'GET_STOCK_ALARM_ROLL',
          V: {}
        }
        alarms(par2).then((res) => {
          this.alarmList = []
          if (res.data.R) {
            this.alarmList = []
            this.alarmList = res.data.V.RESULT
            this.alarmCopy = this.alarmList
          }
        })
      },
      // 跳转库存告警页面
      alarm () {
        this.$router.push({ name: 'stockAlarm'})
        clearTimeout(this.mytimer)
        clearTimeout(this.mytimer1)
        clearInterval(this.weaTimer)
      },
      loadmap () {
        const map = new BMap.Map('container',{enableMapClick:false})
        this.map = map
        // 设置地图中心坐标
        map.centerAndZoom(new BMap.Point(114.114129, 35.550339), 4)
        // 设置地图鼠标滚轮放大缩小
        map.enableScrollWheelZoom()
      },
      getBoundary (map,province) {
        var bdary = new BMap.Boundary()
        bdary.get(province, function(rs){       //获取行政区域
                                                // map.clearOverlays()        //清除地图覆盖物
          var count = rs.boundaries.length; //行政区域的点有多少个
          if (count === 0) {
            this.$Message.error('未能获取当前行政区域');
            return
          }
          var pointArray = []
          for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i],  {strokeWeight: 2, strokeColor: "blue",  fillColor: "#0000ff", fillOpacity:0.1}) //建立多边形覆盖物
            map.addOverlay(ply)//添加覆盖物
            pointArray = pointArray.concat(ply.getPath())
          }
          map.setViewport(pointArray)   //调整视野
        })
      },
      addMarker (id,map,point,name,online,lauCount,rocCount,address)  {
        var marker
        // marker = new BMap.Marker(point) //创建点覆盖物
        // map.addOverlay(marker)//添加点覆盖物
        // // 离线的为红色标注
        var thi = this
        if (!online) {
          marker = new BMap.Marker(point) //创建点覆盖物
        } else {
          var myIcon = new BMap.Icon(thi.img, new BMap.Size(20,25),{anchor: new BMap.Size(10, 25),infoWindowAnchor: new BMap.Size(10, 0)});
          marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
        }
        map.addOverlay(marker)//添加点覆盖物
        // 添加文字标注
        var label = new BMap.Label(name,{offset:new BMap.Size(20,-10)})
        label.setStyle({borderRadius:'4px'})
        marker.setLabel(label)
        marker.addEventListener("mouseover",function(e){
          marker.setTop(true)
          this.openInfoWindow(infoWindow);
        })
        marker.addEventListener("mouseout",function(e){
          marker.setTop(false)
          this.closeInfoWindow(infoWindow);
        })
        var sContent = "<div style='height:80px; width:300px; font-size:14px; color:#555;background:#FFF;'>"+
          "<div style='height:80px; width:242px;float:left;margin-left:3px;'>"+
          "<span style='height:32px; width:242px;margin-top:4px;line-height:20px;font-size:20px;word-wrap:break-word;'>" + "站点信息" + "</span>"+"<span style='font-size: 14px;margin-left: 10px'>"+
          "<div style='height:32px; width:242px;margin-top:20px; line-height:10px; font-size:12px;margin-left:20px'>站   名：&nbsp;" + name + "</div>"+
          "<div style='height:32px; width:242px;margin-top:4px; line-height:10px; font-size:12px;margin-left:20px'>炮弹库存：&nbsp;" + rocCount + "</div>"+
          "<div style='height:32px; width:242px;margin-top:4px; line-height:10px; font-size:12px;margin-left:20px'>发射架总数：&nbsp;" + lauCount + "</div>"+
          "<div style='height:32px; width:242px;margin-top:4px; line-height:20px;font-size:12px;margin-left:20px'>详细地址：&nbsp;" + address +  "</div>"
        ;
        var infoWindow = new BMap.InfoWindow(sContent);// 创建信息窗口对象
        var that = this
        marker.addEventListener("click", function(e){
          that.site = id
          that.monitor()
          this.openInfoWindow(infoWindow);
        });
      },
      // 图表
      drawBar (id,edata) {
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
            trigger: 'axis',
            formatter: function(params) {
              var time = '';
              var str = '';
              for (var i of params) {
                time = i.name.replace(/\n/g, '') + '<br/>';
                if (i.data === 'null' || i.data === null || i.data === 0) {
                  str += i.seriesName + '：无数据' + '<br/>'
                } else if (i.seriesIndex === 0) {
                  str += i.seriesName + '：' + Math.abs(i.data) + ' 次' +'<br/>'
                } else if (i.seriesIndex === 1) {
                  str += i.seriesName + '：' + Math.abs(i.data) + ' 枚' +'<br/>'
                }
              }
              return time + str;
            },
          },
          grid: {
            left: '10',
            right:'15%',
            width: 'auto',
            height: 'auto',
            containLabel:true,
          },
          legend: {
            bottom: 10,
            right:14,
            itemGap: 10,
            itemWidth: 10,
            itemHeight: 10,
            data: ['发射总次数', '发射总弹数']
          },
          xAxis: {
            type: 'value',
            name: '次/枚',
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: 12,
                color: '#687284',
              }
            }
          },
          yAxis: [{
            name: '年',
            type: 'category',
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: 12,
                color: '#687284',
              },
            },
            data: edata.y
          }],
          color: ['#ED8F8F', '#6186DD'],
          series:[{
            name: '发射总次数',
            type: 'bar',
            barWidth: 20,
            label: {
              normal: {
                // show: true,
                color: '#687284',
                fontSize: '10'
              }
            },
            data: edata.x1
          },
            {
              name:'发射总弹数',
              type: 'bar',
              barWidth: 20,
              label: {
                normal: {
                  // show: true,
                  position: 'right',
                  color: '#687284',
                  fontSize: '10',
                }
              },
              data: edata.x2
            },
          ]
        })
      },
      // 天气
      getwea (location) {
        this.weaParam.location = location
        let thi = this
        $.ajax({
          type:'get',
          url:'https://free-api.heweather.com/s6/weather/now',
          data:this.weaParam,
          success:function(res) {
            let data = res.HeWeather6
            let code = data[0].now.cond_code
            // 温度
            thi.weather.temperature = data[0].now.tmp
            thi.weather.city = data[0].basic.location
            // 体感温度
            thi.weather.fl = data[0].now.fl
            // 实况天气
            thi.weather.status = data[0].now.cond_txt
            // 相对湿度
            thi.weather.humidity = data[0].now.hum
            // 风向
            thi.weather.windDirection = data[0].now.wind_dir
            // 风力
            thi.weather.windPower= data[0].now.wind_sc
            // 风速
            thi.weather.wind_spd= data[0].now.wind_spd
            if (code === '100') {
              thi.imgPic = img100
            } else if (code === '101') {
              thi.imgPic = img101
            } else if (code === '104') {
              thi.imgPic = img104
            } else if (code.charAt(0) === '2') {
              thi.imgPic = img200
            } else if (code.charAt(0) === '3') {
              thi.imgPic = img306
            } else if (code.charAt(0) === '4') {
              thi.imgPic = img401
            } else if (code.charAt(0) === '5') {
              thi.imgPic = img511
            }
          }
        })
      },
    },
    // 离开页面清除定时器
    beforeRouteLeave (to,from,next) {
      if (from.name === 'distribution') {
        clearTimeout(this.mytimer)
        clearTimeout(this.mytimer1)
        clearInterval(this.weaTimer)
        this.mytimer = null
        this.mytimer1 = null
        this.weaTimer = null
      }
      next()
    },
    created:function () {
      // 天气
      this.weatherRegion = sessionStorage.getItem('region')
      this.getwea(this.weatherRegion)
      // 在线设备统计
      this.onlineStatus()
      // 火箭架在线情况滚动
      this.move()
      // 实时监控打弹数据
      this.monitor()
      // 库存告警信息滚动
      this.moveStock()
      // 库存告警接口
      this.checkAlarm()
      // 站点分布
      this.distribution()
      // 所在省圈住
      this.roundUp()
      // 定时器
      this.weatherTime()
    },
    mounted () {
      this.loadmap()
      let vm = this
      // 按年份统计炮弹数
      vm.$nextTick(function () {
        let par3 = {
          K: 'EACH_YEAR_LAUNCH_COUNT',
          V: {}
        }
        getRegion(par3).then((res) => {
          let edate = {
            y: [],
            x1: [],
            x2:[]
          }
          if (res.data.R) {
            if (res.data.V.RESULT !== null && res.data.V.RESULT.length !== 0) {
              var date1 = []
              var date2 = []
              for (let i = 0; i < res.data.V.RESULT.length; i++) {
                edate.y[i] = res.data.V.RESULT[i].year
                date1.push(res.data.V.RESULT[i].launchTimes)
                date2.push(res.data.V.RESULT[i].launchCount)
                edate.x1 = date1
                edate.x2 = date2
              }
            } else {
              edate.x1 = [0]
              edate.x2 = [0]
              edate.y = [2018]
            }
            vm.drawBar('chart', edate)
          }
        })
      })

    }
  }
</script>

<style scoped>
  .body {
    padding: 30px 30px 10px 30px;
    font-family:MicrosoftYaHei;
  }
  .body-content {
    margin: 15px 0px 10px 0px;
    padding: 10px;
    width: 100%;
    height:720px;
    border: 5px solid #fff;
    border-radius: 6px;
    box-shadow: 0 0 8px rgba(0,0,0,0.1);
    background: #fff;
  }
  #outer-box {
    height: 100%;
    width: 100%;
    border-radius: 6px;
    /*padding-right: 300px;*/
  }
  #container {
    height: 100%;
    width: 100%;
    border-radius: 6px;
  }
  .card1{
    /*height:150px;*/
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 0 8px rgba(0,0,0,0.1);
    position: relative;
  }
  .shell{
    width: 80px;
    height: 43px;
    float: left;
    margin-right: 10px;
  }
  .shell>img {
    width: 100%;
    height: 100%;
  }
  .card2{
    width: 100%;
    /*height: 400px;*/
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 0 8px rgba(0,0,0,0.1);
    margin-bottom: 15px;
  }
  .yuan{
    width: 120px;
    height: 120px;
    background: #fff;
    border-radius: 50%;
    border: 10px solid #ED8F8F;
    line-height: 100px;
    text-align: center;
    font-size: 16px;
    color: #ED8F8F;
    /*margin-left: 30px;*/
  }
  .yuan1{
    border: 10px solid #8FACEF;
    color: #8FACEF;
  }
  #chart{
    /*width: 100%;*/
    height: 350px;
    padding: 20px;
    margin-top: -40px;
  }
  .textAlarm{
    padding: 5px 20px;
    font-size: 14px;
    color:#E75F49;
    width:100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  .textAlarm1{
    text-align: center;
    font-size: 16px;
    margin-top: 20px;
  }
  .weather{
    color:#FFCA80;
    font-size: 20px;
    margin-left: 5px;
  }
</style>
