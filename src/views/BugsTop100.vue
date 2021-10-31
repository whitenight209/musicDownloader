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
              <v-btn icon @click="routeToYoutubeWindow(item.key)" medium color="red">
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
import { mdiYoutube } from '@mdi/js';
import { ref, onMounted, computed, defineComponent } from '@vue/composition-api';
import { useStore } from '@/store/index';
import { useRouter } from '@/router/index';
export default defineComponent({
  name: 'Home',
  setup () {
    const { state, dispatch } = useStore();
    const router = useRouter();
    const itemsPerPage = ref(100);
    const headers = ref([
      { text: '순위', value: 'ranking', align: 'center', sortable: false },
      { text: '', value: 'albumCoverUrl', sortable: false },
      { text: '곡', value: 'songName', sortable: false },
      { text: '아티스트', value: 'artistName', sortable: false },
      { text: '앨범', value: 'albumName', sortable: false },
      { text: 'YOUTUBE', value: '', sortable: false }
    ]);
    const routeToYoutubeWindow = async (musicId) => {
      await router.push({ name: 'youtubeSearch', query: { bugsId: musicId } });
    };
    const top100List = computed(() => state.top100List);
    onMounted(e => {
      dispatch('getTop100MusicList');
    });
    return {
      headers,
      top100List,
      icons: {
        mdiYoutube
      },
      tableOptions: {
        itemsPerPage: itemsPerPage.value
      },
      routeToYoutubeWindow
    };
  }
});
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
