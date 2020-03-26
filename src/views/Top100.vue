<template>
    <div>
        <c-table :font-size="tableConfig.fontSize"
                 :headers="headers"
                 :items="top100List"
                 :header-font-size="tableConfig.headerFontSize"
                 @click="onItemClick"
        />
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron';
    import { mapGetters, mapActions } from 'vuex'
    import CTable from "@/components/CTable";

    export default {
        name: "Top100",
        components: {CTable},
        data() {
          return {
              tableConfig: {
                  headerFontSize: '15px',
                  fontSize: '13px'
              },
              headers: [
                  { text: 'rank',   value: 'ranking',       type: 'string', align: 'center' },
                  { text: '',       value: 'albumCoverUrl', type: 'image', width:50, height: 50 },
                  { text: 'song',   value: 'songName',      type: 'string' },
                  { text: 'artist', value: 'artistName',    type: 'string' },
                  { text: 'album' , value: 'albumName',     type: 'string' }
              ]
          }
        },
        mounted() {
            this.getTop100MusicList();
        },
        methods: {
            ...mapActions({getTop100MusicList: 'getTop100MusicList'}),
            onItemClick(musicId) {
                ipcRenderer.send('1000', musicId);
            }
        },
        computed: {
            ...mapGetters({top100List: 'getTop100'})
        }
    }
</script>

<style scoped>

</style>