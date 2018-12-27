<template>
  <div>
    <div :class="col">
      <transition mode="out-in" enter-active-class="bounceInleft" leave-active-class="bounceOutRight">
        <router-view class="tab-content animated"></router-view>
      </transition>
      <Footer class="layout-footer-center">CopyRight ©
        <a href="javascript:void(0)" style="color:#00B9D3">北京厚力德仪器设备有限公司</a>
        .All Rights Reserved 2018 - 2019
      </Footer>
    </div>
  </div>
</template>
<script>
  export default {
    props: [
      'sideMenuVal'
    ],
    data () {
      return {
        col: 'main-content'
      }
    },
    watch: {
      sideMenuVal: function () {
        if (this.sideMenuVal[0].keyName === 1) {
          if (this.col === 'main-content') {
            this.col = 'Col-main-content'
          } else if (this.col === 'Col-main-content') {
            this.col = 'main-content'
          }
        }
      }
    }
  }
</script>
<style lang='scss'scoped>
  .el-tabs__item {
    color: #fff
  }
  .main-content {
    width: 100% -200px;
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 200px;
    overflow: auto;
    z-index: 0;
    background-color: #eff0f4;
    transition: left .45s cubic-bezier(.23, 1, .32, 1);
    .tabs-content {
      height: 100%;
    }
  }
  .Col-main-content {
    width: 100% -78px;
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 78px;
    overflow: auto;
    z-index: 0;
    background-color: #eff0f4;
    transition: left .45s cubic-bezier(.23, 1, .32, 1);
    .tabs-content {
      height: 100%;
    }
  }
  .layout-footer-center{
    width:100% !important;
    padding: 15px !important;
    font-size: 14px;
    text-align: center;
    bottom:0px;
    right: 0;
    background-color: #eff0f4;
  }
</style>

