<template>
  <v-data-table
    :items="musicList"
    :headers="headers"
    hide-default-footer
  >
    <template v-slot:item="{ item, headers }">
      <tr>
        <template v-for="(header, headerIndex) in headers">
          <img v-if="header.type === 'image'" class="d-block d-sm-table-cell" :key="headerIndex"  :src="item[header.value]" :width="header.width" />
          <td  v-else-if="header.type === 'button'" :key="headerIndex" :width="header.width ? header.width +'px' : '25px'"  class="d-block d-sm-table-cell">
            <v-btn @click="header.cback(item[header.value])" small color="secondary">
              <v-icon>{{header.icon}}</v-icon>
            </v-btn>
          </td>
          <td v-else class="d-block d-sm-table-cell"  :key="headerIndex" :align="header.align">{{item[header.value]}}</td>
        </template>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import Event from '@/Event';
import { mapGetters } from 'vuex';
import { mdiBriefcaseDownloadOutline, mdiDeleteCircle } from '@mdi/js';
const { ipcRenderer } = window.require('electron');

export default {
  name: 'StoredMusic',
  created () {
    ipcRenderer.on(Event.EVENT_REFRESH_ITEMS, this.refreshMusic);
    ipcRenderer.on(Event.EVENT_SELECT_MUSIC, this.setMusicList);
  },
  mounted () {
    console.log('mounted');
    ipcRenderer.send(Event.EVENT_SELECT_MUSIC, {});
  },
  beforeDestroy () {
    ipcRenderer.removeAllListeners(Event.EVENT_SELECT_MUSIC);
    ipcRenderer.removeAllListeners(Event.EVENT_REFRESH_ITEMS);
    console.log('destroy');
  },
  computed: {
    ...mapGetters({ getDownloadPath: 'downloadPath' })
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
        { text: 'download', value: 'id', type: 'button', cback: (id) => this.downloadSong(id), icon: mdiBriefcaseDownloadOutline },
        { text: 'delete', value: 'id', type: 'button', cback: (id) => this.deleteMusic(id), icon: mdiDeleteCircle }
      ],
      musicList: []
    };
  },
  methods: {
    downloadSong (id) {
      console.log(`downlaod song id ${id}`);
      const downloadPath = this.getDownloadPath;
      if (!downloadPath) {
        alert('다운로드 경로를 설정해주세요.');
        return;
      }
      ipcRenderer.send(Event.DOWNLOAD_MUSIC, { musicId: id, downloadPath });
    },
    setMusicList (e, musicList) {
      this.musicList = musicList;
      console.log(musicList);
    },
    deleteMusic (id) {
      ipcRenderer.send(Event.DELETE_STORED_MUSIC, id);
    },
    refreshMusic () {
      ipcRenderer.send(Event.EVENT_SELECT_MUSIC, {});
    }
  }
};
</script>

<style scoped>

</style>
