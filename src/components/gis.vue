<template>
  <span>
      <Select  style="width:90px;float:left;text-align: center" placeholder="省" @on-change="changeProvice" clearable v-model="pid" :label-in-value="true" :disabled="dis" @on-clear="clearSelect">
        <Option v-for='(items, index) in region' :value='items.id' :key="index">{{items.name}}</Option>
      </Select>
      <Select  style="width:90px;float:left;text-align: center" placeholder="市" @on-change="changeCity"  clearable v-model="cid" :label-in-value="true" :disabled="dis" @on-clear="clearSelect">
        <Option v-for='(itemsc, index) in regionCity' :value='itemsc.id' :key="index">{{itemsc.name}}</Option>
      </Select>
      <Select  style="width:90px;float:left;text-align: center" placeholder="区县" @on-change="changeCountry"  clearable v-model="did" :label-in-value="true" :disabled="dis" @on-clear="clearSelect">
        <Option v-for='(items, index) in regionCountry' :value='items.id' :key="index">{{items.name}}</Option>
      </Select>
     <Select  style="width:130px;float:left;text-align: center" placeholder="站点" @on-change="changeSite"  clearable v-model="sid" :label-in-value="true" :disabled="dis" @on-clear="clearSelect">
        <Option v-for='(items, index) in site' :value='items.id' :key="index">{{items.name}}</Option>
      </Select>
      <Select  style="width:130px;float:left;text-align: center" placeholder="炮架名称" @on-change="searchLanuch"  clearable v-model="tid" :label-in-value="true" @on-clear="clearSelect">
        <Option v-for='(items, index) in typeList' :value='items.id' :key="index">{{items.name}}</Option>
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
        dis: false,
        pid: '',
        cid: '',
        did: '',
        sid: '',
        tid: '',
        param: {},
        regions: [],
        region: [],
        regionCity: [],
        regionCountry: [],
        site: [],
        typeList: []
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
      clearSelect () {
        this.$emit('region', 'clear')
      },
      getAllProvice (param) {
        this.regions = []
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
        this.regionCountry = []
        this.regionCity = []
        this.site = []
        this.typeList = []
        this.cid = ''
        this.did = ''
        this.sid = ''
        this.tid = ''
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
          // this.$emit('region', 'clear')
        }
        // this.$emit('region', this.regions)
      },
      changeCity (change) {
        this.regionCountry = []
        this.site = []
        this.typeList = []
        this.did = ''
        this.sid = ''
        this.tid = ''
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
          // this.$emit('region', 'clear')
        }
        // this.$emit('region', this.regions)
      },
      changeCountry (change) {
        this.site = []
        this.typeList = []
        this.sid = ''
        this.tid = ''
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
          this.regions.splice(2, 3)
          // this.$emit('region', 'clear')
        }
        // this.$emit('region', this.regions)
      },
      changeSite (change) {
        this.typeList = []
        this.tid = ''
        if (change !== '' && change !== undefined) {
          this.regions[3] = change
          this.sid = change.value
          let par = {
            K: 'GET_STATION_COMPONET',
            V: {
              stationId: this.sid
            }
          }
          getRegion(par).then((res) => {
            if (res.data.R) {
              for (let i = 0; i < res.data.V.RESULT.length; i++) {
                let s = {
                  id: res.data.V.RESULT[i],
                  name: res.data.V.rocketNames[i]
                }
                this.typeList.push(s)
              }
            }
          })
        } else {
          this.typeList = []
          this.regions.splice(3, 2)
          // this.$emit('region', 'clear')
        }
        // this.$emit('region', this.regions)
      },
      searchLanuch (change) {
        // console.log(this.regions)
        if (change !== '' && change !== undefined) {
          this.regions[4] = change
          this.$emit('region', this.regions)
        } else {
          // this.regions[4] = change
        }
        // console.log(this.regions)
      },
      defaultRegion (param) {
        this.region = []
        this.regionCity = []
        this.regionCountry = []
        this.site = []
        this.typeList = []
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
                        sessionStorage.setItem('sid',this.sid)
                      }
                      if (this.sid !== '' && this.sid !== undefined) {
                        let par = {
                          K: 'GET_STATION_COMPONET',
                          V: {
                            stationId: this.sid
                          }
                        }
                        getRegion(par).then((res) => {
                          if (res.data.R) {
                            for (let i = 0; i < res.data.V.RESULT.length; i++) {
                              let s = {
                                id: res.data.V.RESULT[i],
                                name: res.data.V.rocketNames[i]
                              }
                              this.typeList.push(s)
                            }
                          } else {
                            this.typeList = []
                          }
                          // if (this.typeList.length === 1) {
                          //   this.tid = this.typeList[0].name
                          // }
                        })
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
      this.defaultRegion(this.param)
    },
    watch: {
      regionIds: function () {
        // console.log(this.regionIds)
        this.pid = ''
        this.cid = ''
        this.did = ''
        this.sid = ''
        this.tid = ''
        this.regions = []
        this.regionCountry = []
        this.regionCity = []
        this.site = []
        this.typeList = []
        for (let i = 0; i < this.regionIds.length; i++) {
          let s = {
            value: this.regionIds[i]
          }
          this.regions.push(s)
        }
        this.pid = this.regionIds[0]
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
                          if (this.sid !== undefined) {
                            let par3 = {
                              K: 'GET_STATION_COMPONET',
                              V: {
                                stationId: this.sid
                              }
                            }
                            getRegion(par3).then((res) => {
                              this.typeList = []
                              if (res.data.R) {
                                for (let i = 0; i < res.data.V.RESULT.length; i++) {
                                  let s = {
                                    id: res.data.V.RESULT[i],
                                    name: res.data.V.rocketNames[i]
                                  }
                                  this.typeList.push(s)
                                }
                                this.tid = this.regionIds[4]
                              }
                            })
                          } else {
                            this.typeList = []
                          }
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
        this.$emit('region', this.regions)
        // console.log(this.regionIds)
      }
    },
  }
</script>

<style scoped>
</style>
