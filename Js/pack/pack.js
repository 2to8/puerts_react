// pack
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const presetEnv = require('@babel/preset-env');

const utils = require('./pack_utils');
const config = require('./pack_config');

const presetEnvPlugin = [presetEnv, config.presetEnvOption]

const isDev = !utils.isArg('-build');

function getSourceMapRelativeCodePath(filename) {
    let inputPath = getInputCodeAbsPath(filename);
    let outputPath = path.dirname(getSourceMapAbsPath(filename));
    return path.relative(outputPath, inputPath);
}
function getSourceMapAbsPath(filename) {
    return path.join(__dirname, config.outputPath, filename + ".map");
}
function getInputCodeAbsPath(filename) {
    return path.join(__dirname, config.rootPath, filename);
}
function getOutputCodeAbsPath(filename) {
    let name = path.parse(filename).name;
    return path.join(__dirname, config.outputPath, path.dirname(filename), name + '.js');
}

function createAsset(filename) {
    const filepath = getInputCodeAbsPath(filename);
    if (!fs.existsSync(filepath)) {
        console.log(filepath + " notfound");
        return;
    }
    let { code, map } = babel.transformFileSync(filepath, {
        presets: [presetEnvPlugin],
        sourceMaps: isDev,
        sourceRoot: '',
        // sourceFileName: path.basename(filename),
        // plugins: []
    });
    if (isDev) {
        const codePath = getSourceMapRelativeCodePath(filename).replace(/\\/g, "/");
        map.sources = [codePath];
        map.file = path.basename(getOutputCodeAbsPath(filename)).replace(/\\/g, "/");
        code += "\n" + "//# sourceMappingURL=" + path.basename(getSourceMapAbsPath(filename));
    }
    return { filename, code, map };
}

const codeExts = [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
]

function createFile(filePath, content) {
    const dir = path.dirname(filePath);
    utils.createDir(dir);
    fs.writeFileSync(filePath, content);
}
function copyFile(filePath, toPath) {
    const dir = path.dirname(toPath);
    utils.createDir(dir);
    fs.copyFileSync(filePath, toPath);
}

// 打包
function pack() {
    const outputFolder = path.join(__dirname, config.outputPath);
    const inputFolder = path.join(__dirname, config.rootPath);
    utils.clearDir(outputFolder);
    utils.createDir(outputFolder);
    utils.forEachDir(inputFolder, false, config.ignoreNames, file => {
        let ext = path.extname(file);
        if (codeExts.indexOf(ext) >= 0) {
            const asset = createAsset(file);
            createFile(getOutputCodeAbsPath(asset.filename), asset.code);
            if (isDev) {
                createFile(getSourceMapAbsPath(asset.filename), JSON.stringify(asset.map));
            }
        } else {
            copyFile(path.join(inputFolder, file), path.join(outputFolder, file));
        }
    });
    console.log('------------ generate code success ! ------------');
    // npm install --production
    utils.runCmd('npm install --production', outputFolder);
    console.log('------------ pack success ! ------------');
}

pack()
