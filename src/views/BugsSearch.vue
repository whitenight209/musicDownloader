<template>
  <div>
      <v-row class="search-area">
        <v-col>
          <v-text-field
            v-on:keyup.enter="bugsSearch"
            class="bugs-input mr-3 d-inline-flex"
            height="30"
            v-model="bugsSearchValue"
            label="노래 이름"
            required
          ></v-text-field>
          <div class="d-inline-flex">
            <v-select
              label="검색 타입"
              class="search-type"
              v-model="bugSearchType"
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
        :items="getSearchedBugsItems.songList"
        :loading="isLoading"
        :items-per-page=50
        hide-default-footer
      >
        <template v-slot:body="{ items }">
          <tbody>
          <tr v-for="item in items" :key="item.key">
            <td height="50px"><img alt="" class="table-image" width="50px" :src="item.albumCoverUrl"/></td>
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
    <div>
      <v-btn v-for="(item, index) in getPagination.pages" :key="index" color="white" small class="pa-0 mr-2" width="25" @click="bugsSearch(item.index)">
        {{item.index}}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mdiYoutube, mdiDatabaseSearch } from '@mdi/js';
import { mapGetters, mapActions } from 'vuex';

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
        { text: '곡명', value: 'TRACK_ONLY' },
        { text: '앨범', value: 'ALBUM_ONLY' },
        { text: '가수', value: 'ARTIST_ONLY' }
      ],
      selectedSearchType: 'ARTIST_TRACK_ALBUM',
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      getBugsSearchParameter: 'getBugsSearchParameter',
      getPagination: 'getPagination',
      getSearchedBugsItems: 'getSearchedBugsItems'
    }),
    bugsSearchValue: {
      get () {
        return this.getBugsSearchParameter.searchValue;
      },
      set (value) {
        this.setBugsSearchValue(value);
      }
    },
    bugSearchType: {
      get () {
        return this.getBugsSearchParameter.searchType;
      },
      set (searchType) {
        this.setBugsSearchType(searchType);
      }
    }
  },
  methods: {
    ...mapActions({
      setBugsSearchValue: 'setBugsSearchValue',
      setBugsSearchType: 'setBugsSearchType',
      searchBugsMusic: 'searchBugsMusic'
    }),
    async bugsSearch (page = 1) {
      this.isLoading = true;
      await this.searchBugsMusic({
        songName: this.bugsSearchValue,
        searchType: this.selectedSearchType,
        page
      });
      console.log(this.getSearchedBugsItems);
      this.isLoading = false;
    },
    async openYoutubeWindow (musicId) {
      console.log(musicId);
      await this.$router.push({ name: 'youtubeSearch', query: { bugsId: musicId } });
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
