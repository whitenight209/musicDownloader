<template>
  <!-- App.vue -->

  <v-app>
    <v-navigation-drawer
      :update:mini-variant="eventTest"
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
import { mdiYoutube, mdiFolderMusic, mdiPoll } from '@mdi/js';
import BugsIcon from '@/components/BugsIcon';
import Event from '@/Event';
import { mapGetters, mapActions } from 'vuex';

const { ipcRenderer } = window.require('electron');
export default {
  components: {
    BugsIcon
  },
  name: 'App',
  created () {
    ipcRenderer.on(Event.OPEN_FILE_DIALOG, (e, downloadPath) => {
      this.setDownloadPath(downloadPath);
    });
    ipcRenderer.on(Event.INIT_CONFIG, (e, config) => {
      console.log(config);
      this.setConfig(config);
    });
    ipcRenderer.on(Event.EVENT_SEND_DOWNLOAD_SONG_PROGRESS, (e, process) => {
      this.updateProcess(process);
    });
    ipcRenderer.send(Event.INIT_CONFIG);
    this.$route.query.appBar === 'true' ? this.setAppBarFlag(true) : this.setAppBarFlag(false);
    this.$route.query.menu === 'false' ? this.setMenuFlag(false) : this.setMenuFlag(true);
  },
  computed: {
    ...mapGetters(
      {
        useAppBarFlag: 'useAppBarFlag',
        useMenu: 'getMenuFlag',
        appBar: 'getAppBar'
      }
    )
  },
  watch: {
    drawer (value) {
      console.log(value);
    }
  },
  methods: {
    ...mapActions(
      {
        setDownloadPath: 'setDownloadPath',
        setAppBarFlag: 'setAppBarFlag',
        setMenuFlag: 'setMenuFlag',
        setConfig: 'setConfig',
        updateProcess: 'updateProcess'
      }
    ),
    eventTest (e) {
      console.log(e);
    }
  },
  data () {
    return {
      mini: true,
      drawer: true,
      items: [
        {
          title: 'top100',
          icon: mdiPoll,
          link: '/',
          color: 'blue'
        },
        { title: 'Bugs 검색', type: 'component', component: BugsIcon, link: '/bugs/search' },
        { title: 'Youtube 검색', color: 'red', icon: mdiYoutube, link: '/youtube/search' },
        { title: '저장된 노래', color: 'purple', icon: mdiFolderMusic, link: '/stored' }
      ]
    };
  }
};
</script>
