<template>
    <div>
        <template v-for="(item, index) in items">
            <div :key="index">
                <TableItem :data="item" @click="onClick" :text="itemButtonText"/>
            </div>
        </template>
    </div>
</template>

<script>
    import TableItem from "@/components/TableItem";

    export default {
        name: "MusicTable",
        components: {TableItem},
        props: {
            items: {
                type: Array,
                required: true
            },
            itemButtonText: {
                type: String,
                default: 'add'
            }
        },
        data() {
            return {
                offset: 5
            }
        },
        methods: {
            onClick(data) {
                this.$emit('itemClick', data)
            },
            getMusicData(index) {
                return this.items.slice(index, index + this.offset)
            }
        }
    }
</script>

<style scoped>

</style>