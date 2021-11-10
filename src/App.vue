<template>
  <!-- App.vue -->

  <v-app>
    <div class="top float-right" style="z-index: 5;position: absolute; right: 10px; bottom: 10px">
      <v-alert
        :key="index"
        v-for="(alert, index) in alerts"
        border="left"
        dark
        :type="alert.alertType"
      >
        {{alert.message}}
      </v-alert>
    </div>
    <v-navigation-drawer
      app
      permanent
      fixed
      absolute
      width="150"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            <span>
              Music
            </span>
            <div>
              Downloader
            </div>
          </v-list-item-title>
          <v-list-item-subtitle>
            v0.0.1 alpha
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.link ? item.link : ''"
        >
          <v-list-item-icon class="mr-3" v-if="item.type === 'component'">
            <component :is="item.component"></component>
          </v-list-item-icon>
          <v-list-item-icon class="mr-3" v-else>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- Sizes your content based upon application components -->
    <v-main>
      <div>
      </div>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      made by chpark
    </v-footer>
  </v-app>
</template>

<script>
import { mdiYoutube, mdiFolderMusic, mdiPoll, mdiCog } from '@mdi/js';
import BugsIcon from '@/components/BugsIcon';
import Event from '@/Event';
import { provideStore, useStore } from '@/store/index';
import { provideRouter, useRouter } from '@/router/index';
import { onMounted, ref } from '@vue/composition-api';
const { ipcRenderer } = window.require('electron');
export default {
  components: {
    BugsIcon
  },
  name: 'App',
  setup () {
    provideStore();
    provideRouter();
    const { currentRoute } = useRouter();
    const { state, dispatch } = useStore();
    const mini = ref(true);
    const drawer = ref(true);
    const alerts = ref([]);
    const items = [
      { title: 'top100', icon: mdiPoll, link: '/', color: 'blue' },
      { title: 'Bugs 검색', type: 'component', component: BugsIcon, link: '/bugs/search' },
      { title: 'Youtube 검색', color: 'red', icon: mdiYoutube, link: '/youtube/search' },
      { title: '저장된 노래', color: 'purple', icon: mdiFolderMusic, link: '/stored' },
      { title: '설정', icon: mdiCog, link: '/settings' }
    ];
    const setAppbarFlag = (flag) => {
      state.useAppBar = flag;
    };
    const setMenuFlag = (menuFlag) => {
      state.useMenu = menuFlag;
    };
    const setDownloadPath = (downloadPath) => {
      state.downloadPath = downloadPath;
    };
    const setConfig = (config) => {
      state.config = config;
    };
    const updateProgress = (dataForUpdate) => {
      dispatch('updateProgress', dataForUpdate);
    };
    onMounted(() => {
      ipcRenderer.on(Event.OPEN_FILE_DIALOG, (e, downloadPath) => {
        setDownloadPath(downloadPath);
      });
      ipcRenderer.on(Event.INIT_CONFIG, (e, config) => {
        console.log(config);
        setConfig(config);
      });
      ipcRenderer.on(Event.EVENT_SEND_DOWNLOAD_SONG_PROGRESS, (e, process) => {
        updateProgress(process);
      });
      ipcRenderer.on(Event.EVENT_GLOBAL_ALERT, (e, alert) => {
        console.log('event received');
        console.log(alert);
        alerts.value.push(alert);
        setTimeout(() => {
          alerts.value = alerts.value.filter(i => i.id !== alert.id);
        }, 2000);
      });
      ipcRenderer.send(Event.INIT_CONFIG);
      currentRoute.query.appBar === 'false' ? setAppbarFlag(false) : setAppbarFlag(true);
      currentRoute.query.menu === 'false' ? setMenuFlag(false) : setMenuFlag(true);
    });
    return {
      items,
      mini,
      drawer,
      alerts
    };
  }
};
</script>
