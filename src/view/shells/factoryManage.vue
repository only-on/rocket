<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          厂商管理
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Row class="searchBox">
          <Col span="24">
          <Row type="flex" justify="start" class="condition">
            筛选条件
          </Row>
          <Row type="flex" justify="start" style="padding:10px 0">
            <div  class="search-title">关键字</div>
            <Input  v-model="param.condition" icon="ios-close-circle" @on-click="backKeyword" ref="search" placeholder="厂商名称/地址/联系电话搜索" style="width: 300px;float: left" @on-change="keywordChange()">
            </Input>
          </Row>
          </Col>
        </Row>
        <!--表格-->
        <div class="tableBox">
          <Row type="flex" justify="start">
            <Button @click="add"  class="btn-list" style="margin-top:-10px;margin-bottom: 10px">添加</Button>
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
      title="添加厂商"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd">
      <Form :model="updateModal" :label-width="130" :rules="ruleValidate" ref="updateModal">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="厂商名称" prop="name">
            <Input  v-model="updateModal.name"  style="width: 200px; float: left"  placeholder="厂商名称" @on-change="nameVal(updateModal.name)"></Input>
            <span class="notice" v-if="nameNotice"></span>
            <span class="notice" v-if="namesNotice">厂商名称不能超过20个字</span>
            <br>
          </FormItem>
          <FormItem label="厂商地址" prop="address">
            <Input  v-model="updateModal.address"  style="width: 200px; float: left"  placeholder="厂商地址" @on-change="addressVal(updateModal.address)"></Input>
            <span class="notice" v-if="addressNotice"></span>
            <span class="notice" v-if="AddressNotice">厂商地址不能超过50个字</span>
            <br>
          </FormItem>
          <FormItem label="联系电话">
            <Input  v-model="updateModal.tel"  style="width: 200px; float: left"  placeholder="联系电话 " @on-change="phoneVal(updateModal.tel)"></Input>
            <span class="notice" v-if="phoneNotice">请输入正确的联系电话</span>
            <br>
          </FormItem>
          <FormItem>
            <Col span="24" push="5">
            <Button class="btn-list" @click="okAdd">保存</Button>
            </Col>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Modal
      v-model="editUser"
      title="编辑厂商"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd">
      <Form :model="editModal" ref="editModal" :label-width="130" :rules="ruleValidate">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="厂商名称" prop="name" >
            <Input  v-model="editModal.name"  style="width: 200px; float: left"  placeholder="厂商名称 " @on-change="nameVal(editModal.name)"></Input>
            <span class="notice" v-if="nameNotice"></span>
            <span class="notice" v-if="namesNotice">厂商名称不能超过20个字</span>
            <br>
          </FormItem>
          <FormItem label="厂商地址" prop="address" >
            <Input  v-model="editModal.address"  style="width: 200px; float: left"  placeholder="厂商地址 " @on-change="addressVal(editModal.address)"></Input>
            <span class="notice" v-if="addressNotice"></span>
            <span class="notice" v-if="AddressNotice">厂商地址不能超过50个字</span>
            <br>
          </FormItem>
          <FormItem label="联系电话" >
            <Input  v-model="editModal.tel"  style="width: 200px; float: left"  placeholder="联系电话" @on-change="phoneVal(editModal.tel)"></Input>
            <span class="notice" v-if="phoneNotice">请输入正确的联系电话</span>
            <br>
          </FormItem>
          <FormItem>
            <Col span="24" push="5">
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
  import { Vendor } from '../../api/api'
  export default {
    data () {
      return {
        editUser: false,
        editModal: {
          id: '',
          name: '',
          address: '',
          tel: ''
        },
        addUser: false,
        nameNotice: false,
        phoneNotice: false,
        addressNotice: false,
        AddressNotice: false,
        namesNotice: false,
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          condition: '',
          pageNum: 1,
          pageSize: 10
        },
        updateModal: {
          name: '',
          address: '',
          tel: ''
        },
        columns:[
          {
            title: '编号',
            key: 'id',
            align: 'center'
          },
          {
            title: '厂商名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '地址',
            key: 'address',
            align: 'center'
          },
          {
            title: '联系电话',
            key: 'tel',
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
                      this.remove(params.row.id)
                    }
                  }
                }, '删除')
                ])
            }
          }
        ],
        dataTable:[{
          name: ''
        }],
        ruleValidate: {
          name: [
            {required: true, message: '厂商名称不能为空', trigger: 'blur'}
          ],
          address: [
            { required: true, message: '厂商地址不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      remove (id) {
        // console.log(id)
        var th = this
        th.$Modal.confirm({
          title: '删除厂商信息',
          content: `确定删除厂商？`,
          onOk: function () {
            let p = {
              K: 'DELETE_VENDOR',
              V: {
                vendorId: id
              }
            }
            th.$Loading.start()
            Vendor(p).then((res) => {
              th.$Loading.finish()
              if (res.data.R) {
                // console.log(th.param)
                if (th.param.pageNum > 1 && th.dataTable.length === 1) {
                  th.param.pageNum = th.param.pageNum - 1
                  th.page = th.page - 1
                }
                th.getTableDatas(th.param)
                th.$Message.success('厂商删除成功！')
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
      add () {
        this.updateModal = {}
        this.addUser = true
        this.nameNotice = false
        this.namesNotice = false
        this.addressNotice = false
        this.AddressNotice = false
        this.phoneNotice = false
        this.$refs.updateModal.resetFields()
      },
      edit (row) {
        this.editUser = true
        this.editModal.id = row.id
        this.editModal.name = row.name
        this.editModal.address = row.address
        this.editModal.tel = row.tel
        this.nameNotice = false
        this.namesNotice = false
        this.addressNotice = false
        this.AddressNotice = false
        this.phoneNotice = false
      },
      nameVal (string) {
        if (string !== '' && string !== undefined) {
          if (string.trim().length < 1) {
            this.nameNotice = true
          } else if (string.trim().length > 20) {
            this.nameNotice = false
            this.namesNotice = true
          } else {
            this.nameNotice = false
            this.namesNotice = false
          }
        } else {
          this.nameNotice = true
          this.namesNotice = false
        }
      },
      addressVal (string) {
        if (string !== '' && string !== undefined) {
          if (string.trim().length < 1) {
            this.addressNotice = true
          } else if (string.trim().length > 50) {
            this.addressNotice = false
            this.AddressNotice = true
          } else {
            this.addressNotice = false
            this.AddressNotice = false
          }
        } else {
          this.addressNotice = true
          this.AddressNotice = false
        }
      },
      // 手机号码验证
      phoneVal (string) {
        if (string !== '' && string !== undefined) {
          var validataPrice = /(^(\d{3,4}-)?\d{7,8})$|(1[3|4|5|6|7|8|9][0-9]\d{4,8}$)/
          if (!validataPrice.test(string.trim())) {
            this.phoneNotice = true
          } else {
            this.phoneNotice = false
          }
        } else {
          this.phoneNotice = false
        }
      },
      submitVal () {
        if (this.updateModal.name === '' || this.updateModal.name === undefined || this.nameNotice) {
          this.$Message.error('厂商名称为空！')
          return false
        } else if (this.namesNotice) {
          this.$Message.error('厂商名称不能超过20个字！')
          return false
        } else if (this.updateModal.address === '' || this.updateModal.address === undefined || this.addressNotice) {
          this.$Message.error('厂商地址为空！')
          return false
        } else if (this.AddressNotice) {
          this.$Message.error('厂商地址不能超过50个字！')
          return false
        } else if (this.phoneNotice) {
          this.$Message.error('请输入正确的联系电话！')
          return false
        } else {
          return true
        }
      },
      // 添加用户
      okAdd () {
        if (this.submitVal()) {
          let par = {
            K: 'ADD_VENDOR',
            V: this.updateModal
          }
          Vendor(par).then((res) => {
            if (res.data.R) {
              this.updateModal = {}
              this.addUser = false
              this.getTableDatas(this.param)
              this.$Message.success('厂商创建成功！')
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      cancelAdd () {this.$refs.editModal.resetFields()},
      submitEditVal () {
        if (this.editModal.name === '' || this.nameNotice) {
          this.$Message.error('厂商名称为空！')
          return false
        } else if (this.namesNotice) {
          this.$Message.error('厂商名称不能超过20个字！')
          return false
        } else if (this.editModal.address === '' || this.addressNotice) {
          this.$Message.error('厂商地址为空！')
          return false
        } else if (this.AddressNotice) {
          this.$Message.error('厂商地址不能超过50个字！')
          return false
        } else if (this.phoneNotice) {
          this.$Message.error('请输入正确的联系电话！')
          return false
        } else {
          return true
        }
      },
      // 编辑用户
      okEdit () {
        if (this. submitEditVal()) {
          let par = {
            K: 'UPDATE_VENDOR',
            V: this.editModal
          }
          Vendor(par).then((res) => {
            if (res.data.R) {
              this.editUser = false
              this.getTableDatas(this.param)
              this.$Message.success('厂商更新成功！')
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
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
        let par = {
          K: 'LIST_PAGE',
          V: param
        }
        Vendor(par).then((res) => {
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
