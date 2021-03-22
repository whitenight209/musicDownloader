import Vue from 'vue';
import Vuex from 'vuex';
import { getBugsTop100, getMusicDetail, searchBugsSong, searchYoutube } from '@/util/api';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    notifications: [],
    top100List: [],
    musicDetail: {},
    useAppBar: false,
    downloadPath: undefined,
    useMenu: true,
    config: {
      youtubeApiKey: ''
    },
    appBar: [],
    bugsSearchItems: {
      searchParameters: {
        searchType: 'ARTIST_TRACK_ALBUM',
        searchValue: ''
      },
      items: {
        songList: [],
        pageList: {
          pages: [],
          currentPage: 1,
          startIndex: 1,
          pageOffset: 10
        }
      }
    },
    youtubeSearch: {

    },
    processList: [],
    storedMusicList: []
  },
  mutations: {
    setBugsSearchResult (state, musicList) {
      state.bugsSearchItems.items.songList = musicList.songList;
      state.bugsSearchItems.items.pageList.pages = musicList.pageList;
    },
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
    },
    setBugsSearchParameter (state, parameters) {
      state.bugsSearchItems.searchParameters = parameters;
    },
    setBugsSearchValue (state, value) {
      state.bugsSearchItems.searchParameters.searchValue = value;
    },
    setBugsSearchType (state, searchType) {
      state.bugsSearchItems.searchParameters.searchType = searchType;
    },
    updateProcess (state, processUpdate) {
      const { musicId, percentage } = processUpdate;
      const findByMusicId = process => process.id === musicId;
      const index = state.storedMusicList.findIndex(findByMusicId);
      console.log(processUpdate);
      console.log(index);
      if (index >= 0) {
        const newItem = Object.assign({}, state.storedMusicList[index]);
        newItem.percentage = percentage;
        Vue.set(state.storedMusicList, index, newItem);
      }
    },
    addMusicDownload (state, musicItem) {
      const findByMusicId = process => process.id === musicItem.id;
      const index = state.processList.findIndex(findByMusicId);
      if (index < 0) {
        state.processList.push(musicItem);
      }
    },
    addMusicDownloads (state, musicItems) {
      state.processList.push(...musicItems);
    },
    setStoredMusicList (state, data) {
      state.storedMusicList = data.musicList;
    },
    setYoutubeSearch (state, data) {
      state.youtubeSearch = data;
    }
  },
  actions: {
    async getTop100MusicList ({ commit }) {
      const musicList = await getBugsTop100();
      commit('setTop100List', musicList);
    },
    async searchBugsMusic ({ state, commit }, { songName, searchType, page = 1 }) {
      const musicList = await searchBugsSong(songName, searchType, page);
      commit('setBugsSearchResult', musicList);
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
    },
    setBugsSearchParameter ({ commit }, parameters) {
      commit('setBugsSearchParameter', parameters);
    },
    setBugsSearchValue ({ commit }, value) {
      commit('setBugsSearchValue', value);
    },
    setBugsSearchType ({ commit }, searchType) {
      commit('setBugsSearchType', searchType);
    },
    addNotification ({ commit }, notification) {
      const timeOut = setTimeout(() => {
        commit('disMissNotification', notification);
      });
      commit('addNotification', { raw: notification, timeOut });
    },
    updateProcess ({ commit }, process) {
      commit('updateProcess', process);
    },
    addDownload ({ commit }, musicItem) {
      commit('addMusicDownload', musicItem);
    },
    addDownloads ({ commit }, musicItems) {
      commit('addMusicDownloads', musicItems);
    },
    setStoredMusicList ({ commit }, data) {
      commit('setStoredMusicList', data);
    },
    async actionYoutubeSearch ({ commit, state }, { keyword }) {
      const youtubeSearchResult = await searchYoutube(state.config.youtubeApiKey, keyword);
      commit('setYoutubeSearch', youtubeSearchResult);
    }
  },
  modules: {
  },
  getters: {
    getSearchedBugsItems (state) {
      return state.bugsSearchItems.items;
    },
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
    },
    getBugsSearchParameter (state) {
      return state.bugsSearchItems.searchParameters;
    },
    getPagination (state) {
      return state.bugsSearchItems.items.pageList;
    },
    getNotifications (state) {
      return state.notifications.map(n => n.row);
    },
    processList (state) {
      return state.processList;
    },
    getStoredMusicList (state) {
      return state.storedMusicList;
    },
    getYoutubeSearch (state) {
      return state.youtubeSearch;
    }
  }
});
