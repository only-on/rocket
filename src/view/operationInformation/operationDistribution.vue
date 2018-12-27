<template>
<div class="body">
  <!--内容-->
  <div class="body-content">
    <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
      作业分布
    </Row>
    <div style="background:rgba(240,240,240,1);height: 1px"></div>
    <Row type="flex" justify="center" style="height: 780px;padding: 0px 20px 20px;"  >
      <Col span="24">
      <div id="outer-box">
        <div id="container" class="map"></div>
      </div>
      </Col>
    </Row>
  </div>
</div>
</template>

<script>
  import { Launch } from '../../api/api'
export default {
  data () {
    return {
      stationList: [],
    }
  },
  methods: {
    loadmap () {
      const map = new BMap.Map('container', {
        enableMapClick:true
      })
      this.map = map
      // 设置地图中心坐标
      map.centerAndZoom(new BMap.Point(114.114129, 35.550339), 5)
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
    addMarker (map,point,terminalId,totalCount,counts,stationName,address,rocketName) {
      var marker = new BMap.Marker(point) //创建点覆盖物
      map.addOverlay(marker)//添加点覆盖物
      // 添加文字标注
      var label = new BMap.Label(rocketName,{offset:new BMap.Size(20,-10)})
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
      var sContent = "<div style='height:100px; width:300px; font-size:14px; color:#555;background:#FFF;'>"+
        "<div style='height:100px; width:222px;float:left;margin-left:5px;'>"+
        "<span style='height:32px; width:252px;margin-top:10px;line-height:20px; font-size:20px;'>" +"作业信息"+ "</span>"+"<span style='font-size: 14px;margin-left: 10px'>"+"</span>"+
        "<div style='height:32px; width:222px;margin-top:10px; line-height:20px; font-size:12px;margin-left:20px'>站名："+ stationName +"</div>"+
        "<div style='height:32px; width:222px;margin-top:4px; line-height:20px; font-size:12px;margin-left:20px'>终端编号："+ terminalId +"</div>"+
        "<div style='height:32px; width:222px;margin-top:4px; line-height:20px; font-size:12px;margin-left:20px'>炮架名称："+ rocketName +"</div>"+
        "<div style='height:32px; width:222px;margin-top:4px; line-height:20px; font-size:12px;margin-left:20px'>发射弹数："+ totalCount +"枚</div>"+
        "<div style='height:32px; width:222px;margin-top:4px; line-height:20px; font-size:12px;margin-left:20px'>作业次数："+ counts + "次</div>"+
        "<div style='height:32px; width:222px;margin-top:4px; line-height:20px; font-size:12px;margin-left:20px'>详细地址："+ address + "</div>"
      ;
      var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
      marker.addEventListener("click", function(){
        this.openInfoWindow(infoWindow);
      });
    }
  },
  mounted () {
    this.loadmap()
  },
  created:function () {
    let par = {
      K: 'GET_WORK_DISTRIBUTION',
      V: {}
    }
    Launch(par).then((res) => {
      if (res.data.R) {
        this.stationList = res.data.V.RESULT
        this.getBoundary(this.map,res.data.V.province)
        for (let i = 0; i < this.stationList.length; i++) {
          let gpsX = this.stationList[i].x
          let gpsY = this.stationList[i].y
          let point = new BMap.Point(gpsX,gpsY)
          let terminalId = this.stationList[i].terminalId
          let totalCount = this.stationList[i].totalCount
          let counts = this.stationList[i].counts
          let address = this.stationList[i].stationAddress
          let stationName = this.stationList[i].stationName
          let rocketName = this.stationList[i].rocketName
          this.addMarker(this.map,point,terminalId,totalCount,counts,stationName,address,rocketName)
        }
      }
    })
  }
}
</script>

<style scoped>
  .body {
    padding: 20px 30px;
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
  .head-cart {
    float: right;
    margin-right: 20px;
    padding: 20px;
    width: 147px;
    height: 86px;
    background-color: #fff;
  }
  .body-head>.head-cart:first-child{
    margin-right: 0;
  }
  .cart-title {
    font-size:16px;
    color:rgba(102,102,102,1);
  }
  .body-content {
    margin: 10px 0px 10px 0px;
    border: 5px solid #fff;
  }
  #outer-box {
    height: 100%;
    width: 100%;
    padding-right: 300px;
    border-radius: 6px;
  }
  #container {
    height: 100%;
    width: 100%;
    border-radius: 6px;
  }
</style>
