<template>
  <!-- App.vue -->

  <v-app>
    <v-navigation-drawer
      app
      expand-on-hover
    >
      <v-list dense>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="useTopBar" app>
      <v-btn to="/">home</v-btn>
      <v-btn to="/stored">stored</v-btn>
      <v-btn @click="openYoutubeWindow">youtube</v-btn>
      <v-btn @click="openDialog">open</v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      made by chpark
    </v-footer>
  </v-app>
</template>

<script>
import { mdiMusicCircle, mdiYoutube, mdiFolderMusic } from '@mdi/js';
import Event from '@/Event';
import { mapGetters, mapActions } from 'vuex';
const { ipcRenderer } = window.require('electron');
export default {

  name: 'App',
  created () {
    ipcRenderer.on(Event.OPEN_FILE_DIALOG, (e, downloadPath) => {
      this.setDownloadPath(downloadPath);
    });
  },
  computed: {
    ...mapGetters({ useTopBar: 'useTopBar' })
  },
  methods: {
    ...mapActions({ setDownloadPath: 'setDownloadPath' }),
    openDialog () {
      ipcRenderer.send(Event.OPEN_FILE_DIALOG);
    },
    openYoutubeWindow () {
      ipcRenderer.send(Event.EVENT_OPEN_YOUTUBE_WINDOW);
    }
  },
  data () {
    return {
      items: [
        { title: 'Bugs', icon: mdiMusicCircle, link: '/' },
        { title: 'Youtube', icon: mdiYoutube, link: '/youtube' },
        { title: 'Stored', icon: mdiFolderMusic, link: 'stored' }
      ]
    };
  }
};
</script>
