<template>
  <span>
      <Select  style="width:90px;float:left" placeholder="省" @on-change="changeProvice" clearable v-model="pid" :label-in-value="true" :disabled="dis">
        <Option v-for='(items, index) in region' :value='items.id' :key="index">{{items.name}}</Option>
      </Select>
      <Select  style="width:90px;float:left" placeholder="市" @on-change="changeCity"  clearable v-model="cid" :label-in-value="true" :disabled="dis">
        <Option v-for='(items, index) in regionCity' :value='items.id' :key="index">{{items.name}}</Option>
      </Select>
      <Select  style="width:90px;float:left" placeholder="区县" @on-change="changeCountry"  clearable v-model="did" :label-in-value="true" :disabled="dis">
        <Option v-for='(items, index) in regionCountry' :value='items.id' :key="index">{{items.name}}</Option>
      </Select>
     <Select  style="width:130px;float:left" placeholder="站点" @on-change="changeSite"  :clearable="clearable" v-model="sid" :label-in-value="true" :disabled="dis">
        <Option v-for='(items, index) in site' :value='items.id' :key="index">{{items.name}}</Option>
      </Select>
  </span>
</template>

<script>
  import { getRegion } from '../api/api'
  import store from '../store/store'
  export default {
    props: [
      'regionIds'
    ],
    data () {
      return {
        clearable: true,
        dis: false,
        pid: '',
        cid: '',
        did: '',
        sid: '',
        param: {},
        regions: [],
        region: [],
        regionCity: [],
        regionCountry: [],
        site: []
      }
    },
    methods: {
      // getCountry () {
      //   this.param.parentId = this.cid
      //   this.param.regionType = 3
      //   getRegion(this.param).then((res) => {
      //     this.regionCountry = res.data.content
      //   })
      // },
      getAllProvice (param) {
        this.region = []
        this.regions = []
        this.regionCity = []
        this.regionCountry = []
        this.site = []
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
        this.regionCity = []
        this.regionCountry = []
        this.site = []
        this.cid = ''
        this.did = ''
        this.sid = ''
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
        this.regionCountry = []
        this.site = []
        this.did = ''
        this.sid = ''
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
          this.regions.splice(1, 3)
          this.regionCountry = []
        }
        this.$emit('region', this.regions)
      },
      changeCountry (change) {
        this.site = []
        this.did = ''
        this.sid = ''
        this.site = []
        if (change !== '' && change !== undefined) {
          this.regions[2] = change
          this.did = change.value
          let par = {
            K: 'GET_STATION_COMPONET',
            V: {
              stationId: this.did
            }
          }
          getRegion(par).then((res) => {
            if (res.data.V.RESULT instanceof  Array) {
              this.site = res.data.V.RESULT
            } else {
              this.site.push(res.data.V.RESULT)
            }
          })
        } else {
          this.site = []
          this.regions.splice(2, 2)
        }
        this.$emit('region', this.regions)
      },
      changeSite (change) {
        if (change !== '' && change !== undefined) {
          this.regions[3] = change
        } else {
          this.regions.splice(3, 1)
        }
        this.$emit('region', this.regions)
      },
      defaultRegion (param) {
        this.region = []
        this.regionCity = []
        this.regionCountry = []
        this.site = []
        let par = {
          K: 'GET_STATION_COMPONET',
          V: param
        }
        getRegion(par).then((res) => {
          this.region.push(res.data.V.RESULT)
          this.pid = res.data.V.RESULT.id
          if (this.pid !== undefined && this.pid !== '') {
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
              if (this.regionCity.length === 1) {
                this.cid = this.regionCity[0].id
              }
              if (this.cid !== undefined && this.cid !== '') {
                let par1 = {
                  K: 'GET_STATION_COMPONET',
                  V: {
                    stationId: this.cid
                  }
                }
                getRegion(par1).then((res) => {
                  if (res.data.V.RESULT instanceof Array) {
                    this.regionCountry = res.data.V.RESULT
                  } else {
                    this.regionCountry.push(res.data.V.RESULT)
                  }
                  if (this.regionCountry.length === 1) {
                    this.did = this.regionCountry[0].id
                  }
                  if (this.did !== undefined && this.did !== '') {
                    let par2 = {
                      K: 'GET_STATION_COMPONET',
                      V: {
                        stationId: this.did
                      }
                    }
                    getRegion(par2).then((res) => {
                      if (res.data.V.RESULT instanceof  Array) {
                        this.site = res.data.V.RESULT
                      } else {
                        this.site.push(res.data.V.RESULT)
                      }
                      if (this.site.length === 1) {
                        this.sid = this.site[0].id
                      }
                    })
                  } else {
                    this.site = []
                  }
                })
              } else {
                this.regionCountry = []
              }
            })
          } else {
            this.regionCity = []
          }
        })

      }
    },
    created: function () {
      if (store.state.station.length > 6) {
        this.clearable = false
      } else {
        this.clearable = true
      }
      // this.getAllProvice(this.param)
      this.defaultRegion(this.param)
    },
    watch: {
      regionIds: function () {
        this.regions = []
        this.regionCountry = []
        this.regionCity = []
        this.site = []
        this.pid = ''
        this.cid = ''
        this.did = ''
        this.sid = ''
          for (let i = 0; i < this.regionIds.length; i++) {
            let s = {
              value: this.regionIds[i]
            }
            this.regions.push(s)
          }
          this.pid = this.regionIds[0]
         if(this.regionIds.length > 4) {
           this.dis = this.regionIds[4]
         } else {
           this.dis = false
         }
        if (this.pid !== undefined) {
          let par = {
            K: 'GET_STATION_COMPONET',
            V: {
              stationId: this.pid
            }
          }
          getRegion(par).then((res) => {
            if (res.data.R) {
              if (res.data.V.RESULT instanceof Array) {
                this.regionCity = res.data.V.RESULT
              } else {
                this.regionCity.push(res.data.V.RESULT)
              }
              this.cid = this.regionIds[1]
              if (this.cid !== undefined) {
                let par1 = {
                  K: 'GET_STATION_COMPONET',
                  V: {
                    stationId: this.cid
                  }
                }
                getRegion(par1).then((res) => {
                  if (res.data.R) {
                    if (res.data.V.RESULT instanceof Array) {
                      this.regionCountry = res.data.V.RESULT
                    } else {
                      this.regionCountry.push(res.data.V.RESULT)
                    }
                    this.did = this.regionIds[2]
                    if (this.did !== undefined) {
                      let par2 = {
                        K: 'GET_STATION_COMPONET',
                        V: {
                          stationId: this.did
                        }
                      }
                      getRegion(par2).then((res) => {
                        if (res.data.R) {
                          if (res.data.V.RESULT instanceof  Array) {
                            this.site = res.data.V.RESULT
                          } else {
                            this.site.push(res.data.V.RESULT)
                          }
                          this.sid = this.regionIds[3]
                        }
                      })
                    } else {
                      this.site = []
                    }
                  }
                })
              } else {
                this.regionCountry = []
              }
            }
          })
        } else {
          this.regionCity = []
        }
        // this.getCounty(this.pid)
      }
    },
  }
</script>

<style scoped>
</style>
