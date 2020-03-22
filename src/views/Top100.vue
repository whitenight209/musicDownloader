<template>
    <div>
        {{top100List}}
        <button @click="getTop100MusicList">increment</button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: "Top100",
        methods: {
            ...mapActions(['getTop100MusicList'])
        },
        computed: {
            ...mapGetters({top100List: 'getTop100'})
        }

    }
</script>

<style scoped>

</style>