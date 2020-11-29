const insertMusic = (db, { bugsId, songName, youtubeId, artistName, albumName, albumCoverImage, albumId, duration, lyrics }) => {
  return db('music').insert({ bugsId, name: songName, youtubeId, artistName, albumName, albumCoverImage, albumId, duration, lyrics });
};
const selectMusic = (db, { page = 0, offset = 50 }) => {
  const startIndex = page * offset;
  const limit = startIndex + offset;
  console.log(`select music ${startIndex}, ${limit}`);
  return db.select('*').from('music').offset(startIndex).limit(limit);
};
const selectAllMusic = (db) => {
  return db.select('*').from('music');
}
const selectMusicTotalCount = db => {
  return db.count('*', { as: 'count' }).from('music');
}
export const selectMusicById = (db, musicId) => {
  return db.select('*').from('music').where({ id: musicId });
};
export const deleteMusic = (db, musicId) => {
  return db('music').where({ id: musicId }).del();
};

export default {
  insertMusic,
  selectMusic,
  selectMusicById,
  deleteMusic,
  selectMusicTotalCount,
  selectAllMusic
};
