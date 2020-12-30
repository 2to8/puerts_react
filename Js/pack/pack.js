// pack
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const presetEnv = require('@babel/preset-env');

const utils = require('./pack_utils');
const config = require('./pack_config');

const presetEnvPlugin = [presetEnv, config.presetEnvOption]

const isDev = !utils.isArg('-build'); // 是否是开发环境打包
const isNode = !utils.isArg('-nonode'); // 是否打包nodemodule

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
    console.log('\n------------ start generate code : ------------\n');
    const outputFolder = path.join(__dirname, config.outputPath);
    const inputFolder = path.join(__dirname, config.rootPath);
    utils.clearDir(outputFolder, isNode ? null : ['node_modules']);
    utils.createDir(outputFolder);
    let codeCount = 0;
    let copyCount = 0;
    utils.forEachDir(inputFolder, false, config.ignoreNames, file => {
        let ext = path.extname(file);
        if (config.codeExtension.indexOf(ext) >= 0) {
            const asset = createAsset(file);
            createFile(getOutputCodeAbsPath(asset.filename), asset.code);
            if (isDev) {
                createFile(getSourceMapAbsPath(asset.filename), JSON.stringify(asset.map));
            }
            codeCount++;
        } else {
            copyFile(path.join(inputFolder, file), path.join(outputFolder, file));
            copyCount++;
        }
    });
    console.log('------------ generate code success !  code : ' + codeCount + ', copy : ' + copyCount + ' ------------\n');

    if (isNode) {
        console.log('------------ start install npm dependent : ------------\n');
        // npm install --production
        utils.runCmd('npm install --production', outputFolder);
        console.log('\n------------ install npm dependent success ! ------------\n');
    }

    if (!isDev) {
        // console.log('------------ clear build temp : ------------\n');
        const delFolders = config.delFolders;
        let delFiles = config.delFiles;
        for (let i = 0; i < delFolders.length; i++) {
            utils.delDir(path.join(outputFolder, delFolders[i]));
        }
        for (let i = 0; i < delFiles.length; i++) {
            const file = path.join(outputFolder, delFiles[i]);
            if (fs.existsSync(file) && fs.statSync(file).isFile()) {
                fs.unlinkSync(file);
            }
        }
        // console.log('------------ clear build temp success ! ------------\n');
    }
    console.log('------------ pack success ! ------------\n');
}

pack()
