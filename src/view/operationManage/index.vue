<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          禁射区管理
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
            <Row type="flex" justify="start" class="condition">
              筛选条件
            </Row>
            <Row  type="flex" justify="start" style="padding-top: 10px">
              <div class="search-title" style="margin-right:30px"> 站点</div>
              <regionSite @region="regionSearch" style="float:left;"  :regionIds="regionIds"></regionSite>
            </Row>
          </Col>
        </Row>
        <!--表格-->
        <div class="tableBox">
          <Table border size="small" :columns="columns" :data="dataTable" :no-data-text="noText"></Table>
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
      v-model="editUser"
      title="禁射区编辑"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="800">
      <Form :model="updateModal" ref="updateModal">
        <Row type="flex" justify="start">
          <Col span="24">
          <div style="margin-bottom:10px">
            <span style="font-size: 14px;font-weight:600;margin-right:10px">站名:</span>{{updateModal.stationName}}
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
  import regionSite from '../../components/regionSite'
  import { stationRule } from '../../api/api'
  export default {
    components: {
      regionSite
    },
    data () {
      return {
        noText: '',
        address: '',
        editUser: false,
        trueList: [],
        obj: {
          stationId: '',
          angleList: '',
          stationName: ''
        },
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          pageNum: 1,
          pageSize: 10
        },
        regionIds: [],
        updateModal: {
          stationId: '',
          address: '',
          angleList: [
            {
            }
          ]
        },
        submit: {
          stationId: '',
          stationRules: []
        },
        columns:[
          {
            title: '站名',
            key: 'stationName',
            align: 'center'
          },
          {
            title: '地址',
            key: 'address',
            align: 'center',
            width: 250
          },
          {
            title: '禁射区（方位起始角度，方位结束角度，高低起始角度，高低结束角度）',
            key: 'angles',
            align: 'center',
            render: (h, params) => {
              if (params.row.angles[0] !== null) {
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
                      this.check(params.row)
                    }
                  }
                }, '炮架禁射区'),
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
      check (row) {
        this.obj.stationId = row.stationId
        this.obj.stationName = row.stationName
        if (row.angles[0] !== null) {
          for (let i = 0; i < row.angles.length; i++) {
            row.angles[i] = row.angles[i].replace("\"", "")
            this.obj.angleList += row.angles[i] + ''
          }
        }
        this.$router.push({name: 'gunManage', params: {param:this.param, index:row}})
      },
      edit (row) {
        this.updateModal.angleList = []
        this.editUser = true
        this.updateModal.stationId = row.stationId
        this.updateModal.stationName = row.stationName
        if (row.angles[0] !== null) {
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
        this.submit.stationId = this.updateModal.stationId
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
            K: 'SAVE_STATION_RULE',
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
      regionSearch (data) {
        if (data !== '' && data !== undefined & data[data.length - 1] !== undefined) {
          if (data.length > 0) {
            this.param.address = data[data.length - 1].value
          } else {
            this.param = {}
          }
          this.param.pageSize = 10
          this.param.pageNum = 1
          this.page = 1
          var thi = this
          thi.getTableDatas(thi.param)
        }
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
      // 查询公用方法
      getTableDatas: function (param) {
        let vm = this
        this.noText = '加载中...'
        vm.$Loading.start()
        let params = {
          K: 'STATION_RULE_LIST',
          V: param
        }
        stationRule(params).then((res) => {
          vm.$Loading.finish()
          if (res.data.R) {
            vm.dataTable = res.data.V.RESULT.list
            vm.total = res.data.V.RESULT.total
            vm.$refs.tablePage.currentPage = vm.page
            if (res.data.V.RESULT.list.length === 0) {
              this.noText = '暂无数据'
            }
          } else {
            this.noText = '暂无数据'
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
    beforeRouteLeave (to,from,next) {
      if (to.name === "gunManage") {
        let para = JSON.stringify(this.obj)
        localStorage.setItem('para',para)
      } else {
        localStorage.removeItem('para')
      }
      next()
    },
    created: function () {
      if (this.$route.params.param !== undefined) {
        this.param = this.$route.params.param
        this.page = this.param.pageNum
        if (this.param.address !== undefined) {
          this.address = this.param.address.toString()
          if (this.address.length === 2) {
            this.regionIds[0] = this.address.substr(0,2)
          } else if (this.address.length === 4) {
            this.regionIds[0] = this.address.substr(0,2)
            this.regionIds[1] = this.address.substr(0,4)
          } else if (this.address.length === 6) {
            this.regionIds[0] = this.address.substr(0,2)
            this.regionIds[1] = this.address.substr(0,4)
            this.regionIds[2] = this.address.substr(0,6)
          } else if (this.address.length > 6) {
            this.regionIds[0] = this.address.substr(0,2)
            this.regionIds[1] = this.address.substr(0,4)
            this.regionIds[2] = this.address.substr(0,6)
            this.regionIds[3] = this.address.substr(0)
          }
          for (let i = 0; i < this.regionIds.length; i++) {
            this.regionIds[i] = parseInt(this.regionIds[i])
          }
        }
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
