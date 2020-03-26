<template>
    <div>
        {{data}}
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron';

    export default {
        name: "StoredMusic",
        created() {
            console.log('created')
            ipcRenderer.on('song-db-list', (e, data) => {
                this.data = data;
            })
        },
        mounted() {
            ipcRenderer.send('song-db-list')
        },
        data() {
            return {
                data : []
            }
        },
        destroyed() {
            console.log('destroyed')
            ipcRenderer.removeAllListeners('song-db-list')
        }
    }
</script>

<style scoped>

</style>