<template>
  <v-data-table
    :items="items"
    :headers="headers"
    :items-per-page="offset"
    hide-default-footer
  >
    <template v-slot:item="{ item, headers }">
      <tr>
        <template v-for="(header, headerIndex) in headers">
          <img v-if="header.type === 'image'" class="d-block d-sm-table-cell" :key="headerIndex"  :src="item[header.value]" :width="header.width" />
          <td  v-else-if="header.type === 'button'" :key="headerIndex" :width="header.width ? header.width +'px' : '25px'"  class="d-block d-sm-table-cell">
            <v-btn @click="header.cback(item[header.value])" small color="secondary">
              <v-icon>{{header.icon}}</v-icon>
            </v-btn>
          </td>
          <td v-else class="d-block d-sm-table-cell"  :key="headerIndex" :align="header.align">{{item[header.value]}}</td>
        </template>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'Table',
  props: {
    items: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>

</style>
