<template>
  <div class="body">
    <img src="../assets/backround.png" alt="">
    <div class="mainContent">
      <img src="../assets/loginBack.png" alt="">

      <Form :model="form" :label-width="90" ref="form" style="margin-top: 60px;">
        <Row type="flex" justify="center">
          <Col span="24" pull="3">
          <FormItem label="">
            <Input type="text" v-model="form.userId" placeholder="请输入用户名" style="width: 200px">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
            <!--<Input  v-model="form.name" placeholder="请输入用户名"></Input>-->
          </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="24" pull="3">
          <FormItem label="">
            <Input type="password" v-model="form.password" placeholder="请输入用户密码" @on-enter="submit" style="width: 200px">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
            <!--<Input  v-model="form.password" placeholder="请输入用户密码"></Input>-->
          </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="24" pull="3">
          <FormItem>
            <Button @click="submit"  class="btn-list" style="width:204px;margin-bottom: 10px;letter-spacing: 5px;margin-right: 5px">登录</Button>
          </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          <Col span="12" pull="3">
          <Checkbox v-model="single" style="color: #fff;padding: 6px" @on-change="remember">记住密码</Checkbox>
          </Col>
          <Col span="12" push="4">
          <Button @click="pwd" style="color:#fff;background-color: transparent;">找回密码</Button>
          </Col>
        </Row>
        <Alert type="warning" show-icon v-show="showNotice">
          请正确填写账号和密码！
          <!--<span slot="desc"></span>-->
        </Alert>
      </Form>
    </div>
    <div class="copy1">CopyRight © 北京厚力德仪器设备有限公司 .All Rights Reserved 2018 - 2019</div>
  </div>
</template>


<script type="application/ecmascript">
  import { Login } from '../api/api'
  import * as types from '../store/types'
  import store from '../store/store'
  export default {
    data () {
      return {
        region: '',
        showNotice: false,
        single: false,
        form: {
          userId: '',
          password: ''
        },
        token: ''
      }
    },
    created: function () {
      if (JSON.parse(store.state.remember).userId!== '' && JSON.parse(store.state.remember).password!== '') {
        this.form.userId = JSON.parse(store.state.remember).userId
        this.form.password = JSON.parse(store.state.remember).password
        this.single = true
      } else {
        this.single = false
      }
    },
    methods: {
      remember (change) {
        if (change === true) {
          store.commit(types.Rem, JSON.stringify(this.form))
        } else {
          var s = {
            userId: '',
            password: ''
          }
          store.commit(types.Rem, JSON.stringify(s))
        }
      },
      pwd () {
        this.$router.push({path: '/password'})
      },
      submit () {
        Login(this.form).then((res) => {
          if (res.data.R) {
            if (this.single === true) {
              store.commit(types.Rem, JSON.stringify(this.form))
            } else {
              var s = {
                userId: '',
                password: ''
              }
              store.commit(types.Rem, JSON.stringify(s))
            }
            store.commit(types.MENU, JSON.stringify(res.data.v))
            store.commit(types.Station, JSON.stringify(res.data.stationId))
            this.$Message.success('登录成功! 欢迎使用中兵高炮数据中心')
            this.$router.push({path: '/home'})
            let start,end
            if (res.data.address.includes('区')) {
              if (res.data.address.includes('市辖')) {
                if (res.data.address.length > 7) {
                  start = res.data.address.indexOf('市辖区')
                  end = res.data.address.lastIndexOf('区')
                  this.region = res.data.address.substring(start+3,end + 1)
                } else {
                  end = res.data.address.indexOf('市辖区')
                  this.region = res.data.address.substring(0,end)
                }
              } else {
                start = res.data.address.indexOf('市')
                end = res.data.address.indexOf('区')
                this.region = res.data.address.substring(start+1,end + 1)
              }
            } else if (res.data.address.includes('县')) {
              start = res.data.address.indexOf('市')
              end = res.data.address.indexOf('县')
              this.region = res.data.address.substring(start+1,end+2)
            } else {
              start = res.data.address.indexOf('省')
              this.region = res.data.address.substring(start+1)
            }
            sessionStorage.setItem('region',this.region)
          } else {
            if (res.data.ERR_MSG.includes('用户已被删除 请联系管理员') || res.data.ERR_MSG.includes('软件需要维护 请联系管理员')) {
              this.showNotice = false
            } else {
              this.showNotice = true
            }
            this.$Message.error(res.data.ERR_MSG)
          }
        })
      }
    }
  }
</script>

<style scoped>
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
    right:0;
    bottom:0;
    margin: auto;
  }
  .mainContent {
    text-align:center;
    width: 300px;
    height: 340px;
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    margin: auto;
    border-radius: 10px;
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
</style>
