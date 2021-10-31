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
            <v-icon large>{{icons.mdiDatabaseSearch}}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <div style="margin-top: 30px">
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
      </div>
    <div class="text-center">
      <v-btn v-for="(item, index) in getPagination.pages" :key="index" color="white" small class="pa-0 mr-2" width="25" @click="bugsSearch(item.index)">
        {{item.index}}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mdiYoutube, mdiDatabaseSearch } from '@mdi/js';
import { ref, defineComponent, computed } from '@vue/composition-api';
import { useStore } from '@/store/index';
import { useRouter } from '@/router/index';

export default defineComponent({
  name: 'BugsSearch',
  setup () {
    const { dispatch, getters } = useStore();
    const router = useRouter();
    const songName = ref('');
    const headers = ref();
    const pagination = ref({
      selectedPage: 1,
      startIndex: 1,
      pageOffset: 10
    });
    const icons = ref({
      mdiYoutube,
      mdiDatabaseSearch
    });
    const searchType = ref([
      { text: '곡명', value: 'TRACK_ONLY' },
      { text: '앨범', value: 'ALBUM_ONLY' },
      { text: '가수', value: 'ARTIST_ONLY' }
    ]);
    let isLoading = ref(false);
    const bugsSearchValue = computed({
      get () {
        return getters.getBugsSearchParameter.searchValue;
      },
      set (value) {
        dispatch('setBugsSearchValue', value);
      }
    });
    const bugSearchType = computed({
      get () {
        return getters.getBugsSearchParameter.searchType;
      },
      set (value) {
        dispatch('setBugsSearchType', value);
      }
    });
    const getSearchedBugsItems = getters.getSearchedBugsItems;
    const bugsSearch = async (page = 1) => {
      isLoading = true;
      await dispatch('searchBugsMusic', {
        songName: bugsSearchValue.value,
        searchType: bugSearchType.value,
        page
      });
      isLoading = false;
    };
    const openYoutubeWindow = async (musicId) => {
      await router.push({ name: 'youtubeSearch', query: { bugsId: musicId } });
    };
    return {
      songName,
      headers,
      pagination,
      icons,
      searchType,
      isLoading,
      bugsSearchValue,
      bugSearchType,
      getSearchedBugsItems,
      getPagination: getters.getPagination,
      bugsSearch,
      openYoutubeWindow
    };
  }
});
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
