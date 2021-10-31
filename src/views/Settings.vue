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
import { ref, defineComponent, onMounted, onUnmounted } from '@vue/composition-api';
import Event from '@/Event';
const { ipcRenderer } = window.require('electron');

export default defineComponent({
  name: 'Settings',
  setup () {
    const settings = ref([]);
    onMounted(() => {
      ipcRenderer.on(Event.EVENT_FETCH_SETTINGS, renderSettings);
      ipcRenderer.send(Event.EVENT_FETCH_SETTINGS);
    });
    onUnmounted(() => {
      ipcRenderer.removeAllListeners(Event.EVENT_FETCH_SETTINGS);
    });
    const renderSettings = (e, newSettings) => {
      console.log('setting received');
      console.log(newSettings);
      settings.value = newSettings;
    };
    const onSettingChange = (index, value) => {
      settings.value[index].value = value;
      ipcRenderer.send(Event.EVENT_UPDATE_SETTING, settings.value[index]);
      console.log(settings.value);
    };
    return {
      settings,
      onSettingChange
    };
  }
});
</script>

<style scoped>

</style>
