<template>
    <div>
      <v-checkbox v-model="value"></v-checkbox>
    </div>
</template>

<script>
export default {
  name: 'CheckBox',
  props: {
    keyValue: {
      type: Number || String,
      required: true
    },
    initValue: {
      type: Boolean
    }
  },
  data () {
    return {
      value: this.initValue
    };
  },
  watch: {
    value (state) {
      this.$emit('change', state);
    }
  }
};
</script>

<style scoped>

</style>
