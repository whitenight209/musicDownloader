import Vue from 'vue';
import Vuex from 'vuex';
import { getBugsTop100, getMusicDetail } from '@/util/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    top100List: [],
    musicDetail: {},
    useAppBar: true,
    downloadPath: undefined,
    useMenu: true
  },
  mutations: {
    setTop100List (state, musicList) {
      state.top100List = musicList;
    },
    setMusicDetail (state, musicDetail) {
      state.musicDetail = musicDetail;
    },
    setAppBar (state, topBarFlag) {
      state.useAppBar = topBarFlag;
    },
    setDownloadPath (state, downloadPath) {
      state.downloadPath = downloadPath;
    },
    setMenuFlag (state, useMenu) {
      state.useMenu = useMenu;
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
    setAppBarFlag ({ commit }, flag) {
      commit('setAppBar', flag);
    },
    setDownloadPath ({ commit }, downloadPath) {
      commit('setDownloadPath', downloadPath);
    },
    setMenuFlag ({ commit }, flag) {
      commit('setMenuFlag', flag);
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
    useAppBar (state) {
      return state.useAppBar;
    },
    downloadPath (state) {
      return state.downloadPath;
    },
    getMenuFlag (state) {
      return state.useMenu;
    }
  }
});
