<template>
    <div>
        <div style="margin-bottom: 5px; margin-top: 5px">
            <button @click="openFileDialog">폴더 선택</button>
            <button>download</button>
            <p>{{downloadPath}}</p>
        </div>
        <c-table
                show-select-all
                show-select
                :items="data"
                :headers="headers"
        />
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron';
    import CTable from "@/components/CTable";

    export default {
        name: "StoredMusic",
        components: {CTable},
        created() {
            console.log('created')
            ipcRenderer.on('song-db-list', (e, data) => {
                this.data = data;
            });
            ipcRenderer.on('openFileDialog', (e, folderPath) => {
                this.downloadPath = folderPath;
            });
            ipcRenderer.on('delete-song', (e, statusCode) => {
                if(statusCode === 200) {
                    ipcRenderer.send('song-db-list')
                }
            });
        },
        mounted() {
            ipcRenderer.send('song-db-list')
        },
        destroyed() {
            console.log('destroyed')
            ipcRenderer.removeAllListeners('song-db-list')
        },
        data() {
            return {
                headers: [
                    { text: '',       value: 'albumCoverUrl', type: 'image', width: 50, height: 50 },
                    { text: 'song',   value: 'songName',      type: 'string' },
                    { text: 'artist', value: 'artistName',    type: 'string' },
                    { text: 'delete', value: 'delete',        type: 'button', click: this.onDelete, width: 10 },
                    { text: 'download', value: 'download',    type: 'button', click: this.onClick, width: 20 }
                ],
                downloadPath: undefined,
                data : []
            }
        },
        methods: {
            openFileDialog() {
                ipcRenderer.send('openFileDialog')
            },
            onClick(data) {
                if (this.downloadPath) {
                    console.log(data)
                    data.downloadPath = this.downloadPath;
                    ipcRenderer.send('download-song', data);
                } else {
                    alert('select downloadPath!');
                }
            },
            onDelete(data) {
                ipcRenderer.send('delete-song', data);
            }

        }
    }
</script>

<style scoped>

</style>