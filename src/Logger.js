import fs from 'fs';

export default class Logger {
  constructor (fileLocation, isProduction) {
    if (!Logger.instance) {
      this.fileLocation = fileLocation;
      this.isProduction = isProduction;
      if (this.isProduction) {
        // const isExists = fs.existsSync(this.fileLocation);
        // const time = new Date();
        // if (!isExists) {
        //   fs.utimesSync(this.fileLocation, time, time);
        // }
        this.writer = fs.openSync(this.fileLocation, 'w');
      }
      Logger.instance = this;
    }
    return Logger.instance;
  }

  debug (message) {
    const level = 'debug';
    this.write(level, message);
  }

  info (message) {
    const level = 'info';
    this.write(level, message);
  }

  log (message) {
    const level = 'log';
    this.write(level, message);
  }

  writeToFile (level, message) {
    fs.appendFile(this.writer, this.generateMessage(level, message), {}, () => {});
  }

  writeToConsole (level, message) {
    console.log(this.generateMessage(level, message));
  }

  write (level, message) {
    if (this.isProduction) {
      this.writeToFile(level, message);
    } else {
      this.writeToConsole(level, message);
    }
  }

  generateMessage (level, message) {
    return `[${level}] ${message}`;
  }
}
