<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <div>
      <div class="d-inline-flex item-text">다운로드 경로 :</div>
      <v-btn icon @click="openFileChooser">
        <v-icon>{{icons.mdiFolderOpen}}</v-icon>
      </v-btn>
      <div class="d-inline-flex item-text">{{downloadPath}}</div>
    </div>
    <v-data-table
      :items="storedMusicList"
      :headers="headers"
      :items-per-page="itemPerPage"
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
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="totalCount"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, computed, onMounted, onUnmounted, watch } from '@vue/composition-api';
import { useStore } from '@/store/index';
import Event from '@/Event';
import { mdiBriefcaseDownloadOutline, mdiDeleteCircle, mdiFolderOpen } from '@mdi/js';

const { ipcRenderer } = window.require('electron');

export default defineComponent({
  name: 'StoredMusic',
  setup () {
    const page = ref(1);
    const itemPerPage = ref(20);
    const { dispatch, state } = useStore();
    const openFileChooser = () => {
      ipcRenderer.send(Event.OPEN_FILE_DIALOG);
    };
    const deleteMusic = (id) => {
      ipcRenderer.send(Event.DELETE_STORED_MUSIC, id);
    };
    const refreshMusic = () => {
      ipcRenderer.send(Event.EVENT_SELECT_MUSIC, {});
    };
    const setMusicList = async (e, data) => {
      await dispatch('setStoredMusicList', data);
    };
    const downloadPath = computed(() => {
      return state.downloadPath;
    });
    const processList = computed(() => {
      return state.processList;
    });
    const storedMusicList = computed(() => {
      return state.storedMusicList;
    });
    const totalCount = computed(() => {
      return parseInt(state.storedMusicTotalCount / itemPerPage.value) + (parseInt(state.storedMusicTotalCount % itemPerPage.value) > 0 ? 1 : 0);
    });
    const headers = [
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
        cback: (id) => downloadSong(id),
        icon: mdiBriefcaseDownloadOutline
      },
      { text: 'delete', value: 'id', type: 'button', cback: (id) => deleteMusic(id), icon: mdiDeleteCircle }
    ];
    onMounted(() => {
      dispatch('setAppBarFlag', true);
      ipcRenderer.on(Event.EVENT_REFRESH_ITEMS, refreshMusic);
      ipcRenderer.on(Event.EVENT_SELECT_MUSIC, setMusicList);
      ipcRenderer.send(Event.EVENT_SELECT_MUSIC, {});
    });
    onUnmounted(() => {
      dispatch('setAppBarFlag', false);
      ipcRenderer.removeAllListeners(Event.EVENT_SELECT_MUSIC);
      ipcRenderer.removeAllListeners(Event.EVENT_REFRESH_ITEMS);
    });
    const downloadSong = (id) => {
      const downloadPath = state.downloadPath;
      if (!downloadPath) {
        alert('다운로드 경로를 설정해주세요.');
        return;
      }
      ipcRenderer.send(Event.DOWNLOAD_MUSIC, { id, downloadPath });
      const selectedMusic = state.storedMusicList.filter(music => music.id === id)[0];
      selectedMusic.progress = 0;
    };
    watch(page, (value) => {
      ipcRenderer.send(Event.EVENT_SELECT_MUSIC, { page: value, offset: itemPerPage.value });
      console.log(page.value);
      console.log('page changed');
    });
    return {
      headers,
      itemPerPage,
      currentPage: ref(1),
      selectedItems: ref([]),
      page,
      icons: {
        mdiFolderOpen
      },
      openFileChooser,
      downloadPath,
      processList,
      storedMusicList,
      totalCount
    };
  }
});
</script>

<style scoped>
  .item-text {
    font-size: 12px;
  }
</style>
