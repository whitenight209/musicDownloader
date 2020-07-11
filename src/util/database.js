const insertMusic = (db, { bugsId, songName, youtubeId, artistName, albumName, albumCoverImage, albumId, duration }) => {
  return db('music').insert({ bugsId, name: songName, youtubeId, artistName, albumName, albumCoverImage, albumId, duration });
};
const selectMusic = (db, { page = 0, offset = 30 }) => {
  const startIndex = page * offset;
  const limit = startIndex + offset;
  console.log(`select music ${startIndex}, ${limit}`);
  return db.select('*').from('music').offset(startIndex).limit(limit);
};
const selectMusicById = (db, musicId) => {
  return db.select('*').from('music').where({ id: musicId });
};
export default {
  insertMusic,
  selectMusic,
  selectMusicById
};
