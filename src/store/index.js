import Vue from 'vue'
import Vuex from 'vuex'
import {getBugsTop100} from "../util/api";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    top100List: []
  },
  mutations: {
    setTop100List (state, musicList) {
      state.top100List = musicList;
    }
  },
  actions: {
    async getTop100MusicList({commit}) {
        const musicList = await getBugsTop100();
        commit('setTop100List', musicList);
    }
  },
  modules: {
  },
  getters: {
    getTop100(state) {
      return state.top100List;
    }
  }
})
