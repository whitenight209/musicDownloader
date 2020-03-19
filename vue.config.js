const CopyPlugin = require('copy-webpack-plugin');
const MyPlugin = require('./src/build/plugin');
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    // Configuration applied to all builds
    plugins: [
      new CopyPlugin([
        {
          from: 'src/db',
          to: 'db',
          toType: 'dir',
          // transform: (content, path) => {
          //   console.log('db transform');
          //   console.log(content)
          //   return content;
          // }
        },
        {
          from: 'src/libs',
          to: 'libs',
          toType: 'dir',
        }
      ]),
     new MyPlugin(['dist_electron/bundled/libs'])
    ]
  },
  pluginOptions: {
    electronBuilder: {
      // chainWebpackMainProcess: config => {
        // Chain webpack config for electron main process only
      // },
      builderOptions: {
        extraResources: [
            'src/db/music.db',
            'src/libs/ffmpeg',
            'src/libs/youtube-dl'
        ]
      }
    }
  }
}