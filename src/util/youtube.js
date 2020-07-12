import { spawn } from 'child_process';
import { YOUTUBE_URL } from '@/util/properties';
import Logger from '@/Logger';
export const downloadYoutube = (libPath, youtubeId, duration, downloadPath, fileName) => {
  return new Promise((resolve, reject) => {
    const logger = new Logger();
    const youtubeCommand = makeCommand(libPath, youtubeId, duration, downloadPath, fileName);
    const youtubeDl = spawn(youtubeCommand.command, youtubeCommand.args);
    youtubeDl.stdout.on('data', (data) => {
      logger.debug(`stdout: ${data}`);
    });

    youtubeDl.stderr.on('data', (data) => {
      logger.debug(`stderr: ${data}`);
    });

    youtubeDl.on('close', (code) => {
      logger.debug(`child process exited with code ${code}`);
      resolve(`${downloadPath}/${youtubeId}.mp3`);
    });
    youtubeDl.on('error', (err) => {
      logger.debug(err);
      reject(err);
    });
  });
};
const makeCommand = (libPath, youtubeId, duration, downloadPath, fileName) => {
  const command = `${libPath}/youtube-dl`;
  const args = [];
  args.push('--extract-audio');
  args.push('--audio-format');
  args.push('mp3');
  args.push('--audio-quality');
  args.push('0');
  args.push('--ffmpeg-location');
  args.push(libPath);
  args.push('-o');
  args.push(`${downloadPath}/${youtubeId}.%(ext)s`);
  args.push(`${YOUTUBE_URL}${youtubeId}`);
  // TODO : 나중에 duration 설정도 가능하게 변경 할 것.
  // args.push('--postprocessor-args');
  // args.push('-t');
  // args.push(`${duration}`);
  return { command, args };
};
export default {
  downloadYoutube
};
