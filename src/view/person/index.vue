<template>
  <div class="body">
    <!--内容-->
    <div class="body-content">
      <div style="min-height: 870px;text-align: left">
        <Row type="flex" justify="start" style="padding:20px;font-size:22px;">
          账号设置
        </Row>
        <div style="background:rgba(240,240,240,1);height: 1px"></div>
        <Form :model="updateModal" :label-width="100" ref="updateModal" style="margin-top: 80px">
          <Row type="flex" justify="end" >
            <Col span="12" >
            <Button @click="editPhone" type="text" style="color: #00B9D3;font-size: larger" v-show="!edit">
              <span>编辑 >></span>
            </Button>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span="12" >
            <FormItem label="用户名" >
              <span >
              {{updateModal.userId}}
              </span>
            </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span="12">
            <FormItem label="真实姓名" >
              <span v-show="!edit">
              {{name}}
              </span>
              <Input type="text" v-model="updateModal.name" placeholder="" style="width: 200px" v-show="edit" @on-change="nameVal(updateModal.name)">
              </Input>
              <span class="notice" v-if="realNameNotice">真实姓名不能超过20位</span>
              <span class="notice" v-if="wordNameNotice">真实姓名不能为数字</span>
              <br>
            </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span="12">
            <FormItem label="手机号码" >
              <span v-show="!edit">
              {{telephone}}
              </span>
              <Input type="text" v-model="updateModal.telephone" placeholder="请输入手机号码" style="width: 200px" v-show="edit" @on-change="phoneVal(updateModal.telephone)" >
              </Input>
              <span class="notice" v-if="phoneNotice">请输入正确的手机号码</span><br>
            </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center" v-show="!edit">
            <Col span="12">
            <FormItem label="密码">
              {{updateModal.password}}
              <Button @click="pwd()"  class="btn-list" style=" width:100px;margin-left: 100px">修改密码</Button>
            </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center" style="margin-top: 50px" v-show="edit">
            <Col span="12">
            <FormItem label="">
              <Button @click="submitEdit()"  class="btn-list" style="width:100px;margin-bottom: 10px;letter-spacing: 5px;margin-right:20px">保存</Button>
              <Button @click="back()"  class="btn-list" style=" width:100px;margin-bottom: 10px;letter-spacing: 5px;">取消</Button>
            </FormItem>
            </Col>
          </Row>
        </Form>
        <Modal
          v-model="addModel"
          title="修改密码"
          ok-text="关闭"
          cancel-text=""
          @on-ok="cancelAdd"
          @on-cancel="cancelAdd">
          <Form :model="form" :label-width="100" :rules="ruleCustom" ref="form">
            <Row type="flex" justify="center">
              <Col span="24" pull="">
              <FormItem label="验证码">

                <Input v-model="form.code" placeholder="验证码" style="width: 100px">
                </Input>
                <Button @click="submitCode" class="btn-list" style="padding: 5px;margin-left: 15px">获取验证码</Button>

              </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="24" pull="">
              <FormItem label="新密码" prop="passwd">
                <Input type="password" v-model="form.passwd" placeholder="输入新密码" style="width: 200px">
                </Input>
                <!--<Input  v-model="form.password" placeholder="请输入用户密码"></Input>-->
              </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span="24" pull="">
              <FormItem label="确认新密码" prop="passwdCheck">
                <Input type="password" v-model="form.passwdCheck" placeholder="确认新密码" @on-enter="submit(form)" style="width: 200px">
                </Input>
                <!--<Input  v-model="form.password" placeholder="请输入用户密码"></Input>-->
              </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <FormItem>
                <Col span="24" pull="11" style="margin-top: 10px">
                <Button class="btn-list" @click="okAdd">保存</Button>
                </Col>
              </FormItem>
            </Row>
          </Form>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
  import { personInfor, resetCode, sendCode, UserEdit } from '../../api/api'
  export default {
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (this.form.passwdCheck !== '') {
            // 对第二个密码框单独验证
            this.$refs.form.validateField('passwdCheck')
          }
          callback()
        }
      }
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认新密码'))
        } else if (value !== this.form.passwd) {
          callback(new Error('密码输入不一致!'))
        } else {
          callback()
        }
      }
      return {
        phoneNotice: false,
        form: {
          code: '',
          passwd: '',
          passwdCheck: ''
        },
        name: '',
        telephone: '',
        addModel: false,
        edit: false,
        realNameNotice: false,
        wordNameNotice: false,
        updateModal: {
          userId: '',
          password: '******',
          name: '',
          telephone: ''
        },
        ruleCustom: {
          passwd: [
            { validator: validatePass, trigger: 'blur' }
          ],
          passwdCheck: [
            { validator: validatePassCheck, trigger: 'blur' }
          ]
        }
      }
    },
    created:function () {
      this.getPersonInfo()
    },
    methods: {
      editPhone () {
        this.edit = true
        this.updateModal.telephone = this.telephone
        this.updateModal.name = this.name
      },
      // 真实姓名验证
      nameVal (string) {
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
      getPersonInfo () {
        let par = {
          K: 'GET_CURRENT_USER',
          V: {}
        }
        personInfor(par).then((res) => {
          if (res.data.R) {
            this.updateModal.userId = res.data.V.RESULT.userId
            this.updateModal.name = res.data.V.RESULT.name
            this.updateModal.telephone = res.data.V.RESULT.telephone
            this.name = res.data.V.RESULT.name
            this.telephone = res.data.V.RESULT.telephone
          }
        })
      },
      submitEdit () {
        if (!this.wordNameNotice) {
          if (!this.realNameNotice) {
            if (!this.phoneNotice) {
              let par = {
                K: 'UPDATE_CURRENT_USER',
                V: {
                  name: this.updateModal.name,
                  telephone: this.updateModal.telephone
                }
              }
              UserEdit(par).then((res) => {
                if (res.data.R) {
                  this.edit = false
                  this.getPersonInfo()
                  this.$Message.success('账号设置成功!');
                } else {
                  this.$Message.error(res.data.ERR_MSG)
                }
              })
            } else {
              this.$Message.error('请输入正确手机号码！')
            }
          } else {
            this.$Message.error('真实姓名不能超过20个字！')
          }
        } else {
          this.$Message.error('真实姓名不能为数字！')
        }
      },
      // 验证码
      submitCode () {
        let p = {
          K: 'SEND_VERIFICATION_CODE',
          V: {
            userId: this.updateModal.userId,
            type: 1
          }
        }
        sendCode(p).then((res) => {
          if (res.data.R) {
            this.$Message.success('验证码已经发送尾号为' + res.data.V.RESULT.substr(7) +'的手机，请及时查看短信验证码!');
          } else {
            this.$Message.error(res.data.ERR_MSG)
          }
        })
      },
      okAdd () {
        this.submit()
      },
      cancelAdd () {},
      pwd () {
        this.addModel = true
        this.form = {}
      },
      back () {
        this.$refs['updateModal'].resetFields()
        this.edit = false
        this.phoneNotice = false
      },
      // 修改密码
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let p = {
              K: 'SEND_VERIFICATION_CODE',
              V: {
                userId: this.updateModal.userId,
                password: this.form.passwd,
                code: this.form.code
              }
            }
            resetCode(p).then((res) => {
              if (res.data.R) {
                this.addModel = false
                this.$Message.success('密码找回成功!');
              } else {
                this.$Message.error(res.data.ERR_MSG)
              }
            })
          } else {
            this.$Message.error('信息校验失败!')
          }
        })
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
