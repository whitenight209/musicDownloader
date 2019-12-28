<template>
    <div>
        <v-container style="max-width: 800px">
            <v-row :cols="pageList.length">
                <template v-for="items in pageList">
                    <v-col :key="items.index" justify="center">
                        <PaginationItem :index="items.index" :is-selected="items.isSelected" @click="onClick"/>
                    </v-col>
                </template>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import PaginationItem from "@/components/PaginationItem";
    export default {
        name: "Pagination",
        components: {PaginationItem},
        props: {
            pageList: {
                type: Array,
                required: true
            }
        },
        methods: {
            onClick(data) {
                this.$emit('click', data)
            }
        }
    }
</script>

<style scoped>

</style>