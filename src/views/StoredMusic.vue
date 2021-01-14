<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <div>
      <div class="d-inline-flex item-text">다운로드 경로 :</div>
      <v-btn icon @click="openFileChooser">
        <v-icon>{{icons.mdiFolderOpen}}</v-icon>
      </v-btn>
      <div class="d-inline-flex item-text">{{getDownloadPath}}</div>
    </div>
    <v-data-table
      :items="storedMusicList"
      :headers="headers"
      :items-per-page="offset"
      hide-default-footer
      show-select
      v-model="selectedItems"
    >
      <template v-slot:item="{ item, headers, isSelected, select }">
        <tr>
          <template v-for="(header, headerIndex) in headers">
            <td :key="headerIndex + 'check'" v-if='header.value === "data-table-select"'>
              <v-checkbox  @change="select" :value="isSelected"></v-checkbox>
            </td>
            <img v-else-if="header.type === 'image'" class="d-block d-sm-table-cell" :key="headerIndex"
                 :src="item[header.value]" :width="header.width"/>
            <td v-else-if="header.type ==='percentage'" class="d-block d-sm-table-cell" :key="headerIndex">
              <v-progress-linear
                color="light-blue"
                height="10"
                :value="item.percentage"
                striped
              ></v-progress-linear>
            </td>
            <td v-else-if="header.type === 'button'" :key="headerIndex"
                :width="header.width ? header.width +'px' : '25px'" class="d-block d-sm-table-cell">
              <v-btn @click="header.cback(item[header.value])" small color="secondary">
                <v-icon>{{header.icon}}</v-icon>
              </v-btn>
            </td>
            <td v-else class="d-block d-sm-table-cell" :key="headerIndex" :align="header.align">{{item[header.value]}}
            </td>
          </template>
        </tr>
      </template>
    </v-data-table>
    <div style="width: 50px">
    </div>
  </div>
</template>

<script>
import Event from '@/Event';
import { mapGetters, mapActions } from 'vuex';
import { mdiBriefcaseDownloadOutline, mdiDeleteCircle, mdiFolderOpen } from '@mdi/js';

const { ipcRenderer } = window.require('electron');

export default {
  name: 'StoredMusic',
  created () {
    ipcRenderer.on(Event.EVENT_REFRESH_ITEMS, this.refreshMusic);
    ipcRenderer.on(Event.EVENT_SELECT_MUSIC, this.setMusicList);
    // this.initAppBar();
    this.setAppBarFlag(true);
  },
  mounted () {
    console.log('mounted');
    ipcRenderer.send(Event.EVENT_SELECT_MUSIC, {});
  },
  beforeDestroy () {
    ipcRenderer.removeAllListeners(Event.EVENT_SELECT_MUSIC);
    ipcRenderer.removeAllListeners(Event.EVENT_REFRESH_ITEMS);
    this.setAppBarFlag(false);
    console.log('destroy');
  },
  computed: {
    ...mapGetters({
      getDownloadPath: 'downloadPath',
      processList: 'processList',
      storedMusicList: 'getStoredMusicList'
    })
  },
  data () {
    return {
      headers: [
        { text: 'id', value: 'id', sortable: false },
        { text: '', value: 'albumCoverImage', sortable: false, type: 'image', width: '50px' },
        { text: 'songName', value: 'name', align: 'center', sortable: false },
        { text: 'artist', value: 'artistName', sortable: false },
        { text: 'album', value: 'albumName', sortable: false },
        { text: '', value: '', sortable: false },
        { text: 'percentage', value: 'percentage', type: 'percentage', sortable: false },
        {
          text: 'download',
          value: 'id',
          type: 'button',
          cback: (id) => this.downloadSong(id),
          icon: mdiBriefcaseDownloadOutline
        },
        { text: 'delete', value: 'id', type: 'button', cback: (id) => this.deleteMusic(id), icon: mdiDeleteCircle }
      ],
      musicList: [],
      totalCount: 0,
      offset: 50,
      currentPage: 1,
      selectedItems: [],
      icons: {
        mdiFolderOpen
      }
    };
  },
  watch: {
    storedMusicList (data) {
      console.log(data);
      console.log('storedMusicList updated');
    }
  },
  methods: {
    ...mapActions(
      {
        setAppBarFlag: 'setAppBarFlag',
        setAppBar: 'setAppBar',
        addDownload: 'addDownload',
        addDownloads: 'addDownloads',
        setStoredMusicList: 'setStoredMusicList'
      }
    ),
    downloadSong (id) {
      console.log(id);
      const downloadPath = this.getDownloadPath;
      if (!downloadPath) {
        alert('다운로드 경로를 설정해주세요.');
        return;
      }
      ipcRenderer.send(Event.DOWNLOAD_MUSIC, { id, downloadPath });
      const selectedMusic = this.storedMusicList.filter(music => music.id === id)[0];
      selectedMusic.progress = 0;
      this.addDownload({ id, percentage: 0 });
    },
    setMusicList (e, data) {
      this.setStoredMusicList(data);
    },
    deleteMusic (id) {
      ipcRenderer.send(Event.DELETE_STORED_MUSIC, id);
    },
    refreshMusic () {
      ipcRenderer.send(Event.EVENT_SELECT_MUSIC, {});
    },
    onCheckBoxClick (music) {
      console.log(music);
    },
    openFileChooser () {
      ipcRenderer.send(Event.OPEN_FILE_DIALOG);
    }
  }
};
</script>

<style scoped>
  .item-text {
    font-size: 12px;
  }
</style>
