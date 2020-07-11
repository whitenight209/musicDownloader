import { ipcRenderer } from "electron"
<template>
  <div class="home">
    <v-data-table
      :items="top100List"
      :headers="headers"
      :options="tableOptions"
      hide-default-footer
    >
      <template v-slot:body="{ items }">
        <tbody>
        <tr v-for="item in items" :key="item.key">
          <td align="center">{{ item.ranking }}</td>
          <td><img width="50px" :src="item.albumCoverUrl"/></td>
          <td>{{item.songName}}</td>
          <td>{{item.artistName}}</td>
          <td>{{item.albumName}}</td>
          <td>
            <v-btn @click="openYoutubeWindow(item.key)" small color="primary">
              <v-icon>{{icons.mdiYoutube}}</v-icon>
            </v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import { mapGetters, mapActions } from 'vuex';
import { mdiYoutube } from '@mdi/js';
import Events from '../Event';
const { ipcRenderer } = window.require('electron');
export default {

  name: 'Home',
  data () {
    return {
      headers: [
        { text: 'ranking', value: 'ranking', align: 'center', sortable: false },
        { text: '', value: 'albumCoverUrl', sortable: false },
        { text: 'song', value: 'songName', sortable: false },
        { text: 'artist', value: 'artistName', sortable: false },
        { text: 'album', value: 'albumName', sortable: false },
        { text: '', value: '', sortable: false }
      ],
      tableOptions: {
        itemsPerPage: 100
      },
      icons: {
        mdiYoutube
      }
    };
  },
  components: {
    // HelloWorld
  },
  mounted () {
    this.getTop100MusicList();
    console.log(this.top100List);
  },
  methods: {
    ...mapActions({ getTop100MusicList: 'getTop100MusicList', getMusicDetail: 'getMusicDetail' }),
    openYoutubeWindow (musicId) {
      console.log(this.musicDetail);
      ipcRenderer.send(Events.EVENT_OPEN_YOUTUBE_WINDOW, musicId);
    }
  },
  computed: {
    ...mapGetters({ top100List: 'getTop100', musicDetail: 'getMusicDetail' })
  }
};
</script>
