import { spawn } from 'child_process';
import { YOUTUBE_URL } from '@/util/properties';
import Logger from '@/Logger';
export const downloadYoutube = (libPath, youtubeId, duration, downloadPath, fileName) => {
  return new Promise((resolve, reject) => {
    const youtubeCommand = makeCommand(libPath, youtubeId, duration, duration, downloadPath, fileName);
    const youtubeDl = spawn(youtubeCommand);
    youtubeDl.stdout.on('data', (data) => {
      Logger.debug(`stdout: ${data}`);
    });

    youtubeDl.stderr.on('data', (data) => {
      Logger.debug(`stderr: ${data}`);
    });

    youtubeDl.on('close', (code) => {
      Logger.debug(`child process exited with code ${code}`);
      resolve(code);
    });
    youtubeDl.on('error', (err) => {
      Logger.debug(err);
      reject(err);
    });
  });
};
const makeCommand = (libPath, youtubeId, duration, downloadPath, fileName) => {
  return `${libPath}/youtube-dl --extract-audio --audio-format mp3 --audio-quality 0 --ffmpeg-location ${libPath} -o '${downloadPath}/${fileName}.%(ext)s' ${YOUTUBE_URL}${youtubeId} --postprocessor-args "-t ${duration}"`;
};
export default {
  downloadYoutube
};
