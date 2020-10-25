import Vue from 'vue';
import Vuex from 'vuex';
import { getBugsTop100, getMusicDetail } from '@/util/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    top100List: [],
    musicDetail: {},
    useAppBar: false,
    downloadPath: undefined,
    useMenu: true,
    config: {},
    appBar: []
  },
  mutations: {
    setTop100List (state, musicList) {
      state.top100List = musicList;
    },
    setMusicDetail (state, musicDetail) {
      state.musicDetail = musicDetail;
    },
    setAppBarFlag (state, topBarFlag) {
      state.useAppBar = topBarFlag;
    },
    setDownloadPath (state, downloadPath) {
      state.downloadPath = downloadPath;
    },
    setMenuFlag (state, useMenu) {
      state.useMenu = useMenu;
    },
    setConfig (state, config) {
      state.config = config;
    },
    setAppBar (state, appBarList) {
      state.appBar = appBarList;
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
      commit('setAppBarFlag', flag);
    },
    setDownloadPath ({ commit }, downloadPath) {
      commit('setDownloadPath', downloadPath);
    },
    setMenuFlag ({ commit }, flag) {
      commit('setMenuFlag', flag);
    },
    setConfig ({ commit }, config) {
      commit('setConfig', config);
    },
    setAppBar ({ commit }, appBar) {
      commit('setAppBar', appBar);
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
    useAppBarFlag (state) {
      return state.useAppBar;
    },
    downloadPath (state) {
      return state.downloadPath;
    },
    getMenuFlag (state) {
      return state.useMenu;
    },
    getConfig (state) {
      return state.config;
    },
    getAppBar (state) {
      return state.appBar;
    }
  }
});
