const CopyPlugin = require('copy-webpack-plugin');
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
        },
        {
          from: 'src/libs',
          to: 'libs',
          toType: 'dir',
        }
      ]),
    ]
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        extraResources: [
            'src/db/music.db',
            'src/libs/*'
        ]
      }
    }
  }
}