<template>
  <div class="headTop">
    <Row>
      <Menu mode="horizontal" >
        <Col span="24">
        <img src="../../assets/logo.png" alt="" style="height: 40px;width: 40px;margin-left: 10px;float: left;margin-right: 15px;margin-top:10px">
        <div style="float: left;color:#fff">
          <p style="height:20px;line-height:20px;font-size: 20px;letter-spacing:10px;font-weight: 600;margin-top: 10px">中兵高炮数据中心</p>
          <p style="height:10px;line-height:10px;font-size: 12px;margin-top:8px;">Chinese Military Artillery Data Center</p>
        </div>
        <div class="headTextTop">
          <div class="person">
            <Icon type="md-person" size="20" style="margin-right: 20px"></Icon>
            <Icon type="md-arrow-dropdown" size="20"></Icon>
            <div class="slider">
              <div class="slideItem" style="display: none">
                <Row type="flex" justify="start" @click.native="setting" style="height: 40px;text-align: center;line-height: 40px">
                  <Icon type="ios-construct" size="16" style="margin-top:12px;margin-left: 10px;margin-right: 5px"></Icon>
                  <span style="font-size: 14px">账号设置</span>
                </Row>
                <Row type="flex" justify="start" @click.native="logout" style="height: 40px;text-align: center;line-height: 40px;margin-top: -8px">
                  <Icon type="md-power" size="16" style="margin-top:12px;margin-left:10px;margin-right: 5px"></Icon>
                  <span style="font-size: 14px">注销</span>
                </Row>
              </div>
            </div>
          </div>
          <!--通知-->
          <!--<div style="float:right;cursor: pointer;margin-right: 10px" @click="noticeMethod" >-->
            <!--<div class="shadow"></div>-->
            <!--<Icon type="md-notifications-outline" size="25" style="position: absolute;top:15px;color:#fff;margin-top: 5px"></Icon>-->
          <!--</div>-->
        </div>
        </Col>
      </Menu>
    </Row>
  </div>
</template>
<script type="application/ecmascript">
  import { Logout, alarms } from '../../api/api'
  import store from '../../store/store'
  import * as types from '../../store/types'
  export default {
    data () {
      return {
        shadow: ''
      }
    },
    created: function () {
      // this.getNoticeNum()
      // this.$nextTick(() => {
      //   this.shadow = document.querySelector('.shadow')
      // })
    },
    methods: {
      noticeMethod () {
        this.$router.push({ path: 'stockAlarm' })
      },
      getNoticeNum () {
        let par = {
          K: 'GET_UNREAD_COUNT',
          V: {}
        }
        alarms(par).then((res) => {
          if (res.data.R) {
            this.num = res.data.V.RESULT
            store.commit(types.Num, JSON.stringify(this.num))
            this.number = JSON.parse(store.state.alarmNum)
            if (JSON.parse(store.state.alarmNum) > 0) {
              this.shadow.style.animationPlayState = "running"
              this.shadow.style.background = 'red'
            } else if (JSON.parse(store.state.alarmNum) === 0) {
              this.shadow.style.animationPlayState = "paused"
              this.shadow.style.cssText += `background:transparent;width:0;height:0`
            }
          }
        })
      },
      setting () {
        this.cs = 'background'
        this.$router.push({ path: 'person' })
      },
      logout () {
        Logout().then((res) => {
          if (res.data.R) {
            this.$router.push({ path: '/' })
          }
        })
      },
    }
  }
</script>
<style  scoped>
  .headTop{
    width: 100%;
    height:60px;
    background-color: #53C79F;
  }
  .person{
    width: 100px;
    height: 60px;
    float: right;
    background: #53C79F;
    margin-right: 30px;
    line-height:60px;
    text-align: center;
    position: relative;
    color: #fff;
  }
  .slider{
    width: 100%;
    height: 0;
    position:absolute;
    top:60px;
    left:0;
    background:#53C79F;
    z-index:2;
    transition: all 0.3s;
    color: #fff;
  }
  .person:hover{
    cursor: pointer;
  }
  .person:hover .slider{
    display: block;
    height: 70px;
    cursor: pointer;
  }
  .person:hover .slideItem{
    display: block !important;
  }
  .shadow{
    width:5px;
    height:5px;
    background: red;
    border-radius: 50%;
    margin-left:15px;
    margin-top: 19px;
    position: relative;
    animation: flash 1s linear infinite;
  }
  @keyframes flash {
    0% {
      box-shadow:0 0 0 0px rgba(224,36,51,0.8)
    }
    100%{
      box-shadow:0 0 0 5px rgba(224,36,51,0.8)
    }
  }
</style>
