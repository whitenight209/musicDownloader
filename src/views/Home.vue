<template>
    <div class="home">
        <v-tabs v-model="tab">
            <v-tab :key="0">
                벅스
            </v-tab>
            <v-tab :key="1">저장된 음악</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item :key="1">
                <div>
                    <VTextField v-model="searchParam"></VTextField>
                    <v-btn @click="searchSong">test</v-btn>
                </div>
                <div>
                    <MusicList :items="songList" :item-button-text="message.addButton" @itemClick="onItemClick"/>
                </div>
            </v-tab-item>
            <v-tab-item :key="2">
                <v-card flat color="basil">
                    <v-card-text>test</v-card-text>
                    <v-btn @click="getStoredSong">test2</v-btn>
                    <div>
                        <MusicList :items="storedSongList" :item-button-text="message.storedButton" @itemClick="onStoredItemClick"/>
                    </div>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
    // @ is an alias to /src
    import {ipcRenderer} from 'electron';
    import MusicList from "@/components/MusicList";
    import {searchBugsSong} from '@/util/api';
    import { VTextField } from 'vuetify/lib';
    export default {
        name: 'home',
        components: {
            MusicList,
            VTextField
        },
        mounted() {
            ipcRenderer.on('song-db-list', (e, data) => {
                this.storedSongList = data;
            })
        },
        data() {
          return {
              searchParam: '고백',
              songList: [],
              tab: 0,
              storedSongList: [],
              message : {
                  addButton: 'add',
                  storedButton: 'download'
              }
          }
        },
        methods: {
            async searchSong() {
                this.songList = await searchBugsSong(this.searchParam);
            },
            onItemClick(data) {
                ipcRenderer.send('1000', data)
            },
            onStoredItemClick(data) {
                ipcRenderer.send('download-song', data)
            },
            getStoredSong() {
                ipcRenderer.send('song-db-list')
            }
        }
    }
</script>
