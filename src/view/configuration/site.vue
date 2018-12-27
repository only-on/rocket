<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height:870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          站点管理
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row type="flex" justify="start" style="margin-top: 10px">
            <Col :xs="24" :lg="14" :style="{marginBottom: '10px'}">
            <div class="search-title" style="margin-right: 30px"> 站点</div>
            <regionSite @region="regionChangeSite"></regionSite>
            </Col>
            <Col :xs="24" :lg="10" :style="{marginBottom: '10px'}">
            <div class="search-title"> 关键字</div>
            <Input  v-model="keyword" icon="ios-close-circle" @on-click="backKeyword" ref="search" placeholder="站名搜索" style="width: 270px; float: left;" @on-change="keywordChange()">
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
            <Page :total="total" :page-size="rows" @on-page-size-change="doPageSizeChange" @on-change="change" show-sizer show-total :page-size-opts="size"
                  ref="tablePage" show-elevator  :transfer="true"></Page>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-model="addUser"
      title="添加站点"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="800">
      <Form :model="updateModal" :label-width="80" ref="updateModal" :rules="ruleValidate">
        <Row type="flex" justify="center">
          <Col span="20" >
          <FormItem label="站名" prop="name">
            <Input  v-model="updateModal.name"  style="width: 200px; float: left"  @on-change="siteVal(updateModal.name)" placeholder="站名"></Input>
            <span class="notice" v-if="siteNotice">站名不能超过20个字符</span><br>
          </FormItem>
          <FormItem label="所属区域" prop="address">
            <region @region="regionChangeAdd" :regionIds="regionIdsAdd" style="float:left;"></region>
            <span class="notice" v-if="addressVal">所属区域不能为空</span>
            <br>
          </FormItem>
          <FormItem label="详细地址" prop="detailAddress">
            <div>
              <div id="r-result"><input type="text" id="suggestId"  ref="searchInputAdd" value="" placeholder="输入关键字搜索地址" class="inputSea"/></div>
              <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;margin-left:40px;height:100px;display: none"></div>
            </div>
            <span class="notice" v-if="addressNotice">详细地址不能为空</span>
          </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" style="height:400px;">
          <Col span="14">
          <div id="outer-box">
            <div id="container" class="map" tabindex="0"></div>
          </div>
          </Col>
        </Row>
        <Row type="flex" justify="start" style="margin-top:10px;margin-left: 20px">
          <Col span="14" push="2">
          <Alert type="warning" show-icon v-show="showNotice">
            所属区域与地址不一致！确认是否继续保存？
          </Alert>
          </Col>
        </Row>
        <Row type="flex" justify="center" style="cursor: pointer;margin-top: 10px">
          <FormItem>
            <Button class="btn-list" @click="okAdd" v-if="!showNotice" style="position: absolute;bottom:-90px;left:-90px;height:35px;font-size: 14px">保存</Button>
            <Button class="btn-list"  @click="okSave" v-if="showNotice" style="position: absolute;bottom:-90px;left:-90px;height:35px;font-size: 14px;width:90px">{{conSave}}</Button>
          </FormItem>
        </Row>
      </Form>
    </Modal>
    <Modal
      v-model="editUser"
      title="编辑站点"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="800">
      <Form :model="editModal" :label-width="80" ref="editModal" :rules="ruleValidateEdit">
        <Row type="flex" justify="center">
          <Col span="20" >
          <FormItem label="站名" prop="name">
            <Input  v-model="editModal.name"  style="width: 200px; float: left"  @on-change="siteVal(editModal.name)" placeholder="站名"></Input>
            <span class="notice" v-if="siteNotice">站名不能超过20个字符</span><br>
          </FormItem>
          <FormItem label="所属区域" prop="addressEdit">
            <Select  style="width:100px;float:left" placeholder="省" @on-change="changeProvice" clearable v-model="pid" :label-in-value="true" @on-clear="clearSelect">
              <Option v-for='(items, index) in region' :value='items.id' :key="index">{{items.name}}</Option>
            </Select>
            <Select  style="width:100px;float:left" placeholder="市" @on-change="changeCity"  clearable v-model="cid" :label-in-value="true" @on-clear="clearSelect">
              <Option v-for='(itemsc, index) in regionCity' :value='itemsc.id' :key="index">{{itemsc.name}}</Option>
            </Select>
            <Select   v-model="did" style="width:100px;float:left" placeholder="区县" @on-change="changeCountry"  clearable :label-in-value="true" @on-clear="clearSelect">
              <Option v-for='(itemsd, indexk) in regionCountry' :value='itemsd.id' :key="indexk">{{itemsd.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="详细地址" prop="address">
            <div>
              <div id="r-result1"><input type="text" id="suggestId1"  ref="searchInput" value=""  :placeholder="placeholder" class="inputSea1"/></div>
              <div id="searchResultPanel1" style="border:1px solid #C0C0C0;width:150px;margin-left:40px;height:100px;display: none"></div>
            </div>
            <span class="notice" v-if="addressNotice">详细地址不能为空</span>
          </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" style="height:400px;">
          <Col span="14">
          <div id="outer-box1">
            <div id="container1" class="map" tabindex="0"></div>
          </div>
          </Col>
        </Row>
        <Row type="flex" justify="start" style="margin-top:10px;margin-left: 20px">
          <Col span="14" push="2">
          <Alert type="warning" show-icon v-show="showNotice">
            所属区域与地址不一致！确认是否继续保存？
          </Alert>
          </Col>
        </Row>

        <Row type="flex" justify="center" style="cursor: pointer;margin-top: 10px">
          <FormItem>
            <Button class="btn-list" @click="okEdit" v-if="!showNotice" style="position: absolute;bottom:-90px;left:-90px;height:35px;font-size: 14px">保存</Button>
            <Button class="btn-list" @click="okSaveEdit" v-if="showNotice" style="position: absolute;bottom:-90px;left:-90px;height:35px;font-size: 14px;width:90px">继续保存</Button>
          </FormItem>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { getRegion, Station } from '../../api/api'
  import region from '../../components/region'
  import regionSite from '../../components/regionSite'
  import store from '../../store/store'
  import $ from 'jquery'
  export default {
    components: {
      region,
      regionSite
    },
    data () {
      return {
        station: '',
        conSave: '继续保存',
        placeholder: '',
        proviceName: '',
        proviceNameEdit: '',
        cityName: '',
        editDate: [],
        dname: '',
        cname: '',
        pname: '',
        pid: '',
        cid: '',
        did: '',
        stationId: '',
        paramRegion: {},
        regions: [],
        region: [],
        regionCity: [],
        regionCountry: [],
        width: '',
        keyword: '',
        address: '',
        regionIdsAdd: [],
        regionIds: [],
        addressEdit: '',
        mapCountyEdit: '',
        countyEdit: '',
        cityNameEdit: '',
        stationIdAfter: '',
        editAddre: '',
        editModal: {
          stationIdBefore: '',
          stationIdAfter: '',
          name: '',
          gpsX: '',
          gpsY: '',
          address: ''
        },
        addUser: false,
        showNotice: false,
        editUser: false,
        addressVal: false,
        siteNotice: false,
        addressNotice: false,
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          K: 'STATION_LIST',
          V: {
            pageNum: 1,
            pageSize: 10
          }
        },
        county: '',
        mapCounty: '',
        detailAddress: '',
        updateModal: {
          id: '',
          name: '',
          gpsX: '',
          gpsY: '',
          address: ''
        },
        columns:[
          {
            title: '站名',
            key: 'name',
            align: 'center'
          },
          {
            title: '地址',
            key: 'address',
            align: 'center'
          },
          {
            title: '经纬度',
            key: 'address',
            align: 'center',
            render: (h,params) => {
              let XY = params.row.gpsX + '，' +params.row.gpsY
              return h('div', XY)
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
                      this.remove(params.row.id)
                    }
                  }
                }, '删除')])
            }
          }
        ],
        dataTable:[],
        ruleValidate: {
          name: [
            {required: true, message: '站名不能为空', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '所属区域不能为空', trigger: 'blur'}
          ],
          detailAddress: [
            {required: true, message: '详细地址不能为空', trigger: 'blur'}
          ]
        },
        ruleValidateEdit: {
          name: [
            {required: true, message: '站名不能为空', trigger: 'blur'}
          ],
          addressEdit: [
            {required: true, message: '所属区域不能为空', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '详细地址不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      loadmap () {
        var thi = this
        function G(id) {
          return document.getElementById(id);
        }

        var map = new BMap.Map("container",{enableMapClick:false})
        // 开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true)
        // 初始化地图，设置中心点坐标和地图级别
        // map.centerAndZoom("北京",12)
        if (this.cityName !== '' && this.cityName !== undefined) {
          map.centerAndZoom(this.cityName,12)
        } else {
          map.centerAndZoom("北京",12)
        }
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
          {"input" : "suggestId" ,
            "location" : map
          })
        var geocoder= new BMap.Geocoder();
        map.addEventListener("click",function(e){
          // console.log(e);
          // alert(e.point.lng + "," + e.point.lat);
          geocoder.getLocation(e.point,function(rs){
            // thi.detailAddress = rs.address
            // thi.updateModal.address = thi.detailAddress
            thi.updateModal.gpsX = e.point.lng
            thi.updateModal.gpsY = e.point.lat
            thi.mapCounty = rs.addressComponents.district
          })
        });
        ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
          var str = "";
          var _value = e.fromitem.value;
          var value = "";
          if (e.fromitem.index > -1) {
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
          }
          str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

          value = "";
          if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
          }
          str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
          G("searchResultPanel").innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function(e) {
          // console.log(e.item)// 鼠标点击下拉列表后的事件
          var _value = e.item.value;
          myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
          thi.detailAddress = myValue
          thi.updateModal.address = thi.detailAddress
          thi.mapCounty = _value.district
          geocoder.getPoint(thi.updateModal.address,function(rs){
            thi.updateModal.gpsX = rs.lng
            thi.updateModal.gpsY = rs.lat
          })
          this.mapCounty = _value.district
          G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
          setPlace();
        });
        function setPlace(){
          map.clearOverlays();    //清除地图上所有覆盖物
          function myFun(){
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp));    //添加标注
          }
          var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
          });
          local.search(myValue);
          G("searchResultPanel").innerHTML = ''
        }
      },
      editmap () {
        var thi = this
        function G(id) {
          return document.getElementById(id);
        }

        var map = new BMap.Map("container1",{enableMapClick:false})
        // 开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true)
        // 初始化地图，设置中心点坐标和地图级别
        // map.centerAndZoom("北京",12)
        if (this.editDate.length === 0) {
          var point = new BMap.Point(thi.editModal.gpsX,thi.editModal.gpsY)
          map.centerAndZoom(this.proviceNameEdit,12)
          var mask = new BMap.Marker(point);  // 创建标注
          map.clearOverlays();
          map.addOverlay(mask);
          setTimeout(function() {
            map.panTo(point); //1秒后移动到标注之处
          }, 1000)
          map.panTo(point)
        }
        if (thi.cityNameEdit !== '' && thi.cityNameEdit !== undefined) {
          map.centerAndZoom(thi.cityNameEdit,12)
        } else {
          map.centerAndZoom("北京",12)
        }
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
          {"input" : "suggestId1" ,
            "location" : map
          })
        var geocoder= new BMap.Geocoder();
        map.addEventListener("click",function(e){
          // console.log(e);
          // alert(e.point.lng + "," + e.point.lat);
          geocoder.getLocation(e.point,function(rs){
            // thi.editAddress = rs.address
            // thi.editModal.address = thi.editAddress
            thi.editModal.gpsX = e.point.lng
            thi.editModal.gpsY = e.point.lat
            thi.mapCountyEdit = rs.addressComponents.district
          })
        });
        ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
          var str1 = "";
          var _value1 = e.fromitem.value;
          var value1 = "";
          if (e.fromitem.index > -1) {
            value1 = _value1.province +  _value1.city +  _value1.district +  _value1.street +  _value1.business;
          }
          str1 = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value1;

          value1 = "";
          if (e.toitem.index > -1) {
            _value1 = e.toitem.value;
            value1 = _value1.province +  _value1.city +  _value1.district +  _value1.street +  _value1.business;
          }
          str1 += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value1;
          G("searchResultPanel1").innerHTML = str1
        });

        var myValue1;
        ac.addEventListener("onconfirm", function(e) {
          // console.log(e.item)// 鼠标点击下拉列表后的事件
          var _value1 = e.item.value;
          myValue1 = _value1.province +  _value1.city +  _value1.district +  _value1.street +  _value1.business;
          thi.$refs.searchInput.value = myValue1
          thi.editModal.address = thi.$refs.searchInput.value
          thi.mapCounty = _value1.district
          geocoder.getPoint(thi.editModal.address,function(rs){
            thi.editModal.gpsX = rs.lng
            thi.editModal.gpsY = rs.lat
          })
          this.mapCountyEdit = _value1.district
          G("searchResultPanel1").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue1;
          setPlace();
        });
        function setPlace(){
          map.clearOverlays();    //清除地图上所有覆盖物
          function myFun(){
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp));    //添加标注
          }
          var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
          });
          local.search(myValue1);
          G("searchResultPanel1").innerHTML = ''
        }
      },
      add () {
        this.addUser = true
        this.siteNotice = false
        this.$refs.updateModal.resetFields()
        this.$refs.searchInputAdd.value = ''
        this.regionIdsAdd = []
        this.updateModal = {
          id: '',
          name: '',
          gpsX: '',
          gpsY: ''
        },
        this.detailAddress = ''
        this.showNotice = false
        this.station = store.state.station
        if (this.station.length === 2) {
          this.regionIdsAdd[0] = parseInt(this.station)
        } else if (this.station.length === 4) {
          this.regionIdsAdd[0] = parseInt(this.station.substr(0,2))
          this.regionIdsAdd[1] = parseInt(this.station.substr(0))
        } else {
          this.regionIdsAdd[0] = parseInt(this.station.substr(0,2))
          this.regionIdsAdd[1] = parseInt(this.station.substr(0,4))
          this.regionIdsAdd[2] = parseInt(this.station.substr(0,6))
          this.updateModal.id = this.regionIdsAdd[2]
        }
      },
      submitVal () {
        if (this.updateModal.name.trim().length === 0) {
          this.$Message.error('站名为空，新增失败')
          return false
        } else if (this.siteNotice) {
          this.$Message.error('站名不能超过20个字符，新增失败')
          return false
        } else if (this.updateModal.id === ''|| this.updateModal.id === undefined) {
          this.$Message.error('所属区域未选择到区县，新增失败')
          return false
        } else if (this.updateModal.address === '' || this.updateModal.address === undefined) {
          this.$Message.error('详细地址为空，新增失败')
          return false
        } else {
          return true
        }
      },
      // 添加站点
      okAdd () {
        if (this.submitVal()) {
          if (this.county !== this.mapCounty) {
            this.showNotice = true
          } else {
            this.showNotice = false
            this.conSave = '保存'
            this.okSave()
          }
        }
      },
      okSave () {
        this.updateModal.address = this.proviceName + this.updateModal.address
        if (this.submitVal()) {
          let par = {
            K: 'CREATE_STATION',
            V: this.updateModal
          }
          Station(par).then((res) => {
            if (res.data.R) {
              this.regionIdsAdd = []
              this.updateModal = {
                id: '',
                name: '',
                gpsX: '',
                gpsY: ''
              },
                this.detailAddress = ''
              this.$refs.searchInputAdd.value = ''
              this.addUser = false
              this.showNotice = false
              this.$Message.success('站点创建成功！')
              this.getTableDatas(this.param)
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      cancelAdd () {},
      edit (row) {
        this.editDate = []
        this.editUser = true
        this.showNotice = false
        this.siteNotice = false
        this.addressNotice = false
        this.editModal.stationIdBefore = row.id
        this.editModal.name = row.name
        this.editModal.gpsX = row.gpsX
        this.editModal.gpsY = row.gpsY
        this.editModal.address = row.address
        this.$refs.searchInput.value = row.address
        this.placeholder = row.address
        if (row.address !== null) {
          if (row.address.includes('区')) {
            this.mapCountyEdit = row.address.substring(row.address.indexOf('市') + 1,row.address.indexOf('区')+1)
          } else if (row.address.includes('县')) {
            this.mapCountyEdit = row.address.substring(row.address.indexOf('市') + 1,row.address.indexOf('县')+1)
          }
          this.countyEdit = this.mapCountyEdit
        }
        if (row.address !== null) {
          this.proviceNameEdit = row.address.substr(0,3)
        } else {
          this.proviceNameEdit = ''
        }
        this.stationId = row.id.toString()
        this.editModal.stationIdAfter = parseInt(this.stationId)
        this.cid = ''
        this.getRegionChange()
        this.editmap()
        this.cityNameEdit = ''
      },
      submitValEdit () {
        if (this.editModal.name.trim().length === 0) {
          this.$Message.error('站名为空，修改失败')
          return false
        } else if (this.siteNotice) {
          this.$Message.error('站名不能超过20个字符，修改失败')
          return false
        } else if ((this.editModal.stationIdAfter === '' || this.editModal.stationIdAfter === undefined)) {
          this.$Message.error('所属区域未选择到区县，修改失败')
          return false
        } else if (this.editModal.address === '' || this.editModal.address === undefined) {
          this.$Message.error('详细地址为空，修改失败')
          return false
        } else {
          return true
        }
      },
      okEdit () {
        if (this.submitValEdit()) {
          if (this.countyEdit !== this.mapCountyEdit) {
            this.showNotice = true
          } else {
            this.okSaveEdit()
          }
        }
      },
      okSaveEdit () {
        if (this.editModal.stationIdAfter === parseInt(this.stationId)) {
          this.editModal.stationIdAfter = undefined
        }
        // 地址加上省
        if (this.editModal.address.includes(this.proviceNameEdit)) {
          this.editModal.address = this.editModal.address
        } else {
          this.editModal.address = this.proviceNameEdit + this.editModal.address
        }
        let par = {
          K: 'UPDATE_STATION',
          V: this.editModal
        }
        Station(par).then((res) => {
          if (res.data.R) {
            this.editUser = false
            this.$Message.success('站点修改成功！')
            this.getTableDatas(this.param)
          } else {
            this.$Message.error(res.data.ERR_MSG)
          }
        })
      },
      clearSelect () {
        // this.editModal.gpsX = ''
        // this.editModal.gpsY = ''
        this.editModal.stationIdAfter = ''
      },
      getAllProvice (param) {
        this.region = []
        let par = {
          K: 'GET_STATION_COMPONET',
          V: param
        }
        getRegion(par).then((res) => {
          this.region.push(res.data.V.RESULT)
          this.proviceNameEdit = this.region[0].name
          // this.cityNameEdit = this.region[0].name
        })
      },
      changeProvice (change) {
        this.regionCity = []
        this.cityNameEdit = ''
        this.editDate = []
        this.cid = ''
        this.did = ''
        this.cname = ''
        this.dname = ''
        if (change !== '' && change !== undefined) {
          this.pid = change.value
          this.pname = change.label
          this.editDate[0] = change.value
          this.cityNameEdit = change.label
          this.editmap()
          let par = {
            K: 'GET_STATION_COMPONET',
            V: {
              stationId: this.pid
            }
          }
          getRegion(par).then((res) => {
            this.regionCity = res.data.V.RESULT
          })
        } else {
          this.pname = ''
          this.regionCity = []
        }
      },
      changeCity (change) {
        this.regionCountry = []
        this.cityNameEdit = ''
        this.did = ''
        this.dname = ''
        if (change !== '' && change !== undefined) {
          this.cid = change.value
          this.cname = change.label
          this.editDate[1] = change.value
          this.cityNameEdit = change.label
          this.editmap()
          let par = {
            K: 'GET_STATION_COMPONET',
            V: {
              stationId: this.cid
            }
          }
          getRegion(par).then((res) => {
            this.regionCountry = res.data.V.RESULT
          })
        } else {
          this.editDate.splice(1, 2)
          this.cname = ''
          this.regionCountry = []
        }
      },
      changeCountry (change) {
        this.did = ''
        this.cityNameEdit = ''
        if (change !== '' && change !== undefined) {
          this.did = change.value
          this.dname = change.label
          this.editModal.stationIdAfter = change.value
          this.countyEdit= change.label
          this.editDate[2] = change.value
          this.cityNameEdit = change.label
          this.editmap()
        } else {
          this.editDate.splice(2, 1)
        }
      },
      getRegionChange () {
        this.regionCity = []
        this.regionCountry = []
        this.pid = this.stationId.substr(0,2) - 0
        let parc = {
          K: 'GET_STATION_COMPONET',
          V: {
            stationId: this.pid
          }
        }
        getRegion(parc).then((res) => {
          if (res.data.V.RESULT instanceof Array) {
            this.regionCity = res.data.V.RESULT
          } else {
            this.regionCity.push(res.data.V.RESULT)
          }
          this.cid = this.stationId.substr(0,4) - 0
          let pard = {
            K: 'GET_STATION_COMPONET',
            V: {
              stationId: this.cid
            }
          }
          getRegion(pard).then((res) => {
            if (res.data.V.RESULT instanceof Array) {
              this.regionCountry = res.data.V.RESULT
            } else {
              this.regionCountry.push(res.data.V.RESULT)
            }
            this.did = this.stationId.substr(0,6) - 0
          })
        })
      },
      // 站名验证
      siteVal (string) {
        if (string !== '' && string !== undefined) {
          if (string.trim().length > 20) {
            this.siteNotice = true
          } else {
            this.siteNotice = false
          }
        } else {
          this.siteNotice = false
        }
      },
      remove (id) {
        // console.log(id)
        var th = this
        th.$Modal.confirm({
          title: '删除站点信息',
          content: `确定删除站点？`,
          onOk: function () {
            let par = {
              K: 'DELETE_STATION',
              V: {
                stationId: id
              }
            }
            Station(par).then((res) => {
              if (res.data.R) {
                if (th.param.pageNum > 1 && th.dataTable.length === 1) {
                  th.param.pageNum = th.param.pageNum - 1
                }
                th.getTableDatas(th.param)
                th.$Message.success('站点删除成功！')
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
      // 列表搜索
      regionChangeSite (data) {
        if (data !== '' && data !== undefined && data[data.length - 1] !== undefined) {
          if (data.length > 0) {
            this.param.V.addressId = data[data.length - 1].value
          } else {
            this.param.V.addressId = undefined
          }
        }
        this.param.V.pageSize = 10
        this.param.V.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      backKeyword () {
        this.keyword = ''
        this.param.V.name = undefined
        this.param.V.pageSize = 10
        this.param.V.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      keywordChange () {
        this.param.V.name = this.keyword.trim()
        this.param.V.pageSize = 10
        this.param.V.pageNum = 1
        this.page = 1
        var thi = this
        thi.getTableDatas(thi.param)
      },
      // 查询公用方法
      getTableDatas: function (param) {
        let vm = this
        vm.$Loading.start()
        getRegion(param).then((res) => {
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
      regionChangeAdd (data) {
        if (data !== '' && data !== undefined && data.length !== 0) {
          this.addressVal = false
          if (data.length === 3) {
            // for (let i = 0; i < data.length; i++) {
            //   this.detailAddress += data[i].label
            // }
            this.county= data[data.length - 1].label
            this.updateModal.id = data[data.length - 1].value
          } else {
            this.updateModal.id = ''
          }
          if (data[0].label !== undefined) {
            this.proviceName = data[0].label
          } else {
            this.proviceName = this.proviceNameEdit
          }
          this.cityName = data[data.length - 1].label
          this.loadmap()
          // if (this.mapCounty !== '' && this.county !== '') {
          //   if (this.county !== this.mapCounty) {
          //     this.showNotice = true
          //   } else {
          //     this.showNotice = false
          //   }
          // }
        } else {
          this.addressVal = false
          this.updateModal.id = ''
        }
      }
    },
    mounted () {
      this.loadmap()
      this.editmap()
    },
    created: function () {
      this.getTableDatas(this.param)
      this.getAllProvice()
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
  #outer-box,#outer-box1 {
    height: 400px;
    width: 610px;
    margin-left: -80px;
    border: 1px solid #dcdcdc;
    position: relative;
  }
  #container,#container1 {
    height: 400px;
    width: 610px;
  }
  .inputSea,.inputSea1{
    width:300px;
    height:30px;
    border:1px solid #dcdee2;
    border-radius: 4px;
    padding-left: 10px;
  }
  input::-webkit-input-placeholder{
    color:#cccfd4
  }
  .inputSea1 input::-webkit-input-placeholder{
    color: #000
  }
  .inputSea:focus{
    outline: none;
    border:1px solid #53C79F
  }
  .inputSea1:focus{
    outline: none;
    border:1px solid #53C79F
  }
</style>
