import fs from 'fs';
export const stripString = (string) => {
  return (string || '').replace(/^\s+|\s+$/g, '');
};

export const readFilePromise = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

export const sleep = (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};
export const utilBehindFromToday = (date) => {
  return null;
};
export const youtubeDurationConverter = (duration) => {
  let durationStr = duration.substring(2);
  durationStr = durationStr.replace(/H/, '시간');
  durationStr = durationStr.replace(/M/, '분');
  durationStr = durationStr.replace(/S/, '초');
  return durationStr;
};
export const bugsDurationConverter = (duration) => {
  const arr = duration.split(':');
  const minute = parseInt(arr[0]);
  const second = parseInt(arr[1]) + 1;
  return `${minute}분${second}초`;
};
