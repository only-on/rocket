<template>
  <div>
    <MainCont :sideMenuVal="sideMenuVals"></MainCont>
    <Sidemenu @menu="sidemenu"></Sidemenu>
    <Nav></Nav>
  </div>
</template>

<script>
import Nav from '../view/layout/navigation.vue'
import Sidemenu from '../view/layout/slideMenu.vue'
import MainCont from '../view/layout/mainContent.vue'
export default {
  components: {
    Nav,
    Sidemenu,
    MainCont
  },
  data () {
    return {
      sideMenuVals: [],
      sonMenu: {}
    }
  },
  methods: {
    sidemenu (datas) {
      var s = {
        keyName: datas
      }
      this.sonMenu = s
      this.sideMenuVals = [this.sonMenu]
    }
  }
}
</script>

<style scoped>
</style>
