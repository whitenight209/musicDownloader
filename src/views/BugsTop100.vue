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
            <td class="table-item" align="center">{{ item.ranking }}</td>
            <td class="table-item"><img class="music-image" width="40px" :src="item.albumCoverUrl"/></td>
            <td class="table-item">{{item.songName}}</td>
            <td class="table-item">{{item.artistName}}</td>
            <td class="table-item">{{item.albumName}}</td>
            <td>
              <v-btn icon @click="openYoutubeWindow(item.key)" medium color="primary">
                <v-icon large>{{icons.mdiYoutube}}</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mdiYoutube } from '@mdi/js';
// import Events from '../Event';
// const { ipcRenderer } = window.require('electron');
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
    async openYoutubeWindow (musicId) {
      console.log(musicId);
      await this.$router.push({ name: 'youtubeSearch', query: { bugsId: musicId } });
      // console.log(this.musicDetail);
      // ipcRenderer.send(Events.EVENT_OPEN_YOUTUBE_WINDOW, musicId);
    }
  },
  computed: {
    ...mapGetters({ top100List: 'getTop100', musicDetail: 'getMusicDetail' })
  }
};
</script>
<style scoped>
  .table-item {
    font-size: 12px !important;
  }
  .music-image {
    border-radius: 50%;
    border: 1px solid black;
  }
</style>
