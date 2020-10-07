<template>
  <div>
    <v-container>
      <v-row >
        <v-col>
          <v-text-field
            v-model="songName"
            label="노래 이름"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn @click="bugsSearch">search</v-btn>
        </v-col>
      </v-row>
      <v-radio-group
        v-model="searchType"
        row
      >
        <v-radio
          label="전체"
          value='ARTIST_TRACK_ALBUM'
        ></v-radio>
        <v-radio
          label="앨범명"
          value="ALBUM_ONLY"
        ></v-radio>
        <v-radio
          label="가수명"
          value="ARTIST_ONLY"
        ></v-radio>
      </v-radio-group>
      <v-data-table
        :headers="headers"
        :items="items.songList"
      >
        <template v-slot:body="{ items }">
          <tbody>
          <tr v-for="item in items" :key="item.key">
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
    </v-container>
  </div>
</template>

<script>
import { searchBugsSong } from '@/util/api';
import { mdiYoutube } from '@mdi/js';

export default {
  name: 'BugsSearch',
  data () {
    return {
      songName: '',
      headers: [
        { text: '', value: '' },
        { text: '앨범', value: 'albumName' },
        { text: '노래', value: 'songName' },
        { text: '가수', value: 'artistName' },
        { text: '', value: '' }
      ],
      items: {
        songList: [],
        pageList: []
      },
      pagination: {
        selectedPage: 1,
        startIndex: 1,
        pageOffset: 10
      },
      icons: {
        mdiYoutube: mdiYoutube
      },
      searchType: 'ARTIST_TRACK_ALBUM'
    };
  },
  methods: {
    async bugsSearch () {
      const items = await searchBugsSong(this.songName, this.searchType);
      this.items = items;
      const selectedPage = items.pageList.filter(page => page.isSelected)[0];
      const startIndex = items.pageList[0];
      const pageOffset = items.pageList.length;
      this.pagination = { selectedPage, startIndex, pageOffset };
    },
    async openYoutubeWindow (musicId) {
      console.log(musicId);
      await this.$router.push({ name: 'youtubeSearch', query: { bugsId: musicId } });
      // console.log(this.musicDetail);
      // ipcRenderer.send(Events.EVENT_OPEN_YOUTUBE_WINDOW, musicId);
    }
  }
};
</script>

<style scoped>

</style>
