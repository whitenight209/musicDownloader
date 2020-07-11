module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    externals: {
      sqlite3: 'sqlite3'
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        extraResources: [
          'db/music.db',
          'lib/ffmpeg',
          'lib/youtube-dl'
        ]
      },
      externals: ['knex', 'sqlite3']
    }
  }
};
