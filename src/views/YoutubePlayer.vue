<template>
    <div class="about">
        <div>
                        {{musicDetailData.musicDetail.artist}}
                        {{musicDetailData.musicDetail.songName}}
                        {{musicDetailData.musicDetail.duration}}
        </div>
        <div style="width:100%; height:100%">
            <v-btn @click="emit">선택</v-btn>
            <webview id="youtubePlayer" src="https://www.youtube.com/" autosize="on" nodeIntegration></webview>
        </div>
    </div>
</template>
<script>
    import {ipcRenderer} from 'electron';
    import {getMusicDetail} from "@/util/api";

    export default {
        name: 'YoutubePlayer',
        components: {},
        data() {
            return {
                musicData: {},
                musicDetailData: {
                    musicDetail: {
                        artist: '',
                        songName: '',
                        duration: ''
                    }
                }
            }
        },
        created() {
            ipcRenderer.on('2000', async (event, data) => {
                this.musicData = data;
                this.musicDetailData = await getMusicDetail(data.key);
                const webview = document.getElementById('youtubePlayer');
                webview.loadURL(`https://www.youtube.com/results?search_query=${this.musicDetailData.musicDetail.artist}-${this.musicDetailData.musicDetail.songName}`);
                console.log(data)
            });
            ipcRenderer.on('3000', (e, data) => {
                console.log(data);
                alert(data.message);
            })
        },
        mounted() {
            const webview = document.getElementById('youtubePlayer');
            window.onresize = () => {
                webview.style.height = (window.innerHeight - 60) + 'px'
            }
            webview.style.height = (window.innerHeight - 60) + 'px'
            // webview.addEventListener('did-finish-load', (e) => {
            //     console.log(e);
            // });
            webview.addEventListener('did-navigate-in-page', e => {
                console.log(e)
            })
            webview.addEventListener('dom-ready', () => {
                webview.executeJavaScript(`
                  const {ipcRenderer} = require('electron')
                  ipcRenderer.on('set-data', (e, data) => {
                    ipcRenderer.sendToHost('pong')
                    const searchInput = document.querySelector('input.ytd-searchbox');
                    searchInput.value = data;
                    const button = document.querySelector('button#search-icon-legacy');
                    button.click();
                  })
                  const grid = document.querySelectorAll('#contents ytd-rich-item-renderer')
                  grid.forEach( (item, index) => {
                    let button = document.createElement('button');
                    button.innerHTML = '선택'
                    item.appendChild(button);
                  })
                  // const container = document.querySelector('#container');
                  // let button = document.createElement('button');
                  // container.appendChild(button);

                  window.onbeforeunload  = function() {
                    console.log(window.location.href)
                  }
                  document.addEventListener("DOMContentLoaded", function(event) {
                    console.log("DOM fully loaded and parsed");
                  });
                  `
                );
                // webview.openDevTools()
            })
        },
        methods: {
            emit() {
                const webview = document.getElementById('youtubePlayer');
                const regex = new RegExp('https:\\/\\/www.youtube.com\\/watch\\?v=.+');
                const result = regex.exec(webview.getURL());
                if (!result) {
                    alert('youtube video를 선택해주세요.');
                    return;
                }
                this.musicData.youtubeId = webview.getURL().split("=")[1];

                ipcRenderer.send('3000', this.musicData);
            }
        }
    }
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