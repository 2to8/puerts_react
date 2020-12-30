
var config = {
    rootPath: '../',
    outputPath: '../build', // 输出路径
    ignoreNames: [
        'pack',
        'node_modules',
        'build',
    ],
    presetEnvOption: {
        targets: {
            node: "10",
        },
    }
};

module.exports = config;
