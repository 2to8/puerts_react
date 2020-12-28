var utils = {};

const fs = require('fs');

utils.isArg = function (argName) {
    var args = process.argv;
    for (var i = 0; i < args.length; i++) {
        let option = args[i];
        if (option.indexOf(argName) == 0) {
            return true;
        }
    }
    return false;
}

utils.clearDir = function (path) {
    console.log("clear path : " + path)
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
    }
}

utils.delDir = function (path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}

module.exports = utils;