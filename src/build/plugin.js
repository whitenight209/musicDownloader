const fs = require('fs');
const path = require('path');
class HelloWorldPlugin {
    constructor(paths = []) {
        this.paths = paths;
    }

    apply(compiler) {
        compiler.hooks.done.tap('CopyPlugin', () => {
            console.log('CopyPlugin closed')
            const basePath = compiler.options.context;
            for (const filePath of this.paths) {
                const fullFilePath = path.join(basePath, filePath);
                const fileList = fs.readdirSync(fullFilePath)
                for (const file of fileList) {
                    fs.chmodSync(path.join(fullFilePath, file), 0o775)
                }
            }
        });
    }
}


module.exports = HelloWorldPlugin;