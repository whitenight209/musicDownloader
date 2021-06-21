<template>
    <div>
      Settings
      <div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>id</th>
                <th class="text-left">
                  name
                </th>
                <th>
                  description
                </th>
                <th>value</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="index" v-for="(setting, index) in settings">
                <td>{{setting.setting_id}}</td>
                <td>
                  {{setting.name}}
                </td>
                <td>
                  {{setting.description}}
                </td>
                <td>
                  <template v-if="setting.value_type === 'boolean'">
                    <v-checkbox
                      :input-value="setting.value === 'true'"
                      @change="(e) => {
                        onSettingChange(index, e);
                      }"
                    />
                  </template>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </div>
</template>

<script>
import Event from '@/Event';
const { ipcRenderer } = window.require('electron');

export default {
  name: 'Settings',
  components: {

  },
  data () {
    return {
      settings: []
    };
  },
  created () {
    ipcRenderer.on(Event.EVENT_FETCH_SETTINGS, this.renderSettings);
  },
  mounted () {
    console.log('mounted');
    ipcRenderer.send(Event.EVENT_FETCH_SETTINGS);
  },
  beforeDestroy () {
    ipcRenderer.removeAllListeners(Event.EVENT_FETCH_SETTINGS);
  },
  methods: {
    renderSettings (e, data) {
      this.settings = data;
    },
    onSettingChange (index, value) {
      this.settings[index].value = value;
      this.sendSettingData(this.settings[index]);
      console.log(this.settings);
    },
    sendSettingData (setting) {
      console.log(setting);
      ipcRenderer.send(Event.EVENT_UPDATE_SETTING, setting);
    }
  }
};
</script>

<style scoped>

</style>
