import Vue from 'vue';
import Vuex from 'vuex';
import { getBugsTop100, getMusicDetail, searchBugsSong } from '@/util/api';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    notifications: [],
    top100List: [],
    musicDetail: {},
    useAppBar: false,
    downloadPath: undefined,
    useMenu: true,
    config: {},
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
    processList: []
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
      const findByMusicId = process => process.id === processUpdate.id;
      const index = state.processList.findIndex(findByMusicId);
      console.log(state.processList);
      console.log(processUpdate);
      console.log(index);
      if (index >= 0) {
        console.log('update process');
        if (processUpdate.progress === 100) {
          console.log('process 100%');
          state.processList = state.processList.filter(process => process.id !== processUpdate.id);
        } else {
          console.log(processUpdate.progress);
          console.log('update process id ' + index);
          const newState = { ...state.processList[index], progress: processUpdate.progress };
          console.log(state.processList[index]);
          Vue.set(state.processList, index, newState);
        }
      } else {
        console.log('push process');
        state.processList.push(processUpdate);
      }
      // console.log(processUpdate);
      // console.log('-------');
      // console.log(state.processList);
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
    }
  },
  actions: {
    async getTop100MusicList ({ commit }) {
      const musicList = await getBugsTop100();
      commit('setTop100List', musicList);
    },
    async searchBugsMusic ({ state, commit }, { value, option, page = 1 }) {
      const musicList = await searchBugsSong(value, option, page);
      commit('setBugsSearchResult', musicList);
      throw new Error('this is error');
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
    getProcessList (state) {
      return state.processList;
    }
  }
});
