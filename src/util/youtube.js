import { spawn } from 'child_process';
import { YOUTUBE_URL } from '@/util/properties';
import Logger from '@/Logger';
export const downloadYoutube = (callBack, musicId, libPath, youtubeId, duration, downloadPath, fileName) => {
  return new Promise((resolve, reject) => {
    const outputAnalyzer = (output) => {
      console.log(output);
      const downloadPercentage = output.match(/[0-9]*\.[0-9]*%/);
      if (downloadPercentage) {
        const percentageStr = downloadPercentage[0];
        let percentage = percentageStr.substring(0, percentageStr.length - 1);
        percentage = parseFloat(percentage);
        // console.log(percentage);
        // console.log(typeof percentage);
        console.log(percentage / 2);
        return percentage / 2;
      }
      return null;
    };
    const logger = new Logger();
    const youtubeCommand = makeCommand(libPath, youtubeId, duration, downloadPath, fileName);
    const youtubeDl = spawn(youtubeCommand.command, youtubeCommand.args);
    youtubeDl.stdout.on('data', (data) => {
      const percentage = outputAnalyzer(data.toString());
      if (percentage) {
        callBack(musicId, percentage);
      }
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
  args.push('1');
  args.push('--ffmpeg-location');
  args.push(libPath);
  args.push('-o');
  args.push(`${downloadPath}/${youtubeId}.%(ext)s`)
  args.push(`${YOUTUBE_URL}${youtubeId}`);
  args.push('--postprocessor-args');
  args.push(` -t ${duration}`);
  return { command, args };
};
export default {
  downloadYoutube
};
