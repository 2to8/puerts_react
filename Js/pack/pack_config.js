
var config = {
    srcPath: '../src',
    mainPath: 'main.js', // 入口文件
    outputPath: '../build', // 输出路径
    presetEnvOption: {
        targets: {
            node: "10",
        },
    }
};

module.exports = config;
