<template>
  <div class="body">
    <div id="testBox"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import bmap from 'echarts/extension/bmap/bmap'
  import china from 'echarts/map/js/china'
    export default {
      data () {
        return {
          bmap: '',
          dataTest: [
            [{name:'运城'}, {name:'稷山',value:70}],
            [{name:'运城'}, {name:'万荣',value:40}]
          ]
        }
      },
      methods: {
        drawMap(id,edata) {
          var geoCoordMap = {}
          var mapFeatures = echarts.getMap('china').geoJson.features
          mapFeatures.forEach(function(v) {
            // 地区名称
            var name = v.properties.name
            // 地区经纬度
            geoCoordMap[name] = v.properties.cp
          })
          var convertData = function (edata) {
            var res = []
            for (var i = 0; i < edata.length; i++) {
              var dataItem = edata[i]
              // console.log(dataItem)
              var fromCoord = geoCoordMap[dataItem[0].name]
              var toCoord = geoCoordMap[dataItem[1].name]
              console.log(fromCoord)
              if (fromCoord !== undefined && toCoord !== undefined) {
                res.push({
                  fromName: dataItem[0].name,
                  toName: dataItem[1].name,
                  coords: [fromCoord, toCoord],
                  value: dataItem[1].value
                })
              }
            }
            return res
          }
          var aa = [
            {
              fromName: '运城',
              toName: '稷山',
              coords: [
                  [111.01511,35.031997],
                  [110.985395,35.611579]
              ],
              value: 70
            },
            {
              fromName: '运城',
              toName: '河津',
              coords: [
                [111.01511,35.031997],
                [110.719146,35.601693]
              ],
              value: 40
            },
          ]
          var bb = [
            ['稷山',[110.985395,35.611579], 70 ],
              ['河津',[110.719146,35.601693], 40 ]
          ]
          console.log(convertData(edata))
          let vm = this
          if (document.getElementById(id) === null) {
            return false
          }

          let _chart = {}
          _chart[id] = echarts.init(document.getElementById(id))
          vm.chart = Object.assign({}, vm.chart, _chart)
          var series = []
          series.push(
            {
              name: ' Top10',
              type: 'lines',
              coordinateSystem: 'bmap',
              zlevel: 1,
              // 线特效--尾迹
              effect: {
                show: true,
                period: 6,//特效动画时间
                trailLength: 0.7,//特效尾迹长度
                color: '#fff',
                symbolSize: 3
              },
              lineStyle: {
                normal: {
                  color: '#000',
                  width: 0,
                  curveness: 0.2 /*边的曲度*/
                }
              },
              data: aa
            },
            {
              name: ' Top10',
              type: 'lines',
              coordinateSystem: 'bmap',
              zlevel: 2,
              symbol: ['none', 'arrow'], //线两端的标记类型
              symbolSize: 10,
              effect: {
                show: true,
                period: 6,
                trailLength: 0,
                symbol: 'arrow',
                symbolSize: 15
              },
              lineStyle: {
                normal: {
                  color: '#a6c84c',
                  width: 1,
                  opacity: 0.6,
                  curveness: 0.2
                }
              },
              data: aa
            },
            {
              name: ' Top10',
              type: 'effectScatter',
              coordinateSystem: 'bmap',
              zlevel: 2,
              rippleEffect: {
                brushType: 'stroke'
              },
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: '{b}'
                }
              },
              symbolSize: 15,
              itemStyle: {
                normal: {
                  color: 'red'
                }
              },
              data: bb.map(function (dataItem) {
                  console.log(dataItem)
                  return {
                    name: dataItem[0],
                    value: dataItem[1].concat(dataItem[2])
                  }
                })
              //   edata.map(function (dataItem) {
              //   console.log(dataItem)
              //   return {
              //     name: dataItem[1].name,
              //     value: geoCoordMap[dataItem[1].name] === undefined ? '' : geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
              //   }
              // })
            }
            )
          vm['chart'][id].setOption({
            bmap: {
              center: [115.97, 29.71],
              zoom: 6,
              roam: true
            },
            tooltip : {
              trigger: 'item',
              formatter:function(params, ticket, callback){
                // console.log(params);
                if(params.seriesType=="effectScatter") {
                  return "线路："+params.data.name+""+params.data.value[2]
                }else if(params.seriesType=="lines"){
                  return params.data.fromName+">"+params.data.toName+"<br />"+params.data.value
                }else{
                  return params.name
                }
              }
            },
            series: series
          })
          // 获取百度地图实例，使用百度地图自带的控件
          vm.bmap = new BMap.Map(vm['chart'][id], {
            enableMapClick: false
          })
          // vm.bmap = vm['chart'][id].getModel().getComponent('bmap').getBMap()
          var geoc = new BMap.Geocoder()
          geoc.getPoint('运城市', function(point) {
            console.log(point)
          })
          // vm.bmap.addEventListener("click", function(e){
          //   var pt = e.point
          //   geoc.getLocation(pt, function(rs){
          //     var addComp = rs.addressComponents
          //     alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber)
          //   })
          // })
        },
      },
      mounted () {
        let vm = this
        vm.$nextTick(function () {
          vm.drawMap('testBox', vm.dataTest)
        })
      }
    }
</script>

<style scoped>
.body{
  height: 90%;
  margin: 30px;
}
  #testBox{
    width: 100%;
    height:100%;
  }
</style>
