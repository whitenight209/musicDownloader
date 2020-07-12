import { parseFile } from 'music-metadata';

export const musicFileParse = (filePath) => {
  return parseFile(filePath);
};
