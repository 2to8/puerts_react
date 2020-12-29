// pack
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');  // 解析ast
const traverse = require('@babel/traverse').default; // 遍历ast
const babel = require('@babel/core');

const utils = require('./pack_utils');
const config = require('./pack_config');

var srcPath = path.join(__dirname, config.srcPath);
var mainPath = path.join(srcPath, config.mainPath);
var outputPath = path.join(__dirname, config.outputPath);

let ID = 0;

function createAsset(filename) {
    if (!fs.existsSync(filename)) {
        console.log(filename + " notfound");
        return;
    }
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = parser.parse(content, {  // 解析出抽象语法树
        sourceType: 'module',
    });
    const dependencies = [];
    traverse(ast, {  // 遍历解析完成的抽象语法树，查找依赖
        ImportDeclaration: ({ node }) => {
            dependencies.push(node.source.value);
        }
    });
    const option = {

    }
    const { code } = babel.transformFromAstSync(ast, null, {  // 转换ast代码
        presets: ['@babel/preset-env'],
        // plugins: []
    })
    let id = ID++;
    return {
        id,
        filename,
        code,
        dependencies,
    }
}

function createGraph(entry) {
    const mainAsset = createAsset(entry);
    const queue = [mainAsset];
    for (const asset of queue) {
        const dirname = path.dirname(asset.filename);
        asset.mapping = {};
        asset.dependencies.forEach(relativePath => {
            const absolutePath = path.join(dirname, relativePath);
            const child = createAsset(absolutePath);
            asset.mapping[relativePath] = child ? child.id : '';
            if (child) {
                queue.push(child);
            }
        });
    }
    return queue;
}

function bundleOne(mod) {
    const result = {};
    result.code = mod.code;
    return result;
}

function bundle(entry) {
    const graph = createGraph(entry);
    let modules = [];
    graph.forEach(mod => {
        const module = bundleOne(mod);
        if (module) {
            modules.push(module);
        }
    });
    const result = modules;
    return result;
}

function build(entry) {
    const data = bundle(entry);

    console.log(data);
}

build(mainPath);
