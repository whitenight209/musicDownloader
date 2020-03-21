<template>
    <div>
        <div>{{count}}</div>
        <button @click="increment">increment</button>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "Top100",
        methods: {
            increment() {
                this.$store.commit('increment');
            }
        },
        computed: {
            ...mapGetters({count: 'getCount'})
        }

    }
</script>

<style scoped>

</style>