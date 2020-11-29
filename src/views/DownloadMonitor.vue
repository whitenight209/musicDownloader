<template>
  <div>
    <v-data-table
      :items="processList"
      :headers="headers"
      hide-default-footer
    >
      <template v-slot:item="{ item, headers }">
        <tr>
          <template v-for="(header, headerIndex) in headers">
            <img v-if="header.type === 'image'" class="d-block d-sm-table-cell" :key="headerIndex"
                 :src="item[header.value]" :width="header.width"/>
            <td v-else-if="header.type ==='progress'" :key="headerIndex">
              <v-progress-circular :rotate="-90" :value="item[header.value]">
                {{item[header.value]}}
              </v-progress-circular>
            </td>
            <td v-else-if="header.type === 'button'" :key="headerIndex"
                :width="header.width ? header.width +'px' : '25px'" class="d-block d-sm-table-cell">
              <v-btn @click="header.cback(item[header.value])" small color="secondary">
                <v-icon>{{header.icon}}</v-icon>
              </v-btn>
            </td>
            <td v-else class="d-block d-sm-table-cell" :key="headerIndex" :align="header.align">{{item[header.value]}}
            </td>
          </template>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DownloadMonitor',
  computed: {
    ...mapGetters({
      processList: 'getProcessList'
    })
  },
  data () {
    return {
      headers: [
        { text: 'id', value: 'id', sortable: false },
        { text: '', value: 'albumCoverImage', sortable: false, type: 'image', width: '50px' },
        { text: 'songName', value: 'name', align: 'center', sortable: false },
        { text: 'artist', value: 'artistName', sortable: false },
        { text: 'album', value: 'albumName', sortable: false },
        { text: 'progress', value: 'progress', sortable: false, type: 'progress' }
      ]
    };
  },
  watch: {
    processList (test) {
      console.log('TEST');
    }
  }
};
</script>

<style scoped>

</style>
<!--
"id": 2, "name": "Monster", "bugsId": 75119500, "description": null, "youtubeId": "X1mSODr7BtM", "artistName": "Shawn Mendes(션 멘데스)", "albumName": "Monster", "albumCoverImage": "https://image.bugsm.co.kr/album/images/500/149375/14937502.jpg", "albumId": 75119500, "duration": "02:59", "lyrics": "You put me on a pedestal\nAnd tell me I'm the best\nRaise me up into the sky\nUntil I'm short of breath\nFill me up with confidence\nI say what's in my chest\nSpill my words and tear me\nDown until there's nothing left\nRearrange the pieces just\nTo fit me with the rest yeah\nBut what if I what if I trip?\nWhat if I what if I fall?\nThen am I the monster?\nJust let me know\nAnd what if I what if I sin?\nAnd what if I what if I break? Yeah\nThen am I the monster? Yeah\nJust let me know yeah\nI was fifteen\nWhen the world put me on a pedestal\nI had big dreams\nOf doin' shows and making memories\nMade some bad moves tryna act cool\nUpset by their jealousy\nLifting me up\n(Lifting me up) lifting me up\nAnd tearing me down\n(Down) tearing me down\n(Down down)\nI'll take responsibility\nFor everything I've done\nHolding it against me\n(Yeah) like you're the holy one\nI had a chip on my shoulder\nHad to let it go\n'Cause unforgiveness keeps them in control\nI came in with good\nIntentions then I let it go\nAnd now I really wanna know\nBut what if I what if I trip?\nWhat if I what if I fall?\nThen am I the monster?\nJust let me know\nAnd what if I what if I sin?\nAnd what if I what if I break?\nThen am I the monster?\nJust let me know\n(Oh please just let me know yeah)\nLa da da duh duh\n(But what if I fall?)\nLa da da duh duh duh na\nLa da da da duh duh\nLa da da duh duh duh na\nLa da da duh duh\n(Please don't let me fall)\nLa da da duh duh duh na\nLa da da da duh duh\n(Oh please don't let me fall)\nLa da da duh duh duh na", "progress": 50 -->
