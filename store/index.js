import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
Vue.use(Vuex)

// let apiUrl = "https://api.myjson.com/bins/1cic7m"
let apiUrl = "http://localhost:4567/data"
let apiSampleUrl = "http://localhost:4567/samples"

const store = () => new Vuex.Store({
  state: {
    timelineTitle: "",
    histories: [],
    samples: [],
    currentX: 0,
    currentY: 9,
  },
  getters: {
    timelineTitle: state => state.timelineTitle,
    histories: state => state.histories,
    sampleData: state => state.samples,
    chartData: (state) => {
      return state.histories.filter((row) => { return row.selected })
    },
    peoples: (state) => {
      return state.histories
        .filter((row) => { 
          return (row.category === "people") 
        })
    },
    organizations: (state) => {
      return state.histories
        .filter((row) => {
          return (row.category === "organization")
        })
    },
    eventData: function(state){
      var list = state.histories.filter((row) => { return row.selected }).map(function(row, i){
        return row.events.map(function(event){
          return {
            title: row.title,
            content: event.content,
            top: row.top,
            start: event.start,
            baseIndex: i
          }
        });
      })
      // flatten Array
      return Array.prototype.concat.apply([], list);
    },
    birthData: function(state){
      return state.histories.filter((row) => { return row.selected }).map(function(row){
        return {
          start: row.start,
          birth: row.birth
        };
      });
    },
    deadData: function(state){
      return state.histories.filter((row) => { return row.selected }).map(function(row){
        return row.dead;
      });
    },
    areaStartYear: function(state){
      // 全データにおける歴史開始年の最小値を求める, -10ぶんをマージン
      var v = state.histories.filter((row) => { return row.selected }).map((row) => { return row.start })
      return v.length > 0 ? Math.min.apply(null, v) - 10 : 0
    },
    areaEndYear: function(state){
      // 全データにおける歴史終了年の最大値を求める. +10年ぶんをマージン
      var v = state.histories.filter((row) => { return row.selected }).map((row) => { return row.end })
      return v.length > 0 ?  Math.max.apply(null, v) + 10 : 0
    },
    areaPeriod: function(state, getters) {
      return getters.areaEndYear - getters.areaStartYear;
    }
  },
  mutations: {
    getHistories(state, histories){
      state.histories = histories
    },
    getSamples(state, samples){
      state.samples = samples
    }
  },
  actions: {
    async nuxtServerInit({commit}){

      await Promise.all([axios.get(apiUrl), axios.get(apiSampleUrl)])
        .then(((ret)=>{
          var historyData = ret[0].data.map((row) => { 
            row["selected"] = false
            return row
          })
          commit("getHistories", historyData)

          var sampleData = ret[1].data.map((row) => { 
            row["selected"] = false
            return row
          })
          commit("getSamples", sampleData)

        }))
        .catch((e) => {
          console.dir(e)
        })
    },
    onSelectStateChangedAsync({commit}, people){
      // 1つ目のチェックonでチャートが描画されない問題への対応
      // people.selectedの変更がgetters.chartDataに反映されるまで0.2秒待つ
      return new Promise((resolve) => {
        setTimeout(()=>{
          people.selected = !people.selected
          resolve()
        }, 200)
      })
    },
    onSampleSelectAsync({commit, state}, sample){
      return new Promise((resolve) => {
        setTimeout(()=>{
          sample.peoples.forEach(people => {
            var p = state.histories.find((row) => { return row.title === people })
            p.selected = sample.selected
          });
          sample.organizations.forEach(organization => {
            var p = state.histories.find((row) => { return row.title === organization })
            p.selected = sample.selected
          });

          resolve()
        }, 200)
      })
    }
  }
})

export default store