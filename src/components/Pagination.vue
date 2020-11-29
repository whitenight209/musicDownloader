<template>
    <div class="d-flex justify-center mt-2">
      <template v-if="pages.length > 0">
        <template v-for="pagination in pages">
            <v-btn @click="onClick(pagination.index)" :color="isSelected(pagination.isSelected)" :key="pagination.index" class="mr-2" min-width="20" max-width="20">
            {{pagination.index}}
          </v-btn>
        </template>
      </template>
    </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pages: {
      type: Array,
      required: true
    }
  },
  methods: {
    isSelected (isSelected) {
      if (isSelected) {
        return 'primary';
      }
    },
    onClick (page) {
      this.$emit('click', page);
    }
  }
};
</script>

<style scoped>

</style>
