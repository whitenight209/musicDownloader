<template>
  <div>
    <v-container>
      <v-row >
        <v-col>
          <v-text-field
            v-model="songName"
            :rules="nameRules"
            label="노래 이름"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn>search</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'BugsSearch',
  data () {
    return {
      songName: ''
    };
  }
};
</script>

<style scoped>

</style>
