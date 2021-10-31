import ID3Writer from 'browser-id3-writer';
import fs from 'fs';
export const writeMetaData = (musicFilePath, title, artist, album, imageData, lyrics = '', bugsId, youtubeId) => {
  const songBuffer = fs.readFileSync(musicFilePath);
  const writer = new ID3Writer(songBuffer);
  writer.setFrame('TIT2', title)
    .setFrame('WORS', bugsId)
    .setFrame('WOAS', youtubeId)
    .setFrame('TPE1', [artist])
    .setFrame('TALB', album)
    .setFrame('APIC', {
      type: 3,
      data: imageData,
      description: ''
    }).setFrame('USLT', {
      description: '',
      lyrics: lyrics || '',
      language: 'eng'
    });
  writer.addTag();
  const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
  fs.writeFileSync(musicFilePath, taggedSongBuffer);
};
