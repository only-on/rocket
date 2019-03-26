<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          用户管理
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
            <Row type="flex" justify="start" class="condition">
              筛选条件
            </Row>
            <Row type="flex" justify="start" style="padding:10px 0">
              <div class="search-title">关键字</div>
              <Input  v-model="param.condition" icon="ios-close-circle" @on-click="backKeyword" ref="search" placeholder="用户真实姓名/手机号码/站名搜索" style="width: 270px; float: left;" @on-change="keywordChange()">
              </Input>
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
                  ref="tablePage" show-elevator :transfer="true"></Page>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-model="addUser"
      title="添加用户"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="700">
      <Form :model="updateModal" :label-width="100" ref="updateModal" :rules="ruleValidate">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="权限范围" prop="stationId">
            <regionSite @region="regionChange" style="float:left;"  :regionIds="regionIds"></regionSite><br>
            <span class="notice" v-if="siteNotice">请选择权限范围</span>
          </FormItem>
          <FormItem label="用户名" prop="userId">
            <Input  v-model="updateModal.userId"  style="width: 200px; float: left"  @on-change="nameVal(updateModal.userId)" placeholder="用户名"></Input>
            <span class="notice" v-if="nameNotice">用户名不能超过20位</span>
            <span class="notice" v-if="wordNotice">用户名不能为汉字</span>
            <br>
          </FormItem>
          <FormItem label="手机号码" prop="telephone">
            <Input  v-model="updateModal.telephone"  style="width: 200px; float: left"  @on-change="phoneVal(updateModal.telephone)" placeholder="电话"></Input>
            <span class="notice" v-if="phoneNotice">请输入正确的手机号码</span><br>
          </FormItem>
          <FormItem label="真实姓名" prop="name">
            <Input  v-model="updateModal.name"  style="width: 200px; float: left"  @on-change="realNameVal(updateModal.name)" placeholder="真实姓名 "></Input>
            <span class="notice" v-if="realNameNotice">真实姓名不能超过20位</span>
            <span class="notice" v-if="wordNameNotice">真实姓名不能为数字</span>
            <br>
          </FormItem>
          <FormItem label="初始密码" prop="password">
            <Input  v-model="updateModal.password" type="password" style="width: 200px; float: left"  @on-change="passwordVal(updateModal.password)" placeholder="初始密码 "></Input>
            <span class="notice" v-if="passwordNotice"></span>
            <span class="notice" v-if="passwordsNotice">密码必须是6-20位</span><br>
            <span style="color: #bbbec4">系统有默认密码123123，可自行修改</span>
          </FormItem>
          <FormItem>
           <Col span="24" push="8">
            <Button  class="btn-list" @click="okAdd">保存</Button>
            </Col>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Modal
      v-model="editUser"
      title="编辑用户"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd" width="700">
      <Form :model="editModal" ref="editModal" :label-width="130" :rules="ruleValidateEdit">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="权限范围" prop="stationId">
            <regionSite @region="regionChangeEdit" :regionIds="regionIds" style="float:left;"></regionSite><br>
          </FormItem>
          <FormItem label="用户名">{{editModal.userId}}
          </FormItem>
          <FormItem label="手机号码">{{editModal.telephone}}
          </FormItem>
          <FormItem label="真实姓名">{{editModal.name}}
          </FormItem>
          </Col>
          <FormItem style="margin-left: -90px">
            <Button class="btn-list" @click="okEdit">保存</Button>
          </FormItem>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { User } from '../../api/api'
  import regionSite from '../../components/regionSite'
  import store from '../../store/store'
  export default {
    components: {
      regionSite
    },
    data () {
      return {
        station: '',
        editModal: {
          groupId: 0,
          stationId: '',
          telephone: '',
          userId: '',
          name: ''
        },
        regionIds: [],
        stationId: '',
        wordNotice: false,
        wordNameNotice: false,
        addUser: false,
        phoneNotice: false,
        nameNotice: false,
        realNameNotice: false,
        passwordNotice: false,
        passwordsNotice: false,
        siteNotice: false,
        editUser: false,
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          pageNum: 1,
          pageSize: 10,
          condition: ''
        },
        updateModal: {
          stationId: '',
          telephone: '',
          userId: '',
          name: '',
          password: '123123',
          groupId: 0
        },
        columns:[
          {
            title: '用户名',
            key: 'userId',
            align: 'center'
          },
          {
            title: '真实姓名',
            key: 'name',
            align: 'center'
          },
          {
            title: '手机号码',
            key: 'telephone',
            align: 'center'
          },
          {
            title: '权限级别',
            key: 'stationLevel',
            align: 'center',
            render: (h,params) => {
              let level = params.row.stationLevel === 0 ? '省级' : params.row.stationLevel === 1 ? '市级' :  params.row.stationLevel === 2  ? '县级' : '气象站'
              return h('div', level)
            }
          },
          {
            title: '权限范围',
            key: 'stationName',
            align: 'center',
            render: (h,params) => {
              if (params.row.stationLevel === 3) {
                return h('div', params.row.address + ' ' +params.row.stationName)
              } else {
                return h('div', params.row.address)
              }

            }
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
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
                      this.remove(params.row.userId)
                    }
                  }
                }, '删除')])
            }
          }
        ],
        dataTable:[],
        ruleValidate: {
          stationId: [
            {required: true, message: '请选择权限范围'}
          ],
          userId: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          telephone: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        ruleValidateEdit: {
          stationId: [
            {required: true, message: '请选择权限范围'}
          ]
        }
      }
    },
    methods: {
      add () {
        this.updateModal = {
          stationId: '',
          password: '123123',
          groupId: 0
        }
        this.regionIds = []
        this.station = store.state.station
        if (this.station.length === 2) {
          this.regionIds[0] = parseInt(this.station)
          this.updateModal.stationId = this.regionIds[0]
        } else if (this.station.length === 4) {
          this.regionIds[0] = parseInt(this.station.substr(0,2))
          this.regionIds[1] = parseInt(this.station.substr(0))
          this.updateModal.stationId = this.regionIds[1]
        } else if (this.station.length === 6) {
          this.regionIds[0] = parseInt(this.station.substr(0,2))
          this.regionIds[1] = parseInt(this.station.substr(0,4))
          this.regionIds[2] = parseInt(this.station.substr(0))
          this.updateModal.stationId = this.regionIds[2]
        } else if (this.station.length > 6) {
          this.regionIds[0] = parseInt(this.station.substr(0,2))
          this.regionIds[1] = parseInt(this.station.substr(0,4))
          this.regionIds[2] = parseInt(this.station.substr(0,6))
          this.regionIds[3] = parseInt(this.station.substr(0))
          this.updateModal.stationId = this.regionIds[3]
        }
        this.$refs.updateModal.resetFields()
        this.addUser = true
      },
      edit (row) {
        this.regionIds = []
        this.editUser = true
        this.$refs.editModal.resetFields()
        this.editModal.telephone = row.telephone
        this.editModal.name = row.name
        this.editModal.userId = row.userId
        this.stationId = row.stationId.toString()
        if (this.stationId.length === 2) {
          this.regionIds[0] = this.stationId.substr(0,2)
          this.editModal.stationId = parseInt(this.regionIds[0])
        } else if (this.stationId.length === 4) {
          this.regionIds[0] = this.stationId.substr(0,2)
          this.regionIds[1] = this.stationId.substr(0)
          this.editModal.stationId = parseInt(this.regionIds[1])
        } else if (this.stationId.length === 6) {
          this.regionIds[0] = this.stationId.substr(0,2)
          this.regionIds[1] = this.stationId.substr(0,4)
          this.regionIds[2] = this.stationId.substr(0)
          this.editModal.stationId = parseInt(this.regionIds[2])
        } else if (this.stationId.length > 6) {
          this.regionIds[0] = this.stationId.substr(0,2)
          this.regionIds[1] = this.stationId.substr(0,4)
          this.regionIds[2] = this.stationId.substr(0,6)
          this.regionIds[3] = this.stationId.substr(0)
          this.editModal.stationId = parseInt(this.regionIds[3])
        }
        for (let i = 0; i < this.regionIds.length; i++) {
          this.regionIds[i] = parseInt(this.regionIds[i])
        }
      },
      // 编辑用户
      okEdit () {
        if (this.editModal.stationId === '') {
          this.$Message.error('请选择权限范围！')
        } else {
          let par = {
            K: 'USER_UPDATE',
            V: this.editModal
          }
          User(par).then((res) => {
            if (res.data.R) {
              this.$Message.success('用户编辑成功！')
              this.getTableDatas(this.param)
              this.editUser = false
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      submitVal () {
        if (this.updateModal.stationId === '' || this.updateModal.stationId === undefined) {
          this.$Message.error('请选择权限范围！')
          return false
        } else if (this.updateModal.userId === '' || this.updateModal.userId === undefined) {
          this.$Message.error('用户名不能为空！')
          return false
        } else if (this.updateModal.telephone === '' || this.updateModal.telephone === undefined) {
          this.$Message.error('手机号码不能为空！')
          return false
        } else if (this.phoneNotice) {
          this.$Message.error('请输入正确的手机号码！')
          return false
        } else if (this.wordNotice) {
          this.$Message.error('用户名不能为汉字！')
          return false
        } else if (this.nameNotice) {
          this.$Message.error('用户名不能超过20位！')
          return false
        } else if (this.realNameNotice) {
          this.$Message.error('真实姓名不能超过20位！')
          return false
        } else if (this.passwordNotice) {
          this.$Message.error('密码不能为空！')
          return false
        } else if (this.passwordsNotice) {
          this.$Message.error('密码必须是6-20位！')
          return false
        } else {
          return true
        }
      },
      // 添加用户
      okAdd () {
        if (this.submitVal()) {
          let par = {
            K: 'USER_ADD',
            V: this.updateModal
          }
          User(par).then((res) => {
            if (res.data.R) {
              this.updateModal = {
                stationId: '',
                password: '123123',
                groupId: 0
              }
              this.regionIds = []
              this.$Message.success('用户创建成功！')
              this.addUser = false
              this.getTableDatas(this.param)
            } else {
              this.regionIds = []
              this.updateModal = {
                stationId: '',
                password: '123123',
                groupId: 0
              }
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      cancelAdd () {},
      // 用户名验证
      // 用户名字母、数字，，不能为汉字
      nameVal (string) {
        let validate = /^[a-zA-Z0-9_]{0,}$/
        if (string !== '' && string !== undefined) {
          if (validate.test(string.trim())) {
            this.wordNotice = false
            if (string.trim().length > 20 || string.trim().length < 1) {
              this.nameNotice = true
            } else {
              this.nameNotice = false
            }
          } else {
            this.wordNotice = true
            this.nameNotice = false
          }
        } else {
          this.nameNotice = true
          this.wordNotice = false
        }
      },
      // 详细地址验证
      addressVal (string) {
        if (string !== '' && string !== undefined) {
          var validataPrice = /^\d+$/
          if (validataPrice.test(string.trim())) {
            this.addressNotice = true
          } else {
            this.addressNotice = false
          }
        } else {
          this.addressNotice = true
        }
      },
      // 手机号码验证
      phoneVal (string) {
        if (string !== '' && string !== undefined) {
          var validataPrice = /(^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$)/
          if (!validataPrice.test(string.trim())) {
            this.phoneNotice = true
          } else {
            this.phoneNotice = false
          }
        } else {
          this.phoneNotice = true
        }
      },
      // 真实姓名验证
      realNameVal (string) {
        if (string !== '' && string !== undefined) {
          let validate = /^[0-9]*$/
         if (validate.test(string.trim())) {
           this.realNameNotice = false
           this.wordNameNotice = true
         } else {
           this.wordNameNotice = false
           if (string.trim().length > 20 || string.trim().length < 1) {
             this.realNameNotice = true
           } else {
             this.realNameNotice = false
           }
         }
        } else {
          this.realNameNotice = true
          this.wordNameNotice = false
        }
      },
      // 密码验证
      passwordVal (string) {
        if (string !== '' && string !== undefined) {
          if (string.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
            this.passwordNotice = true
            this.passwordsNotice = false
          } else if (string.length > 5 && string.length < 21) {
            this.passwordsNotice = false
            this.passwordNotice = false
          } else {
            this.passwordsNotice = true
            this.passwordNotice = false
          }
        } else {
          this.passwordNotice = true
        }
      },
      remove (id) {
        // console.log(id)
        var th = this
        th.$Modal.confirm({
          title: '删除用户信息',
          content: `确定删除用户？`,
          onOk: function () {
            let par = {
              K: 'USER_DELETE',
              V: {
                id: id
              }
            }
            User(par).then((res) => {
              if (res.data.R) {
                if (th.param.pageNum > 1 && th.dataTable.length === 1) {
                  th.param.pageNum = th.param.pageNum - 1
                }
                th.getTableDatas(th.param)
                th.$Message.success('用户删除成功！')
              } else {
                th.$Message.error(res.data.message)
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
      // 查询公用方法
      getTableDatas: function (param) {
        let vm = this
        vm.$Loading.start()
        let params = {
          K: 'USER_GET_ALL',
          V: param
        }
        User(params).then((res) => {
          vm.$Loading.finish()
          if (res.data.R ) {
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
      regionChangeEdit (data) {
        // console.log(data)
        if (data[data.length - 1] !== undefined) {
          this.editModal.stationId = data[data.length - 1].value
        } else {
          this.editModal.stationId = ''
        }
      },
      regionChange (data) {
        if (this.regionIds[this.regionIds.length - 1] !== undefined) {
          this.updateModal.stationId = this.regionIds[this.regionIds.length - 1] + ''
        }
        if (data !== '' && data !==undefined && data.length !== 0) {
          let daLen = data[data.length - 1].value + ''
          if (this.updateModal.stationId !== undefined && this.updateModal.stationId.length > daLen.length) {
            this.updateModal.stationId = this.updateModal.stationId - 0
          } else {
            this.updateModal.stationId = data[data.length - 1].value
          }
        } else {
          this.updateModal.stationId = ''
        }
        // if (data.length < 4) {
        //   this.siteNotice = true
        // } else {
        //   this.siteNotice = false
        //   this.updateModal.regionAddress = data[0].label + data[1].label + data[2].label
        //   this.updateModal.stationId = data[3].value
        //   // console.log(this.updateModel.regionAddress)
        // }
      }
    },
    created: function () {
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
