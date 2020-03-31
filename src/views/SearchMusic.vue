import {ipcRenderer} from "electron";
<template>
    <div>
        <div>
            <input v-on:keyup.enter="searchMusic" v-model="searchInput" type="text"/>
            <button @click="searchMusic">search</button>
            <c-table
                    :items="items.songList"
                    :headers="headers"
                    @click="onItemClick"
            />
            <pagination :items="items.pageList" @click="pagination"/>
        </div>
    </div>
</template>

<script>
    import {searchBugsSong} from '@/util/api';
    import CTable from "@/components/CTable";
    import Pagination from "@/components/Pagination";
    import { ipcRenderer } from 'electron';

    export default {
        name: "SearchMusic",
        components: {Pagination, CTable},
        data() {
            return {
                searchInput: '',
                items : [],
                headers: [
                    { text: '',       value: 'albumCoverUrl', type: 'image', width: 50, height: 50 },
                    { text: 'song',   value: 'songName',      type: 'string' },
                    { text: 'artist', value: 'artistName',    type: 'string', width: 200 },
                    { text: 'album', value: 'albumName',    type: 'string', width: 200 },
                ]
            }
        },
        methods: {
            async searchMusic() {
                this.items = await searchBugsSong(this.searchInput);
            },
            async pagination(page) {
                const items = await searchBugsSong(this.searchInput, page.index);
                this.items = items;
            },
            onItemClick(musicId) {
                ipcRenderer.send('1000', musicId);
            }
        }
    }
</script>

<style scoped>

</style>