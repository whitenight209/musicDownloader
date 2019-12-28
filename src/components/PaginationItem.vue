<template>
    <v-btn x-small @click="onClick" :color="computedButtonColor" depressed :ripple="false" :retain-focus-on-click="false" class="v-pagination__item">{{index}}</v-btn>
</template>

<script>
    export default {
        name: "PaginationItem",
        props: {
            index: {
              type: String,
              required: true
            },
            isSelected: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            computedButtonColor() {
                return this.isSelected ? 'primary' : '';
            }
        },
        methods: {
            onClick() {
                this.$emit('click', this.index);
            }
        }
    }
</script>

<style scoped>

</style>