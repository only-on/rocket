<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='less'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif,MicrosoftYaHei;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #555;
  #mobile6 .order{
    opacity: 0 !important;
  }
  .notice{
    color:red;
    margin-left: 5px;
  }
  .search-title {
    margin: 5px 10px 5px 20px;
    float: left;
    letter-spacing: 5px;
    font-size: 14px;
  }
  .search-title:first-child {
    margin: 5px 10px 5px 0px;
    float: left;
  }
  /*!*菜单背景颜色*!*/
  .ivu-layout-sider {
    background-color: #424f63 !important;
  }
  .sidemenu {
    background-color: #fff !important;
    height: 100vh;
    width: 100%;
    position: fixed;
    left:0;
    top:60px;
  }
  .searchBox{
    border:1px solid #eee;
    border-radius: 16px;
    margin:10px;
    padding:10px 20px;
  }
  .condition{
    font-size: 18px;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover{
    color: #53C79F !important;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
    background-color: #53C79F !important;
  }
  .ivu-menu-dark {
    background-color: #fff !important;
  }
  .ivu-menu {
    z-index: 0 !important;
    background: #fff !important;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title{
    color: #555 !important;
  }
  ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
    background-color: #53C79F !important;
  }
  .ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
    color: #555 !important;
    background-color: #53C79F !important;
  }
  .ivu-menu-submenu-title span>i, .ivu-menu-submenu-title>i {
    margin-right: 6px !important;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
    color: #fff !important;
    background-color: #53C79F !important;
    border-right:2px solid #22976E !important;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title{
    color: #666 !important;
    background-color: #fff !important;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover{
    color: #fff !important;
    background-color: #53C79F !important;
  }
}
.ivu-table .demo-table-info-row td{
  color: #666666;
}
.ivu-table .demo-table-error-row td{
  color: red;
}
.ivu-spin-dot {
  background-color: #53C79F !important;
}
/*时间轴*/
.ivu-timeline-item-head {
  width: 20px !important;
  height: 20px !important;
  border: 1px solid #dcdcdc !important;
}
.ivu-timeline-item-tail {
  border-left: 1px solid #dcdcdc;
  left: 9px;
}
/*按钮*/
.ivu-btn, .ivu-btn:active, .ivu-btn:focus{
  border-color: transparent !important;
  outline: none !important;
  box-shadow: 0 0 0 0 rgba(0,0,0,0);
  border-radius: 5px !important;
  letter-spacing:2px;
}

/*分页位置*/
.pages-block {
  margin: 0px;
  overflow: hidden;
  margin-top: 10px;
  margin-left: 1px;
  margin-bottom: 10px;
  text-align: center;
}
.pages-right {
  vertical-align: middle;
}
/*分页样式*/
.ivu-page-next:hover, .ivu-page-prev:hover {
  border-color: #53C79F !important;
}
.ivu-page-options-elevator input:hover {
  border-color: #53C79F !important;
}
.ivu-page-item-active{
  background-color: #53C79F !important;
  border-color: #53C79F !important;
}
.ivu-page-item:hover {
  border-color: #53C79F !important;
  color: #53C79F !important;
}
.ivu-page-item-active a, .ivu-page-item-active:hover a {
  color: #fff !important;
}
.ivu-select-item-selected, .ivu-select-item-selected:hover {
  color: #fff !important;
}
.ivu-page-next:hover, .ivu-page-prev:hover {
  border-color: #53C79F !important;
}
.ivu-page-options-elevator input:hover {
  border-color: #53C79F !important;
}
.ivu-select-item-selected, .ivu-select-item-selected:hover {
  background-color: #53C79F !important;
  border-color: #53C79F !important;
}

.ivu-select-visible .ivu-select-selection {
  border-color: #53C79F !important;
}
.ivu-page-options-elevator input:focus {
  border-color: #53C79F !important;
}
/*弹框按钮*/
.ivu-btn-primary {
   background-color: #53C79F !important;
   border-color: #53C79F !important;
 }
.ivu-btn-text:hover{
  color: #53C79F !important;
  background: none !important;
}
.ivu-btn-text.active, .ivu-btn-text:active{
  color: #53C79F !important;
}
/*单选按钮*/
.ivu-radio-checked .ivu-radio-inner {
  border-color: #53C79F !important;
}
.ivu-radio-inner:after {
  background-color: #53C79F !important;
}
.ivu-radio-checked:hover .ivu-radio-inner {
  border-color: #53C79F !important;
}
.ivu-input:hover {
  border-color: #53C79F !important;
}
.ivu-select-selection-focused, .ivu-select-selection:hover {
  border-color: #53C79F !important;
}
.ivu-input:focus {
  border-color: #53C79F !important;
}
.ivu-checkbox-checked .ivu-checkbox-inner {
  border-color: #53C79F !important;
  background-color: #53C79F !important;
}
/*下拉框*/
.ivu-select-item-selected.ivu-select-item-focus{
  background-color: #53C79F !important;
}
.ivu-select-options-elevator input:focus{
  border-color: #53C79F !important;
}
/*input数字框*/
.ivu-input-number:hover{
  border-color: #53C79F !important;
}
.ivu-input-number-focused{
  border-color: #53C79F !important;
}
/*级联选择框*/
.ivu-cascader-menu .ivu-cascader-menu-item-active{
  color:#53C79F !important;
}
/*日期选择框*/
.ivu-date-picker-focused input{
  border-color: #53C79F !important;
}
.ivu-date-picker-cells-cell-selected em, .ivu-date-picker-cells-cell-selected:hover em{
  background: #53C79F !important;
}
.ivu-date-picker-cells-focused em{
  box-shadow:0 0 0 1px #53C79F inset !important;
}
.ivu-date-picker-cells-cell-today em:after{
  background: #53C79F !important;
}
/*进度条*/
.ivu-slider-bar{
  background:#53C79F !important;
}
.ivu-slider-button{
  border:2px solid #53C79F !important;
}
.ivu-slider-button-dragging, .ivu-slider-button:focus, .ivu-slider-button:hover{
  border-color:#53C79F !important;
}
/*百度地图搜索下拉框*/
.tangram-suggestion-main {
  z-index: 1000060;
}
/*进度条*/
.ivu-timeline-item-content{
   top:-12px !important;
 }
/*文本域字体*/
textarea.ivu-input{
  font-size: 12px !important;
}
/*百度地图搜索下拉框*/
.tangram-suggestion-main {
  z-index: 1000060;
}
/*自定义按钮样式*/
.btn-list{
  background-color: #53C79F !important;
  color:#fff !important;
  width: 80px ;
  border-radius: 5px !important;
}
.btn-list:hover{
  background-color: #53C79F !important;
  color:#fff !important;
}
/*菜单栏箭头*/
.ivu-menu-vertical .ivu-menu-submenu-title-icon{
  top: -3px !important;
}
/*视频播放按钮*/
.video-js .vjs-big-play-button{
  width: 70px !important;
  height: 70px !important;
  border-radius: 50% !important;
  position: absolute !important;
  left:0 !important;
  right: 0 !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
.sidemenu::-webkit-scrollbar-button{
   display: none;
 }
.ivu-slider-button{
  margin-top: -13px !important;
}
  /*加载遮罩颜色*/
.ivu-spin-fix{
  background: rgba(255,255,255,0.6) !important;
}
</style>
