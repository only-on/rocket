<template>
    <div class="layout">
      <Layout >
        <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" class="sidemenu">

          <Menu theme="dark" width="auto" style="text-align:left"  :class="menuitemClasses" :open-names="[shells === '' ? getCurrentMenu(): shells]" :active-name="stockAlarm === '' ? getCurrentMenu() : stockAlarm" accordion @on-select="clickMenuItems" ref="sideMenu">
           <!--无二级导航-->
            <div style="height: 40px;text-align: center;background:#fff;color: #107250;font-size: 16px;line-height:40px;margin:10px 0 0px 10px">
               <p ref="title" style="float: left">功能菜单</p>
               <Button  @click.native="collapsedSider" type="text" style="float: right;margin-right:10px" class="btn">
                 <span  :class="rotateIcon"  style="color:#22976E;font-size: 20px;margin-top: -2px">☰</span>
               </Button>
            </div>
          <Row v-for="(item,index) in navList" :key="index">
            <MenuItem :name="item.actionUrl" v-if="item.children.length === 0" v-show="!isCollapsed">
              <Icon :type="item.icon"></Icon>
                       <span>{{item.title}}</span>
                     </MenuItem>
              <Submenu :name="item.actionUrl" v-if="item.children.length !== 0" v-show="!isCollapsed">
                <template slot="title">
                  <Icon :type="item.icon"></Icon>
                  {{item.title}}
                </template>
                <MenuItem v-for="(items,indexs) in item.children" :name="items.actionUrl" :key="indexs">{{items.title}}</MenuItem>
              </Submenu>
              <MenuItem :name="item.actionUrl"  v-show="isCollapsed">
                <Icon :type="item.icon"></Icon>
                <!--<span>{{index}}</span>-->
              </MenuItem>
           </Row>
          </Menu>
        </Sider>

      </Layout>
    </div>
  <!--</div>-->
</template>

<script>
  import store from '../../store/store'
  import * as types from '../../store/types'
  import mapState from 'vuex'
  export default {
    data () {
      return {
        sidemenu: '',
        height: '',
        shells: '',
        stockAlarm: '',
        num: 0,
        cs: '',
        aaa: 'mall_index',
        isCollapsed: false,
        flag:false,
        navList:[],
        number: '',
        btn: ''
      }
    },
    computed: {
      rotateIcon () {
        return [
          'menu-icon',
          this.isCollapsed ? '' : ''
        ];
      },
      menuitemClasses () {
        return [
          'menu-item',
          'submenu',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    },
    created () {
      // console.log(this.open)
      this.navList = JSON.parse(store.state.menu)
      this.clickMenuItems()
      this.$nextTick(() => {
        this.btn = document.querySelector('.btn')
      })
    },
    methods: {
      collapsedSider () {
        this.$emit('menu', 1)
        this.$refs.side1.toggleCollapse();
        if(!this.flag){
          this.$refs.title.innerHTML=""
          this.btn.innerHTML='<p  style="float: left;color:#22976E;font-size: 20px;margin-top: -2px">☰</p>'
          this.flag=true
        } else {
          this.$refs.title.innerHTML='<p ref="title" style="float: left">功能菜单</p>'
          this.flag=false
        }
      },
      clickMenuItems (key) {
        if (key === 'person') {
          this.cs = 'background'
        } else {
          this.cs = 'background1'
        }
        // key = key.indexOf('/') === 0 ? key : '/' + key
        this.$router.push({ path: key })
      },
      getCurrentMenu () {
        let path = this.$route.path
        path = (path === '/home') ? '/distribution' : path
        path = path.indexOf('/') === 0 ? path.substr(1) : path
        this.clickMenuItems(path)
        return path
      }
    },
    watch: {
      '$route.path':function(newVal,oldVal) {
        if (newVal === '/stockAlarm') {
          this.stockAlarm = 'stockAlarm'
          this.shells = 'shells'
        } else {
          this.stockAlarm = ''
          this.shells = ''
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.sidemenu = document.querySelector('.sidemenu')
        // if (this.height < 500) {
        //   this.sidemenu.style.overflowY = 'scroll'
        // } else {
        //   this.sidemenu.style.overflow = 'hidden'
        // }
      })
      window.onresize = function windowResize () {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        this.height = window.innerHeight
      }
    },
  }
</script>

<style lang='scss'>
  .layout{
    background: #f5f7f9;
    position: relative;
    /*overflow: hidden;*/
  }
  .layout-logo{
    font-size: 17px;
    letter-spacing: 3px;
    color: yellow;
    float: left;
    position: relative;
    left: 20px;
    height: 30px;
  }
  .layout-nav{
    float: right;
    margin: 0 auto;
    margin-right: 20px;
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }
  .menu-icon{
    transition: all .3s;
  }
  .rotate-icon{
    transform: rotate(-90deg);
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle !important;
    font-size: 16px;
    margin-top: 5px;
  }
  .collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle !important;
    font-size: 22px;
  }
  .ivu-menu-horizontal {
    height: 0px !important;
  }
  .ivu-btn-text:active{
    outline: none !important;
  }
  .ivu-btn-text:focus{
    box-shadow: none !important;
  }
  .background {
    background:#5b6270;
  }
  .background1 {
    background: transparent ;
  }
</style>
