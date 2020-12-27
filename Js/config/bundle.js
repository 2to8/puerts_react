const Bundler = require('parcel-bundler');
const path = require('path');
const fs = require('fs');

// 单个入口文件路径
const entryFiles = path.join(__dirname, '../src/main.js');

var isBuild = false;
var args = process.argv;
for (var i = 0; i < args.length; i++) {
    let option = args[i];
    if (option.indexOf("-build") == 0) {
        isBuild = true;
    }
}


// Bundler 选项
const options = {
    outDir: './build', // 将生成的文件放入输出目录下，默认为 dist
    outFile: 'main.js', // 输出文件的名称
    publicUrl: '/', // 静态资源的 url ，默认为 '/'
    watch: false, // 是否需要监听文件并在发生改变时重新编译它们，默认为 process.env.NODE_ENV !== 'production'
    cache: true, // 启用或禁用缓存，默认为 true
    cacheDir: '.cache', // 存放缓存的目录，默认为 .cache
    contentHash: false, // 禁止文件名hash
    global: 'moduleName', // 在当前名字模块以UMD模式导出，默认禁止。
    minify: isBuild, // 压缩文件，当 process.env.NODE_ENV === 'production' 时，会启用
    scopeHoist: false, // 打开实验性的scope hoisting/tree shaking用来缩小生产环境的包。
    target: 'browser', // browser/node/electron, 默认为 browser
    bundleNodeModules: false, // 当package.json的'target'设置'node' or 'electron'时，相应的依赖不会加入bundle中。设置true将被包含。
    sourceMaps: !isBuild, // 启用或禁用 sourcemaps，默认为启用(在精简版本中不支持)
    // https: { // 设置true自动定义一对密钥和证书，false取消变成http
    //     cert: './ssl/c.crt', // 自定义证书路径
    //     key: './ssl/k.key' // 自定义密钥路径
    // },
    // logLevel: 3,
    // /**
    //  * 5 = 储存每个信息
    //  * 4 = 输出信息、警告和错误附加时间戳和dev服务的http请求
    //  * 3 = 输出信息、警告和错误
    //  * 2 = 输出警告和错误
    //  * 1 = 输出错误
    // */
    // hmr: true, // 开启或禁止HRM
    // hmrPort: 0, // hmr socket 运行的端口，默认为随机空闲端口(在 Node.js 中，0 会被解析为随机空闲端口)
    // hmrHostname: '', // 热模块重载的主机名，默认为 ''
    // detailedReport: false // 打印 bundles、资源、文件大小和使用时间的详细报告，默认为 false，只有在禁用监听状态时才打印报告
};

function delDir(path, isDelRoot) {
    console.log("删除build文件夹 : " + path)
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
        if (isDelRoot) fs.rmdirSync(path);
    }
}

async function build() {
    delDir(path.join(__dirname, "../", options.outDir), false);
    // 使用提供的入口文件路径和选项初始化 bundler
    const bundler = new Bundler(entryFiles, options);
    // 一旦 parcel 完成打包，会调用 bundled，主 bundle 会作为参数传递到该 callback
    bundler.on('bundled', (bundler) => {
        // bundler 包含所有资源和 bundle，如需了解更多请查看文档
    });
    // 每次构建结束后，都会调用 buildEnd，即使发生错误它也仍然会被触发
    bundler.on('buildEnd', () => {
        // 做一些操作……
    });
    // 首次构建会调用 buildStart，entryFiles数组作为参数传递给回调函数
    bundler.on('buildStart', entryPoints => {
        // 做一些操作……
    });
    // 构建中出现的错误都会调用 buildError，Error对象作为参数传递给回调函数。
    bundler.on('buildError', error => {
        // 做一些操作……
    });
    // 运行 bundler，这将返回主 bundle
    // 如果你正在使用监听模式，请使用下面这些事件，这是因为该 promise 只会触发一次，而不是每次重新构建时都触发
    const bundle = await bundler.bundle();
}



build();
