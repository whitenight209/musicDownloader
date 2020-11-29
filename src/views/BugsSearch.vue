<template>
  <div>
      <v-row class="search-area">
        <v-col>
          <v-text-field
            v-on:keyup.enter="bugsSearch"
            class="bugs-input mr-3 d-inline-flex"
            height="30"
            v-model="songName"
            label="노래 이름"
            required
          ></v-text-field>
          <div class="d-inline-flex">
            <v-select
              label="검색 타입"
              class="search-type"
              v-model="selectedSearchType"
              :items="searchType"
              item-text="text"
              item-value="value"
            />
          </div>
          <v-btn icon class="ml-2 d-inline-block" height="30px" @click="bugsSearch">
            <v-icon large>{{icons.databaseSearch}}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="items.songList"
        :loading="isLoading"
        items-per-page="50"
        hide-default-footer
      >
        <template v-slot:body="{ items }">
          <tbody>
          <tr v-for="item in items" :key="item.key">
            <td height="50px"><img class="table-image" width="50px" :src="item.albumCoverUrl"/></td>
            <td class="table-text">{{item.songName}}</td>
            <td class="table-text">{{item.artistName}}</td>
            <td class="table-text">{{item.albumName}}</td>
            <td>
              <v-btn icon @click="openYoutubeWindow(item.key)" small color="primary">
                <v-icon large>{{icons.mdiYoutube}}</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-data-table>
  </div>
</template>

<script>
import { searchBugsSong } from '@/util/api';
import { mdiYoutube, mdiDatabaseSearch } from '@mdi/js';

export default {
  name: 'BugsSearch',
  data () {
    return {
      songName: '',
      headers: [
        { text: '', value: '' },
        { text: '노래', value: 'songName' },
        { text: '가수', value: 'artistName' },
        { text: '앨범', value: 'albumName' },
        { text: '', value: '' }
      ],
      items: {
        songList: [],
        pageList: []
      },
      pagination: {
        selectedPage: 1,
        startIndex: 1,
        pageOffset: 10
      },
      icons: {
        mdiYoutube: mdiYoutube,
        databaseSearch: mdiDatabaseSearch
      },
      searchType: [
        { text: '전체', value: 'ARTIST_TRACK_ALBUM' },
        { text: '앨범', value: 'ALBUM_ONLY' },
        { text: '가수', value: 'ARTIST_ONLY' }
      ],
      selectedSearchType: 'ARTIST_TRACK_ALBUM',
      isLoading: false
    };
  },
  methods: {
    async bugsSearch () {
      this.isLoading = true;
      const items = await searchBugsSong(this.songName, this.selectedSearchType);
      this.items = items;
      const selectedPage = items.pageList.filter(page => page.isSelected)[0];
      const startIndex = items.pageList[0];
      const pageOffset = items.pageList.length;
      this.pagination = { selectedPage, startIndex, pageOffset };
      this.isLoading = false;
    },
    async openYoutubeWindow (musicId) {
      console.log(musicId);
      await this.$router.push({ name: 'youtubeSearch', query: { bugsId: musicId } });
      // console.log(this.musicDetail);
      // ipcRenderer.send(Events.EVENT_OPEN_YOUTUBE_WINDOW, musicId);
    }
  }
};
</script>

<style scoped>
  .bugs-input {
    font-size: 13px;
    width: 300px;
  }
  .search-area {
    height: 60px;
  }
  .search-type {
    width: 100px;
  }
  .table-text {
    font-size: 12px !important;
  }
  .table-image {
    border-radius: 50%;
    border: 1px solid black;
  }
</style>
