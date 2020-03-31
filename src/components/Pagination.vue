<template>
    <div>
        <template v-for="page in items">
            <button style="width: 25px; height: 20px" :class="{ active: page.isSelected }" :key="page.index" @click="click(page)">{{page.index}}</button>
        </template>
    </div>
</template>

<script>
    export default {
        name: "Pagination",
        props: {
            items: {
                type: Array
            }
        },
        methods: {
            click(page) {
                this.$emit('click', page);
            }
        }
    }
</script>

<style scoped>
    button.active {
        color: red;
    }
</style>