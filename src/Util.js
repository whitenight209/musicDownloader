import zlib from 'zlib';
export const compress = (data) => {
  return new Promise((resolve, reject) => {
    zlib.gzip(data, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(`after compression ${data.length}`);
        resolve(data);
      }
    }
    );
  });
};
export const generateMp3FileName = (artistName, musicName) => {
  return `${artistName.replace(' ', '_')}_${musicName.replace(' ', '_')}.mp3`;
};

export default {
  compress,
  generateMp3FileName
};
