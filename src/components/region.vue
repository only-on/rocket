<template>
  <span>
      <Select  style="width:100px;float:left" placeholder="省" @on-change="changeProvice" clearable v-model="pid" :label-in-value="true" >
        <Option v-for='(items, index) in region' :value='items.id' :key="index">{{items.name}}</Option>
      </Select>
      <Select  style="width:100px;float:left" placeholder="市" @on-change="changeCity"  clearable v-model="cid" :label-in-value="true" >
        <Option v-for='(items, index) in regionCity' :value='items.id' :key="index">{{items.name}}</Option>
      </Select>
      <Select  style="width:100px;float:left" placeholder="区县" @on-change="changeCountry"  clearable v-model="did" :label-in-value="true" >
        <Option v-for='(items, index) in regionCountry' :value='items.id' :key="index">{{items.name}}</Option>
      </Select>
  </span>
</template>

<script>
import { getRegion } from '../api/api'
export default {
  props: [
    'regionIds'
  ],
  data () {
    return {
      pid: '',
      cid: '',
      did: '',
      stationId: '',
      param: {},
      regions: [],
      region: [],
      regionCity: [],
      regionCountry: []
    }
  },
  methods: {
    getAllProvice (param) {
      let par = {
        K: 'GET_STATION_COMPONET',
        V: param
      }
      getRegion(par).then((res) => {
        this.region.push(res.data.V.RESULT)
      })
    },
    changeProvice (change) {
      this.regions = []
      this.cid = ''
      this.did = ''
      if (change !== '' && change !== undefined) {
        this.regions[0] = change
        this.pid = change.value
        let par = {
          K: 'GET_STATION_COMPONET',
          V: {
            stationId: this.pid
          }
        }
        getRegion(par).then((res) => {
          if (res.data.V.RESULT instanceof Array) {
            this.regionCity = res.data.V.RESULT
          } else {
            this.regionCity.push(res.data.V.RESULT)
          }
        })
      } else {
        this.regions = []
        this.regionCity = []
      }
      this.$emit('region', this.regions)
    },
    changeCity (change) {
      // console.log(change)
      this.did = ''
      if (change !== '' && change !== undefined) {
        this.regions[1] = change
        this.cid = change.value
        let par = {
          K: 'GET_STATION_COMPONET',
          V: {
            stationId: this.cid
          }
        }
        getRegion(par).then((res) => {
          if (res.data.V.RESULT instanceof Array) {
            this.regionCountry = res.data.V.RESULT
          } else {
            this.regionCountry.push(res.data.V.RESULT)
          }
        })
      } else {
        this.regions.splice(1, 2)
        this.regionCountry = []
      }
      this.$emit('region', this.regions)
    },
    changeCountry (change) {
      if (change !== '' && change !== undefined) {
        this.regions[2] = change
      } else {
        this.regions.splice(2, 1)
      }
      this.$emit('region', this.regions)
    }
  },
  created: function () {
    this.getAllProvice(this.param)
  },
  watch: {
    regionIds: function () {
      this.regions = this.regionIds
      this.pid = this.regionIds[0]
      this.cid = this.regionIds[1]
      this.did = this.regionIds[2]
      // console.log(this.regionIds)
      if (this.pid !== undefined) {
        let parc = {
          K: 'GET_STATION_COMPONET',
          V: {
            stationId: this.pid
          }
        }
        getRegion(parc).then((res) => {
          if (res.data.V.RESULT instanceof Array) {
            this.regionCity = res.data.V.RESULT
          } else {
            this.regionCity.push(res.data.V.RESULT)
          }
        })
      }
      if (this.cid !== undefined) {
        let pard = {
          K: 'GET_STATION_COMPONET',
          V: {
            stationId: this.cid
          }
        }
        getRegion(pard).then((res) => {
          if (res.data.V.RESULT instanceof Array) {
            this.regionCountry = res.data.V.RESULT
          } else {
            this.regionCountry.push(res.data.V.RESULT)
          }
        })
      }
    }
  },
}
</script>

<style scoped>
</style>
