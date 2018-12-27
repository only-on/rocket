<template>
  <span>
      <Select  style="width:135px;float:left" placeholder="类型" @on-change="changeType"  v-model="type" :label-in-value="true" clearable :disabled="dis">
        <Option v-for='(items, index) in typeList' :value='items.type' :key="index">{{items.name}}</Option>
      </Select>
      <Select  style="width:135px;float:left" placeholder="型号" @on-change="changeProduct"  v-model="mode" :label-in-value="true" clearable :disabled="dis">
        <Option v-for='(items, index) in modeList' :value='items.id' :key="index">{{items.name}}</Option>
      </Select>
  </span>
</template>

<script>
import { shells, shellsStock } from '../api/api'
export default {
  props: [
    'modes'
  ],
  data () {
    return {
      dis: false,
      type: '',
      mode: '',
      param: {
        K: 'GET_ALL_PRODUCT',
        V: {}
      },
      typeList: [],
      modeList: []
    }
  },
  methods: {
    getAllType () {
      let par = {
        K: 'GET_PRODUCT_TYPE',
        V: {}
      }
      shells(par).then((res) => {
        if (res.data.R) {
          this.typeList = res.data.V.RESULT
        } else {
          this.typeList = []
        }
      })
    },
    getAllMode (param) {
      shellsStock(this.param).then((res) => {
        if (res.data.R) {
          for(var mode of res.data.V.RESULT) {
            if (mode.type === param) {
              this.modeList.push(mode)
            }
          }
        } else {
          this.modeList = []
        }
      })
    },
    changeType (change) {
      // console.log(change)
      this.mode = ''
      this.modeList = []
      this.getAllMode(this.type)
      this.$emit('shells', [this.type])
    },
    changeProduct (change) {
      // console.log(change)
      this.$emit('shells', [this.type,this.mode])
    }
  },
  created: function () {
    this.getAllType()
    this.getAllMode(this.type)
  },
  watch: {
    modes: function () {
      this.type = this.modes[0]
      this.getAllMode(this.type)
      this. mode = this.modes[1]
      if(this.modes[2] !== undefined) {
        this.dis = this.modes[2]
      } else {
        this.dis = false
      }
    }
  },
}
</script>

<style scoped>
</style>
