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
        // extraResources: [
        //   "db/music.db",
        //   'lib/youtube-dl',
        //   'conf/'
        // ],
        extraResources: [
          {
            "from": "lib/${os}/",
            "to": "lib"
          },
          "db/music.db",
          'conf/'
        ]
      },
      externals: ['knex', 'sqlite3'],

    }
  }
};
