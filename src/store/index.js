import Vue from 'vue';
import Vuex from 'vuex';
import { getBugsTop100, getMusicDetail } from '@/util/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    top100List: [],
    musicDetail: {},
    useTopBar: true,
    downloadPath: undefined
  },
  mutations: {
    setTop100List (state, musicList) {
      state.top100List = musicList;
    },
    setMusicDetail (state, musicDetail) {
      state.musicDetail = musicDetail;
    },
    setTopBar (state, topBarFlag) {
      state.useTopBar = topBarFlag;
    },
    setDownloadPath (state, downloadPath) {
      state.downloadPath = downloadPath;
    }
  },
  actions: {
    async getTop100MusicList ({ commit }) {
      const musicList = await getBugsTop100();
      commit('setTop100List', musicList);
    },
    async getMusicDetail ({ commit }, musicId) {
      const musicDetail = await getMusicDetail(musicId);
      console.log(musicDetail);
      commit('setMusicDetail', musicDetail);
    },
    setTopBarFlag ({ commit }, flag) {
      commit('setTopBar', flag);
    },
    setDownloadPath ({ commit }, downloadPath) {
      commit('setDownloadPath', downloadPath);
    }
  },
  modules: {
  },
  getters: {
    getTop100 (state) {
      return state.top100List;
    },
    getMusicDetail (state) {
      return state.musicDetail;
    },
    useTopBar (state) {
      return state.useTopBar;
    },
    downloadPath (state) {
      return state.downloadPath;
    }
  }
});
