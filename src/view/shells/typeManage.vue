<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          型号管理
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
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
            <Page :total="total" :page-size="rows" @on-page-size-change="doPageSizeChange" @on-change="change" show-sizer show-total :page-size-opts="size"                    ref="tablePage" show-elevator :transfer="true"></Page>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-model="addUser"
      title="添加型号"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd">
      <Form :model="updateModal" :label-width="100" :rules="ruleValidate" ref="updateModal">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="炮弹类型" prop="type">
            <Select v-model="updateModal.type"  style="width:200px" >
              <Option v-for="item in typeList" :value="item.type" :key="item.type">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="炮弹型号" prop="name">
            <Input  v-model="updateModal.name"  style="width: 200px; float: left"  @on-change="nameVal(updateModal.name)" placeholder="炮弹型号"></Input>
            <span class="notice" v-if="nameNotice">炮弹型号不能为空</span>
            <span class="notice" v-if="namesNotice">炮弹型号不能超过20个字符</span>
            <br>
          </FormItem>
          <FormItem>
            <Col span="24" push="6">
            <Button class="btn-list" @click="okAdd">保存</Button>
            </Col>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Modal
      v-model="editUser"
      title="编辑型号"
      ok-text="关闭"
      cancel-text=""
      @on-ok="cancelAdd"
      @on-cancel="cancelAdd">
      <Form :model="editModal" ref="editModal" :label-width="130" :rules="ruleValidate">
        <Row type="flex" justify="center">
          <Col span="24">
          <FormItem label="炮弹类型" prop="type">
            <Select v-model="editModal.type"  style="width:200px">
              <Option v-for="item in typeList" :value="item.type" :key="item.type">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="炮弹型号" prop="name">
            <Input  v-model="editModal.name"  style="width: 200px; float: left"  @on-change="nameVal(editModal.name)" placeholder="炮弹型号"></Input>
            <span class="notice" v-if="nameNotice">炮弹型号不能为空</span>
            <span class="notice" v-if="namesNotice">炮弹型号不能超过20个字符</span>
            <br>
          </FormItem>
          <FormItem>
            <Col span="24" push="6">
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
  import { shells } from '../../api/api'
  export default {
    data () {
      return {
        nameNotice: false,
        editUser: false,
        namesNotice: false,
        editModal: {
          id: '',
          type: '1',
          name: '1'
        },
        typeList: [],
        addUser: false,
        size: [10, 20, 30, 40, 50],
        total: 0,
        page: 1,
        rows: 10,
        param: {
          K: 'LIST_PAGE',
          V: {
            pageNum: 1,
            pageSize: 10
          }
        },
        updateModal: {
          name: '',
          type: 1
        },
        columns:[
          {
            title: '编号',
            key: 'id',
            align: 'center'
          },
          {
            title: '炮弹类型',
            key: 'name',
            align: 'center',
            render: (h,params) => {
              let XY = params.row.type === 0 || params.row.type === '0' ? '火箭弹' : params.row.type === 1 || params.row.type === '1' ? '高炮' :'-'
              return h('div', XY)
            }
          },
          {
            title: '炮弹型号',
            key: 'name',
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
                }, '删除')])
            }
          }
        ],
        dataTable:[],
        ruleValidate: {
          name: [
            {required: true, message: '炮弹型号不能为空', trigger: 'blur'}
          ],
          type: [
            { required: true, message: '炮弹类型不能为空' }
          ]
        }
      }
    },
    created: function () {
      this.getTableDatas(this.param)
      this.getTypeList()
    },
    methods: {
      getTypeList () {
        let p = {
          K: 'GET_PRODUCT_TYPE',
          V: {}
        }
        let vm = this
        vm.$Loading.start()
        shells(p).then((res) => {
          vm.$Loading.finish()
          if (res.data.R) {
            vm.typeList = res.data.V.RESULT
          } else {
            vm.typeList = []
          }
        })
      },
      // 口径规格
      nameVal (name) {
        if (name.trim() === '') {
          this.nameNotice = true
          this.namesNotice = false
        } else {
          this.nameNotice = false
          if (name.trim().length > 20) {
            this.namesNotice = true
          } else {
            this.namesNotice = false
          }
        }
      },
      remove (id) {
        // console.log(id)
        var th = this
        th.$Modal.confirm({
          title: '删除型号信息',
          content: `确定删除型号？`,
          onOk: function () {
            let p = {
              K: 'DELETE_PRODUCT',
              V: {
                productId: id
              }
            }
            th.$Loading.start()
            shells(p).then((res) => {
              th.$Loading.finish()
              if (res.data.R) {
                // console.log(th.param)
                if (th.param.V.pageNum > 1 && th.dataTable.length === 1) {
                  th.param.V.pageNum = th.param.V.pageNum - 1
                  th.page = th.page - 1
                }
                th.getTableDatas(th.param)
                th.$Message.success('型号删除成功！')
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
        this.updateModal.name = ''
        this.addUser = true
        this.$refs.updateModal.resetFields()
      },
      edit (row) {
        // console.log(row)
        this.editModal.name = row.name
        this.editModal.id = row.id
        this.editModal.type = row.type
        this.editUser = true
        this.nameNotice = false
        this.namesNotice = false
      },
      submitValEdit () {
        if (this.nameNotice || this.editModal.name === '') {
          this.$Message.error('炮弹型号不能为空, 修改失败！')
          return false
        } else if (this.namesNotice) {
          this.$Message.error('炮弹型号不能超过20个字符！')
          return false
        } else {
          return true
        }
      },
      // 编辑
      okEdit () {
        if (this.submitValEdit()) {
          let p = {
            K: 'UPDATE_PRODUCT',
            V: this.editModal
          }
          shells(p).then((res) => {
            if (res.data.R) {
              this.editUser = false
              this.$Message.success('炮弹型号修改成功！')
              this.getTableDatas(this.param)
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      submitVal () {
        if (this.nameNotice || this.updateModal.name === '') {
          this.$Message.error('炮弹型号不能为空, 新增失败！')
          return false
        }  else if (this.namesNotice) {
          this.$Message.error('炮弹型号不能超过20个字符！')
          return false
        } else {
          return true
        }
      },
      // 添加入库
      okAdd () {
        if (this.submitVal()) {
          let p = {
            K: 'ADD_PRODUCT',
            V: this.updateModal
          }
          shells(p).then((res) => {
            if (res.data.R) {
              this.addUser = false
              this.$Message.success('炮弹型号新增成功！')
              this.getTableDatas(this.param)
            } else {
              this.$Message.error(res.data.ERR_MSG)
            }
          })
        }
      },
      cancelAdd () {},
      // 查询公用方法
      getTableDatas: function (param) {
        let vm = this
        vm.$Loading.start()
        shells(param).then((res) => {
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
      // 区域---------------------------------------------------------------------------------------------
      regionChange (data) {
        // // console.log(data)
        // if (data.length < 3) {
        //   this.addressNotice = true
        // } else {
        //   this.addressNotice = false
        //   this.updateModel.regionAddress = data[0].label + data[1].label + data[2].label
        //   this.updateModel.regionId = data[2].value
        //   // console.log(this.updateModel.regionAddress)
        // }
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
</style>
