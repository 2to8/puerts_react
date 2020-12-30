
var config = {
    rootPath: '../',
    outputPath: '../build', // 输出路径
    ignoreNames: [
        'pack',
        'node_modules',
        'build',
    ],
    delFolders: ['node_modules/.bin'], // 打包完成后自动删除的文件夹列表
    delFiles: [ // 打包完成后自动删除的文件列表
        'package.json',
        'package-lock.json',
        'tsconfig.json'
    ],
    codeExtension: [ // 需要解析代码的扩展名
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
    ],
    presetEnvOption: {
        targets: {
            node: "10",
        },
    }
};

module.exports = config;
