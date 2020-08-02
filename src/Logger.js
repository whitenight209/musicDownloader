import fs from 'fs';

export default class Logger {
  constructor (fileLocation, isProduction) {
    if (!Logger.instance) {
      this.fileLocation = fileLocation;
      this.isProduction = isProduction;
      if (this.isProduction) {
        this.writer = fs.openSync(this.fileLocation, 'a');
      }
      Logger.instance = this;
    }
    return Logger.instance;
  }

  write (message) {
    fs.appendFileSync(this.writer, message, 'utf8');
  }

  debug (message) {
    if (this.isProduction) {
      this.write(message);
    } else {
      console.log(message);
    }
  }
}