import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import BugsIcon from '@/components/BugsIcon';
Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
    values: {
      bugs: {
        component: BugsIcon
      }
    }
  }
});
