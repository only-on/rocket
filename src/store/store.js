import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    menu: localStorage.getItem('menu'),
    remember: localStorage.getItem('remember'),
    alarmNum: sessionStorage.getItem('alarmNum'),
    station: sessionStorage.getItem('station')
  },
  mutations: {
    [types.MENU]: (state, data) => {
      // console.log(data)
      localStorage.menu = data
      state.menu = data
    },
    [types.Rem]: (state, data) => {
      // console.log(data)
      localStorage.remember = data
      state.remember = data
    },
    [types.Num]: (state, data) => {
      // console.log(data)
      sessionStorage.alarmNum = data
      state.alarmNum = data
    },
    [types.Station]: (state, data) => {
      // console.log(data)
      sessionStorage.station = data
      state.station = data
    }
  }
})

export default store
