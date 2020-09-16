<template>
  <div class="about">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red lighten-2"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Click Me
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
          Privacy Policy
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <v-card>
        <v-card-title>노래 정보</v-card-title>
        <v-card-text>
            <img class="d-inline-block" :src="musicDetailData.musicDetail.imgSrc" height="60px"/>
            <div class="d-inline-block">
              <div>
                <p class="d-inline-block">{{musicDetailData.musicDetail.songName}}</p>
                <p class="d-inline-block">{{musicDetailData.musicDetail.duration}}</p>
              </div>
              <p>{{musicDetailData.musicDetail.artist[0]}}</p>
            </div>
            <div class="d-inline-block">
              <v-btn @click="saveMusic">선택</v-btn>
              <v-btn @click="saveMusicManual">youtube 따로 저장</v-btn>
            </div>
        </v-card-text>

      </v-card>
    </div>
    <div>
      <!--            <range-slider/>-->
    </div>
    <div style="width:100%; height:100%">
      <webview id="youtubePlayer" :src="youtubeUrl" autosize="on" nodeIntegration></webview>
    </div>
  </div>
</template>
<script>

// import { getMusicDetail } from '@/util/api';
import { mapActions } from 'vuex';
import Events from '@/Event';
import { getMusicDetail } from '@/util/api';
import { sleep } from '@/util/util';
// import Logger from '@/Logger';
const { ipcRenderer } = window.require('electron');

export default {
  name: 'YoutubePlayer',
  components: {},
  data () {
    return {
      youtubeUrl: 'https://www.youtube.com',
      musicData: {},
      dialog: false,
      musicDetailData: {
        musicDetail: {
          artist: '',
          songName: '',
          duration: '',
          musicId: ''
        }
      }
    };
  },
  created () {
    ipcRenderer.on(Events.EVENT_SET_MUSIC_DETAIL, async (event, musicId) => {
      const musicData = await getMusicDetail(musicId);
      this.musicDetailData = musicData;
      const webview = document.getElementById('youtubePlayer');
      await webview.stop();
      while (webview.isLoading()) {
        await sleep(200);
      }
      console.log('loading finished');
      console.log(this.musicDetailData);
      webview.loadURL(
        `https://www.youtube.com/results?search_query=
        ${this.musicDetailData.musicDetail.artist}-${this.musicDetailData.musicDetail.songName}`).then(res => console.log(res));
    });
  },
  mounted () {
    const webview = document.getElementById('youtubePlayer');
    window.onresize = () => {
      webview.style.height = (window.innerHeight - 235) + 'px';
    };
    webview.style.height = (window.innerHeight - 235) + 'px';
  },
  methods: {
    ...mapActions({ setAppBarFlag: 'setAppBarFlag' }),
    saveMusic () {
      const webview = document.getElementById('youtubePlayer');
      const regex = new RegExp('https:\\/\\/www.youtube.com\\/watch\\?v=.+');
      const result = regex.exec(webview.getURL());
      if (!result) {
        alert('youtube video를 선택해주세요.');
        return;
      }
      this.musicDetailData.musicDetail.youtubeId = webview.getURL().split('=')[1];
      console.log(this.musicDetailData);
      ipcRenderer.send(Events.EVENT_INSERT_MUSIC, this.musicDetailData);
    },
    saveMusicManual () {
      this.dialog = true;
    }
  }
};
</script>
<style>
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>
<!--
유투브 search input = document.querySelector('input.ytd-searchbox');
     search button = document.querySelector('button#search-icon-legacy');

     grid = document.querySelectorAll('#contents ytd-rich-item-renderer')
-->
