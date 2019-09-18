"use strict";
const UglifyJSPlugin              = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin          = require('clean-webpack-plugin');
const ManifestPlugin              = require('webpack-manifest-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const BundleAnalyzerPlugin        = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isDevEnv                    = process.argv[1].indexOf('webpack-dev-server') > -1,
      // projConf = JSON.parse(fs.readFileSync('./.projrc', {flag: 'r+', encoding: 'utf8'}));
      projConf                    = require("./.projrc"),
      path                        = require('path'),
      webpack                     = require('webpack'),
      rules                       = require("./assets/webpack/rule"),
      entry                       = {},
      plugins                     = [
          new CleanWebpackPlugin(['dist/www']),
          new ManifestPlugin(),

      ],
      alias                       = {
          vue: 'vue/dist/vue.js'
      };
// const {VueLoaderPlugin}=require('vue-loader');
// plugins.push( new VueLoaderPlugin());
global.isDevEnv = isDevEnv;
// let rules = require('./webpack.rule.js');
/**
 * Created by evanmao on 2017/1/11.
 */
/**
 * 得到入口文件
 * @param as_dir
 * @returns {{}}
 */
let glob     = require("glob"),
    entryDir = './src/',
    entryArr = glob.sync("{[!$]**/!(*chunk),*}.js", {cwd: entryDir, matchBase: true}) || [];
entryArr.forEach(function (as_file) {
    let name;
    name        = as_file.substr(0, as_file.length - 3);
    entry[name] = entryDir + as_file;
});

/**
 * pages
 */
const viewDir           = path.resolve('./src').replace(/\\/g, '/'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      dirArr            = glob.sync("{[!$]**/*,*}@(.ejs|.html)", {cwd: viewDir}) || [],
      mid               = {manifest: 1, vendor: 2, comm: 3, comp: 4};
dirArr.forEach(function (as_file) {
    // console.log("as_file======================----------",as_file);
    let filename = as_file,
        fileExt  = filename.match(/[.]\w+$/)[0],
        chunk    = filename.substr(0, filename.length - fileExt.length);
    // if (!entry[chunk]) return;
    // console.log(viewDir + filename);
    let chunks = [];
    if (entry[chunk]) {
        chunks.push("manifest");//"vendor"
        chunks.unshift(chunk);
    }
    plugins.push(new HtmlWebpackPlugin({
        template      : viewDir + "/" + filename, // 源模板文件
        filename      : fileExt === ".html" ? filename : filename.replace(fileExt, ".html"),
        showErrors    : true,
        inject        : true,
        chunks        : chunks,//"manifest",
        // chunksSortMode: 'manual',
        chunksSortMode: function (m1, m2) {
            m1 = mid[m1.names[0]] || 100;
            m2 = mid[m2.names[0]] || 100;
            return m1 - m2;
        },
        minify        : {
            removeComments      : true,
            collapseWhitespace  : true,
            conservativeCollapse: true,
            preserveLineBreaks  : true
        },
        favicon       : projConf.page.favicon
        // options: {
        //     "entry": "assets/head_bundle.js",
        //     "css": [ "main.css" ]
        // }
    }));
});

// if (!global.isDevEnv) {
//     plugins.push(new UglifyJSPlugin({}));
// }

let webpackCfg = {
    entry       : entry,
    mode        : isDevEnv ? "development" : "production", // "production" | "development" | "none"
    devtool     : isDevEnv ? "cheap-module-source-map" : "",
    output      : {
        filename     : `$asset/script/[name].[${isDevEnv ? 'hash' : 'chunkhash'}:5].js`,
        path         : path.resolve(__dirname, "./dist/www"),
        chunkFilename: '$asset/script/chunk/[name].[chunkhash:5].js',
        publicPath   : "/"//可配置CDN地址
    },
    resolve     : {
        extensions: ['.js', '.vue', '.json'],
        alias     : alias
    },
    externals   : {
        subtract: {
            root: /asset\/lib\/vendor/,
        },
        vue     : "Vue"
    },
    module      : {
        rules: rules
    },
    plugins     : plugins,
    optimization: {
        runtimeChunk: {name: 'manifest'}
    }
};
plugins.push(new BundleAnalyzerPlugin({
    reportFilename: "../bundle-analyzer/reporter.html",
    analyzerPort  : "9021",
    analyzerMode  : "static",
    // analyzerMode     : "disabled",
    // analyzerMode  : "static",
    // generateStatsFile: true,
    openAnalyzer  : false,
    excludeAssets : ['node_modules', 'dev', 'vendor'],
    // excludeAssets : [/sockjs-client/]
}));
if (isDevEnv) {
    // let devCfg = projConf.dev;
    webpackCfg.devServer = {
        allowedHosts: ['sandbox.wxy.qq.com'],
        port        : 8082,
        https       : true
        // contentBase     : devCfg.contentBase || '/dist/www/',
        // host            : devCfg.addr || "127.0.0.1",
        // allowedHosts    : devCfg.allowedHosts,
        // "public"        : devCfg.host,
        // hot             : true,
        // inline          : true,
        // port            : devCfg.port || 9090,
        // https           : devCfg.https,
        // disableHostCheck: true
    };
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

plugins.push(new InlineManifestWebpackPlugin());
module.exports = webpackCfg;