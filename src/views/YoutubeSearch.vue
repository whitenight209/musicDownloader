<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <template v-if="musicDetail.musicDetail">
      <p>선택된 노래</p>
      <img :src="musicDetail.musicDetail.imgSrc" width="50px"/>
      {{musicDetail.musicDetail.songName}}
      {{musicDetail.musicDetail.artist[0]}}
      {{musicDetail.musicDetail.duration}}
    </template>
<!--    {{musicDetail}}-->
    <v-container>
      <v-row>
        <v-col class="mr-0 pr-0">
          <iframe id="ytplayer" type="text/html" width="640" height="360"
                  :src=youtubeUrl
                  v-if="currentYoutubeId"
                  frameborder="0"></iframe>
        </v-col>
        <v-col class="ml-0 pl-0">
          <v-btn icon v-if="currentYoutubeId" @click="closeYoutubePlayer"><v-icon>{{icons.close}}</v-icon></v-btn>
        </v-col>
      </v-row>
      <v-row >
        <v-col>
          <v-text-field
            v-model="songName"
            label="노래 이름"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn @click="search">search</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="items"
        >
          <template v-slot:body="{ items }">
            <tbody>
            <tr v-for="item in items" :key="item.id">
              <td @click="youtubeItemClick(item.id)">
                <div class="thumbnail">
                  <img class="image" width="70px" :src="item.snippet.thumbnails.high.url"/>
                  <v-icon color="red" class="middle">{{icons.youtube}}</v-icon>
                </div>
              </td>
              <td>{{item.snippet.title}}</td>
              <td>{{item.snippet.publishedAt}}</td>
              <td>{{item.contentDetails.durationStr}}</td>
              <td>
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
import { mapGetters, mapActions } from 'vuex';
import { mdiYoutube, mdiCloseBoxMultiple, mdiDownloadBox } from '@mdi/js';
import { searchYoutube } from '@/util/api';
import Event from '@/Event';
const { ipcRenderer } = window.require('electron');

export default {
  name: 'YoutubeSearch',
  data () {
    return {
      headers: [
        { text: 'Thumbnail', value: 'snippet.title' },
        { text: 'Name', value: 'fat' },
        { text: 'Created', value: 'carbs' },
        { text: 'Duration', value: 'protein' },
        { text: 'Download', value: 'protein' }
      ],
      icons: {
        youtube: mdiYoutube,
        close: mdiCloseBoxMultiple,
        download: mdiDownloadBox
      },
      songName: '',
      items: [],
      pageInfo: {},
      nextPageToken: '',
      prevPageToken: '',
      currentYoutubeId: ''
    };
  },
  computed: {
    ...mapGetters({ musicDetail: 'getMusicDetail' }),
    youtubeUrl () {
      return `https://www.youtube.com/embed/${this.currentYoutubeId}?autoplay=1`;
    }
  },
  methods: {
    ...mapActions({ getMusicDetail: 'getMusicDetail' }),
    async search () {
      console.log(this.songName);
      const youtubeList = await searchYoutube('AIzaSyB73lB6nwGd55DT4LjTikhkIfMluml7fKc', this.songName);
      console.log(youtubeList);
      this.pageInfo = youtubeList.pageInfo;
      this.items = youtubeList.items;
      this.prevPageToken = youtubeList.prevPageToken;
      this.nextPageToken = youtubeList.nextPageToken;
    },
    youtubeItemClick (youtubeId) {
      console.log(youtubeId);
      this.currentYoutubeId = youtubeId;
    },
    closeYoutubePlayer () {
      this.currentYoutubeId = '';
    },
    saveMusic (youtubeId) {
      const musicDetailData = this.musicDetail;
      musicDetailData.musicDetail.youtubeId = youtubeId;
      console.log(this.musicDetailData);
      ipcRenderer.send(Event.EVENT_INSERT_MUSIC, musicDetailData);
    }
  },
  async mounted () {
    const queryParams = this.$route.query;
    if (queryParams.bugsId) {
      await this.getMusicDetail(queryParams.bugsId);
    }
    if (this.musicDetail.musicDetail) {
      this.songName = `${this.musicDetail.musicDetail.songName}`;
    }
  }
};
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
    left: 35%;
    transform: translate(-50%, -50%);
    width: 100%;
    cursor: pointer;
  }
</style>
