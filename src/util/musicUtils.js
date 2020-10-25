import NodeID3 from 'node-id3';

export const writeMetaData = (musicFilePath, title, artist, album, imageData, lyrics = '') => {
  NodeID3.write({
    title,
    artist,
    album,
    image: imageData,
    USLT: lyrics
  }, musicFilePath);
};
