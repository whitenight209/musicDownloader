<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <template v-if="musicDetail.musicDetail">
      <p>선택된 노래</p>
      <div class="d-inline-flex">
        <img :src="musicDetail.musicDetail.imgSrc" width="50px"/>
        {{musicDetail.musicDetail.songName}}
        {{musicDetail.musicDetail.artist[0]}}
        {{musicDetail.musicDetail.duration}}
      </div>
    </template>
<!--    {{musicDetail}}-->
    <v-container class="pt-0">
      <v-row v-if="currentYoutubeId">
        <v-col class="mr-0 pr-0">
          <iframe id="ytplayer" type="text/html" width="640" height="360"
                  :src=youtubeUrl
          ></iframe>
        </v-col>
        <v-col class="ml-0 pl-0">
          <v-btn icon v-if="currentYoutubeId" @click="closeYoutubePlayer"><v-icon>{{icons.close}}</v-icon></v-btn>
        </v-col>
      </v-row>
      <v-row  style="height: 50px" >
        <v-col class="pr-0">
          <v-text-field
            class="pt-0"
            v-model="songName"
            label="노래 이름"
            style="font-size: 13px !important;"
            required
          ></v-text-field>
        </v-col>
        <v-col class="pl-1 pt-5">
          <v-btn class="pt-0" small @click="search">search</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <template v-if="loading.isLoading">

        </template>
        <v-data-table
          v-else
          :headers="headers"
          :items="youtubeVideos.items"
          :loading="loading.isLoading"
          :loading-text="loading.loadingText"
        >
          <template v-slot:body="{ items }">
            <tbody>
            <tr v-for="item in items" :key="item.id">
              <td @click="youtubeItemClick(item.id)" style="width: 110px">
                <div class="thumbnail">
                  <img class="image" width="70px" :src="item.snippet.thumbnails.high.url"/>
                  <v-icon color="red" class="middle">{{icons.youtube}}</v-icon>
                </div>
              </td>
              <td class="columnText" style="width: 550px">{{item.snippet.title.substring(0, 80)}}</td>
              <td class="columnText">{{item.snippet.publishedAt.substring(0,10)}}</td>
              <td class="blue--text columnText" v-if="bugsDurationStr === item.contentDetails.durationStr">{{item.contentDetails.durationStr}}</td>
              <td class="columnText" v-else>{{item.contentDetails.durationStr}}</td>
              <td style="width: 50px">
                <v-btn icon @click="saveMusic(item.id)"><v-icon>{{icons.download}}</v-icon></v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { computed, defineComponent, ref, onMounted, reactive } from '@vue/composition-api';
import { mdiYoutube, mdiCloseBoxMultiple, mdiDownloadBox } from '@mdi/js';
import Event from '@/Event';
import { bugsDurationConverter } from '@/util/util';
import { useStore } from '@/store/index';
import { useRouter } from '@/router';
import Logger from '@/Logger';
const { ipcRenderer } = window.require('electron');

export default defineComponent({
  name: 'YoutubeSearch',
  setup () {
    const { state, dispatch } = useStore();
    const router = useRouter();
    const headers = ref([
      { text: 'Thumbnail', value: 'snippet.title' },
      { text: 'Name', value: 'fat' },
      { text: 'Created', value: 'carbs' },
      { text: 'Duration', value: 'protein' },
      { text: 'Download', value: 'protein' }
    ]);
    const icons = ref({
      youtube: mdiYoutube,
      close: mdiCloseBoxMultiple,
      download: mdiDownloadBox
    });
    const loading = reactive({
      isLoading: ref(false),
      loadingText: ref('loading youtube items')
    });
    const songName = ref('');
    let currentYoutubeId = ref('');
    const items = ref([]);
    const pageInfo = ref({});
    const bugsDurationStr = ref('');
    const youtubeUrl = computed(() => {
      return `https://www.youtube.com/embed/${currentYoutubeId.value}?autoplay=1`;
    });
    const musicDetail = computed(() => state.musicDetail);
    const youtubeVideos = computed(() => state.youtubeSearch);
    const config = computed(() => state.config);
    const search = async () => {
      loading.isLoading = true;
      await dispatch('actionYoutubeSearch', { keyword: songName.value });
      loading.isLoading = false;
    };
    const closeYoutubePlayer = () => {
      currentYoutubeId = '';
    };
    const youtubeItemClick = (youtubeId) => {
      console.log(youtubeId);
      currentYoutubeId.value = youtubeId;
    };
    const saveMusic = (youtubeId) => {
      const musicDetailData = musicDetail;
      musicDetailData.value.musicDetail.youtubeId = youtubeId;
      ipcRenderer.send(Event.EVENT_INSERT_MUSIC, musicDetailData.value);
    };
    onMounted(async () => {
      const queryParams = router.currentRoute.query;
      if (queryParams.bugsId) {
        await dispatch('getMusicDetail', queryParams.bugsId);
      }
      console.log(musicDetail);
      if (musicDetail.value.musicDetail) {
        const convertedDuration = bugsDurationConverter(musicDetail.value.musicDetail.duration);
        bugsDurationStr.value = convertedDuration;
        songName.value = `${musicDetail.value.musicDetail.artist[0]}-${musicDetail.value.musicDetail.songName}`;
        console.log(songName);
      }
      ipcRenderer.on(Event.EVENT_INSERT_MUSIC, (e, result) => {
        if (result === Event.SUCCESS) {
          Logger.debug('save Success');
        } else {
          Logger.debug('save Failed');
        }
      });
    });
    return {
      musicDetail,
      config,
      youtubeVideos,
      headers,
      loading,
      icons,
      songName,
      items,
      pageInfo,
      currentYoutubeId,
      bugsDurationStr,
      youtubeUrl,
      search,
      closeYoutubePlayer,
      youtubeItemClick,
      saveMusic
    };
  }
});
</script>

<style scoped>
  .thumbnail {
    position: relative;
    width: 100%;
  }
  .thumbnail:hover .image {
    opacity: 0.2;
  }

  .image {
    display: block;
  }

  .thumbnail:hover .middle {
    opacity: 1;
  }
  .thumbnail .middle {
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    cursor: pointer;
  }
  .columnText {
    font-size: 12px !important;
  }
</style>
