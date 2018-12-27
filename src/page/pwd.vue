<template>
  <div class="body">
    <img src="../assets/backround.png" alt="">
    <div class="mainContent">
      <img src="../assets/loginBack.png" alt="">
      <Form :model="form" :label-width="100" ref="form" style="margin-top: 60px;" :rules="ruleCustom" >
        <Row type="flex" justify="center">
          <Col span="24" pull="4">
          <FormItem label="">
            <Input type="text" v-model="form.username" placeholder="请输入用户名" style="width: 200px">
            </Input>
          </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="24" pull="4">
          <FormItem label="">
            <Input v-model="form.password" placeholder="验证码" style="width: 100px">
            </Input>
            <Button id="btn" @click="submitCode" :disabled="dis" style="background-color: #53C79F;color:#fff; width:80px;padding: 5px;margin-left: 15px">{{text}}</Button>
          </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="24" pull="4">
          <FormItem label="" prop="passwd">
            <Input type="password" v-model="form.passwd" placeholder="输入新密码" style="width: 200px">
            </Input>
            <!--<Input  v-model="form.password" placeholder="请输入用户密码"></Input>-->
          </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="24" pull="4">
          <FormItem label="" prop="passwdCheck">
            <Input type="password" v-model="form.passwdCheck" placeholder="确认新密码" @on-enter="submit(form)" style="width: 200px">
            </Input>
            <!--<Input  v-model="form.password" placeholder="请输入用户密码"></Input>-->
          </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="24" pull="4">
          <FormItem>
            <Button @click="submit(form)"  class="btn-list" style=" width:200px;margin-bottom: 10px;letter-spacing: 5px;">提交</Button>
          </FormItem>
          </Col>
        </Row>
        <!--<Alert type="warning" show-icon v-show="showNotice" style="margin-top: 30px">-->
          <!--请输入用户账号！-->
          <!--&lt;!&ndash;<span slot="desc"></span>&ndash;&gt;-->
        <!--</Alert>-->
      </Form>
    </div>
    <div class="copy1">CopyRight © 北京厚力德仪器设备有限公司 .All Rights Reserved 2018 - 2019</div>
  </div>
</template>

<script type="application/ecmascript">
  import { sendCode, resetCode } from '../api/api'
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
        timer: 60,
        stop: false,
        interval: null,
        text: '获取验证码',
        dis: false,
        showNotice: false,
        single: false,
        form: {
          username: '',
          password: '',
          passwd: '',
          passwdCheck: ''
        },
        token: '',
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
    methods: {
      // 验证码
      submitCode () {
        if (this.form.username.trim() !== '') {
          this.startTimer()
          let p = {
            K: 'SEND_VERIFICATION_CODE',
            V: {
              userId: this.form.username.trim(),
              type: 0
            }
          }
          sendCode(p).then((res) => {
            if (res.data.R) {
              this.$Message.success('验证码已经发送尾号为' + res.data.V.RESULT.substr(7) +'的手机，请及时查看短信验证码!');
            } else {
              this.$Message.error(res.data.ERR_MSG)
              this.timer = 60
              clearInterval(this.Interval)
              this.text = '获取验证码'
            }
          })
        } else {
          this.form.username = ''
          this.$Message.error('请输入用户名！')
        }
      },
      update () {
        if (this.timer <= 0) {
          this.timer = 60
          clearInterval(this.Interval)
          this.dis = false
          this.text = '获取验证码'
          document.getElementById('btn').style.backgroundColor = '#688ac2'
        } else {
          this.text = '正在获取' + this.timer-- + 's'
          this.dis = true
          document.getElementById('btn').style.backgroundColor = '#bbbec4'
        }
      },
      // 定时器
      startTimer () {
        if (this.stop === false) {
          this.Interval = setInterval(this.update, 1000)
        } else {
          clearInterval(this.Interval)
        }
      },
      pwd () {
        this.$router.push({path: '/home'})
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let p = {
              K: 'SEND_VERIFICATION_CODE',
              V: {
                userId: this.form.username,
                password: this.form.passwd,
                code: this.form.password
              }
            }
            resetCode(p).then((res) => {
              if (res.data.R) {
                this.$Message.success('密码找回成功，请重新登录!');
                this.$router.push({path: '/'})
              } else {
                this.$Message.error(res.data.ERR_MSG)
              }
            })
          } else {
            this.$Message.error('信息校验失败!');
          }
        })
      }
    }
  }
</script>

<style  scoped>
  .body{
    width:100vw;
    height:100vh;
    background-color: #424f63;
  }
  .body>img{
    width: 100%;
    height: 100%;
    position: absolute;
    left:0;
    top:0;
  }
  .mainContent {
    text-align:center;
    width: 300px;
    height: 480px;
    position: absolute;
    left:0;
    right:0;
    top:200px;
    border-radius: 10px;
    margin-left:auto;
    margin-right:auto;
    background-color: #fff;
    z-index: 1;
  }
  .mainContent>img{
    width:150px;
    height: 130px;
    margin-top: 20px;
    margin-bottom: -40px;
  }
  .topTitle {
    font-size: 30px;
    color: #424f63;
    margin-top: 30px;
    font-weight: 500;
  }
  .titleTwo {
    color: #424f63;
    font-size: 20px;
    font-weight: 100;
    margin-top: 10px;
  }
  .copy1 {
    color: #555;
    font-size: 16px;
    text-align: center;
    top: 90%;
    position: relative;
  }
  .ivu-form-item-error-tip{
    position: absolute !important;
    top:100%;
    left: 6px !important;
  }
</style>
