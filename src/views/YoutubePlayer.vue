<template>
    <div class="about">
        <div style="width:100%; height:100%">
            <button @click="emit">선택</button>
            <webview id="youtubePlayer" src="https://www.youtube.com/" autosize="on" nodeIntegration></webview>
        </div>
    </div>
</template>
<script>
    import {ipcRenderer} from 'electron';

    export default {
        name: 'YoutubePlayer',
        components: {},
        data() {
            return {
                musicData: {}
            }
        },
        created() {
            ipcRenderer.on('2000', (event, data) => {
                this.musicData = data;
            });
        },
        mounted() {

            const webview = document.getElementById('youtubePlayer');
            window.onresize = () => {
                webview.style.height = window.innerHeight + 'px'
            }
            webview.addEventListener('dom-ready', () => {
                webview.executeJavaScript(`
                  const {ipcRenderer} = require('electron')
                  ipcRenderer.on('ping', () => {
                    ipcRenderer.sendToHost('pong')
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