<template>
    <div class="home" style="background-color: white">
        <div class="mx-4">
            <v-tabs v-model="tab">
                <v-tab :key="0">
                    벅스 Top 100
                </v-tab>
                <v-tab :key="1">
                    벅스
                </v-tab>
                <v-tab :key="2">저장된 음악</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item :key="1">
                    <div>
                        <MusicList :items="top100List" :item-button-text="message.addButton" @itemClick="onItemClick"/>
                    </div>
                </v-tab-item>
                <v-tab-item :key="2">
                    <div>
                        <VTextField class="d-inline-block pr-3" style="width: 92%;" v-model="searchParam"></VTextField>
                        <v-btn class="d-inline-block" style="width: 8%; height: 34px !important;" @click="searchSong">search</v-btn>
                    </div>
                    <div>
                        <Pagination :page-list="pageList" @click="onPaginationClick"/>
                    </div>
                    <div>
                        <MusicList :items="songList" :item-button-text="message.addButton" @itemClick="onItemClick"/>
                    </div>
                    <div>
                        <Pagination :page-list="pageList"  @click="onPaginationClick"/>
                    </div>
                </v-tab-item>
                <v-tab-item :key="3">
                    <v-card flat color="basil">
                        <br/>
                        <div>
                            <v-btn small @click="changeDownloadDirectory">directory</v-btn>
                            directory : {{downloadDirectory}}
                        </div>
                        <br/>
                        <v-progress-linear
                                :buffer-value="100"
                                :height="4"
                                :value="(count / initCount) * 100"
                                color="light-blue"
                        ></v-progress-linear>
                        <p>{{progress}}</p>
                        <div>
                            <MusicList :items="storedSongList" :item-button-text="message.storedButton" @itemClick="onStoredItemClick"/>
                        </div>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import {ipcRenderer} from 'electron';
    import MusicList from "@/components/MusicList";
    import Pagination from "@/components/Pagination";
    import {searchBugsSong, getBugsTop100} from '@/util/api';
    import { VTextField } from 'vuetify/lib';

    export default {
        name: 'home',
        components: {
            Pagination,
            MusicList,
            VTextField
        },
        mounted() {
            ipcRenderer.on('song-db-list', (e, data) => {
                this.storedSongList = data;
            })
            ipcRenderer.on('download-directory', (e, data) => {
                if (data) {
                    this.downloadDirectory = data[0];
                }
            })
            ipcRenderer.on('10000', (e, data) => {
                if (data.type == 'initCount') {
                    this.count = 0;
                }
                this[data.type] = data.data;
            })
            if(!this.top100List.length) {
                this.getBugsMusicTop100();
            }
        },
        data() {
          return {
              searchParam: '고백',
              top100List: [],
              songList: [],
              pageList: [],
              tab: 0,
              storedSongList: [],
              message : {
                  addButton: 'add',
                  storedButton: 'download'
              },
              downloadDirectory: '',
              count: 0,
              initCount: 0,
              progress: ''
          }
        },
        computed: {
          computedProgress() {
              return this.count / this.initCount;
          }
        },
        watch: {
          progress() {
              this.count += 1;
          },
          tab(newKey) {
              if(newKey === 2 ) {
                  this.getStoredSong();
              } else if (newKey === 0 ) {
                  if(!this.top100List.length) {
                      this.getBugsMusicTop100();
                  }
              }
          }
        },
        methods: {
            async searchSong() {
                const { songList, pageList } = await searchBugsSong(this.searchParam);
                this.songList = songList;
                this.pageList = pageList;
            },
            onItemClick(data) {
                ipcRenderer.send('1000', data)
            },
            onStoredItemClick(data) {
                if (!this.downloadDirectory) {
                    alert('다운로드 경로를 선택하세요');
                    return;
                }
                data.downloadPath = this.downloadDirectory;
                ipcRenderer.send('download-song', data)
            },
            getStoredSong() {
                ipcRenderer.send('song-db-list')
            },
            changeDownloadDirectory() {
                ipcRenderer.send('open-file-dialog')
            },
            async onPaginationClick(data) {
                const { songList, pageList } = await searchBugsSong(this.searchParam, data);
                this.songList = songList;
                this.pageList = pageList;
            },
            async getBugsMusicTop100() {
                const top100SongList = await getBugsTop100();
                this.top100List = top100SongList;
                console.log(typeof this.top100List)
            }
        }
    }
</script>
