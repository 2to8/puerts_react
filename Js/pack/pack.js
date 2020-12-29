// pack
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const presetEnv = require('@babel/preset-env');

const utils = require('./pack_utils');
const config = require('./pack_config');

var srcPath = config.srcPath;
var mainPath = path.join(srcPath, config.mainPath);
var outputPath = path.join(__dirname, config.outputPath);
const presetEnvPlugin = [presetEnv, config.presetEnvOption]

function createAsset(filename) {
    const filepath = path.join(__dirname, filename);
    if (!fs.existsSync(filepath)) {
        console.log(filepath + " notfound");
        return;
    }
    const { code, map } = babel.transformFileSync(filepath, {
        presets: [presetEnvPlugin],
        sourceMaps: true,
        sourceRoot: '',
        // sourceFileName: path.basename(filename),
        // plugins: []
    })
    return { filename, code, map };
}

// 打包
function pack(entry) {
    utils.clearDir(outputPath);
    utils.createDir(outputPath);
    const asset = createAsset(entry);
    console.log(asset);

    console.log('------------ success ------------');
}

pack(mainPath);
