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
          <td  v-else-if="header.type === 'button'" :key="headerIndex"  class="d-block d-sm-table-cell">
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
import { mdiBriefcaseDownloadOutline } from '@mdi/js';
const { ipcRenderer } = window.require('electron');

export default {
  name: 'StoredMusic',
  created () {
    ipcRenderer.on(Event.EVENT_SELECT_MUSIC, this.setMusicList);
    ipcRenderer.on(Event.OPEN_FILE_DIALOG, (e, downloadPath) => {
      this.downloadPath = downloadPath;
    });
  },
  mounted () {
    console.log('mounted');
    ipcRenderer.send(Event.EVENT_SELECT_MUSIC, {});
  },
  beforeDestroy () {
    console.log('destroy');
    ipcRenderer.removeAllListeners(Event.EVENT_SELECT_MUSIC);
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
        { text: 'download', value: 'id', type: 'button', cback: (id) => this.downloadSong(id), icon: mdiBriefcaseDownloadOutline }
      ],
      musicList: []
    };
  },
  methods: {
    downloadSong (id) {
      console.log(`downlaod song id ${id}`);
      ipcRenderer.send(Event.DOWNLOAD_MUSIC, { musicId: id, downloadPath: this.downloadPath });
    },
    setMusicList (e, musicList) {
      this.musicList = musicList;
      console.log(musicList);
    }
  }
};
</script>

<style scoped>

</style>
