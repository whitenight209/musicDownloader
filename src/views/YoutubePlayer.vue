<template>
  <div class="about">
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
    this.setTopBarFlag(false);
    const webview = document.getElementById('youtubePlayer');
    window.onresize = () => {
      webview.style.height = (window.innerHeight - 235) + 'px';
    };
    webview.style.height = (window.innerHeight - 235) + 'px';
    // webview.addEventListener('did-finish-load', (e) => {
    //     console.log(e);
    // });
    // webview.addEventListener('did-navigate-in-page', e => {
    //   console.log(e.url);
    // webview.executeJavaScript(
    //     `
    //     if(!testButton) {
    //         let testButton = document.createElement('button');
    //         testButton.innerHTML = '박철호'
    //     }
    //     if(!container) {
    //         const container = document.querySelector('#container');
    //     }
    //     container.appendChild(testButton);
    //     `
    // )
    // });
    // webview.addEventListener('dom-ready', () => {
    //   webview.executeJavaScript(`
    //               const {ipcRenderer} = require('electron')
    //               ipcRenderer.on('set-data', (e, data) => {
    //                 ipcRenderer.sendToHost('pong')
    //                 const searchInput = document.querySelector('input.ytd-searchbox');
    //                 searchInput.value = data;
    //                 const button = document.querySelector('button#search-icon-legacy');
    //                 button.click();
    //               })
    //               const grid = document.querySelectorAll('#contents ytd-rich-item-renderer')
    //               grid.forEach( (item, index) => {
    //                 let button = document.createElement('button');
    //                 button.innerHTML = '선택'
    //                 item.appendChild(button);
    //               })
    //               // const container = document.querySelector('#container');
    //               // let button = document.createElement('button');
    //               // container.appendChild(button);
    //
    //               window.onbeforeunload  = function() {
    //                 console.log(window.location.href)
    //               }
    //               document.addEventListener("DOMContentLoaded", function(event) {
    //                 console.log("DOM fully loaded and parsed");
    //               });
    //               `
    //   );
    // const isDevelopment = process.env.NODE_ENV !== 'production';
    // if (isDevelopment) {
    //   webview.openDevTools();
    // }
    // });
  },
  methods: {
    ...mapActions({ setTopBarFlag: 'setTopBarFlag' }),
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
