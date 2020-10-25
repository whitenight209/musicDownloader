<template>
  <!-- App.vue -->

  <v-app>
    <v-navigation-drawer
      :update:mini-variant="eventTest"
      app
      permanent
      v-model="drawer"
      :mini-variant.sync=mini
      v-if="useMenu"
      expand-on-hover=""
    >
      <v-list>
        <template v-for="(item, i) in items">
          <v-list-group v-if="item.menu" :key="i" :prepend-icon="item.icon" value="true" no-action>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{item.title}}</v-list-item-title>
              </v-list-item-content>
            </template>
              <v-list-item :key="subIndex" v-for="(subMenu, subIndex) in item.menu" link :to="subMenu.link">
                <v-list-item-icon>
                  <v-icon>{{ subMenu.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ subMenu.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="i"
            link
            :to="item.link ? item.link : ''"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="useAppBarFlag" app>
      <template v-for="(item, index) in appBar">
        <v-btn :key="index" @click="item.callback">{{item.title}}</v-btn>
      </template>
<!--      <v-btn to="/">home</v-btn>-->
<!--      <v-btn to="/stored">stored</v-btn>-->
<!--      <v-btn @click="openYoutubeWindow">youtube</v-btn>-->
<!--      <v-btn @click="openDialog">open</v-btn>-->
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
import { mdiMusicCircle, mdiYoutube, mdiFolderMusic, mdiCardSearch, mdiPoll } from '@mdi/js';
import Event from '@/Event';
import { mapGetters, mapActions } from 'vuex';

const { ipcRenderer } = window.require('electron');
export default {

  name: 'App',
  created () {
    console.log(this.$route);
    ipcRenderer.on(Event.OPEN_FILE_DIALOG, (e, downloadPath) => {
      this.setDownloadPath(downloadPath);
    });
    ipcRenderer.on(Event.INIT_CONFIG, (e, config) => {
      console.log(config);
      this.setConfig(config);
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
        setConfig: 'setConfig'
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
          title: 'Bugs',
          icon: mdiMusicCircle,
          menu: [
            { title: 'top100', icon: mdiPoll, link: '/' },
            { title: 'search', icon: mdiCardSearch, link: '/bugs/search' }
          ]
        },
        {
          title: 'Youtube',
          icon: mdiYoutube,
          menu: [
            { title: 'search', icon: mdiYoutube, link: '/youtube/search' }
          ]
        },
        { title: 'Stored', icon: mdiFolderMusic, link: '/stored' }
      ]
    };
  }
};
</script>
