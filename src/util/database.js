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
};
const selectMusicTotalCount = db => {
  return db.count('*', { as: 'count' }).from('music');
};
export const selectMusicById = async (db, musicId) => {
  const result = await db.select('*').from('music').where({ id: musicId });
  return result ? result[0] : {};
};
export const deleteMusic = (db, musicId) => {
  return db('music').where({ id: musicId }).del();
};
export const selectSettings = (db) => {
  return db.select('setting_id', 'name', 'description', 'value', 'value_type').from('settings').where({ is_active: true });
};
export const updateSetting = (db, setting) => {
  const settingId = setting.setting_id;
  const value = setting.value;
  console.log(setting);
  console.log(`value ${value}`);
  return db('settings').update({ value: value.toString() }).where({ setting_id: settingId });
};
export const insertDownloadMusicData = (db, musicId, musicData) => {
  return db('download_music').insert({ music_id: musicId, music_data: musicData });
};

export const selectCachedMusicDataById = async (db, musicId) => {
  const result = await db.select('music_data').from('download_music').where({ music_id: musicId });
  return result[0] ? result[0].music_data : undefined;
};

export const checkAlreadyDownloadedMusic = async (db, musicId) => {
  const result = await db('download_music').count('music_id', { as: 'count' }).where({ music_id: musicId });
  return result[0].count;
};
export const updateMusicData = (db, musicId, musicData) => {
  return db('download_music').update({ music_data: musicData }).where({ music_id: musicId });
};

export const getSettingById = async (db, settingId) => {
  const result = await db.select('setting_id', 'name', 'description', 'value', 'value_type').from('settings').where({ setting_id: settingId });
  return result[0];
};
export const upsertDownloadPath = async (db, downloadPath) => {
  
    //insert
};
export default {
  insertMusic,
  selectMusic,
  selectMusicById,
  deleteMusic,
  selectMusicTotalCount,
  selectAllMusic,
  selectSettings,
  updateSetting,
  insertDownloadMusicData,
  checkAlreadyDownloadedMusic,
  updateMusicData,
  getSettingById,
  selectCachedMusicDataById
};
