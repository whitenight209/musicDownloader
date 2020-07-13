import NodeID3 from 'node-id3';

export const writeMetaData = (musicFilePath, title, artist, album, imageData) => {
  NodeID3.write({
    title,
    artist,
    album,
    image: imageData
  }, musicFilePath);
};
