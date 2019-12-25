import fs from 'fs';

export const stripString = (string) => {
    return ( string || '' ).replace( /^\s+|\s+$/g, '' );
}

export const readFilePromise = (filePath) => {
    return new Promise( (resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            resolve(data)
        })
    })
}