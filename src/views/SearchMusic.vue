<template>
    <div>
        <div>
            <input v-model="searchInput" type="text"/>
            <button @click="searchMusic">search</button>
            {{items}}
        </div>
    </div>
</template>

<script>
    import {searchBugsSong} from '@/util/api';
    export default {
        name: "SearchMusic",
        data() {
            return {
                searchInput: '',
                items : []
            }
        },
        methods: {
            async searchMusic() {
                this.items = await searchBugsSong(this.searchInput);
            }
        }
    }
</script>

<style scoped>

</style>