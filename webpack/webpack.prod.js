/* eslint-disable strict */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

const projectBasePath = path.resolve(__dirname, '..');

// `-p` in `start` npm task makes argv.mode = 'production'
const webpackProd = (env, argv) => merge(common({ THREADS: true }), {
    mode: 'production',
    stats: 'errors-warnings',
    devtool: 'source-map',
    optimization: {
        minimize: false,
        runtimeChunk: false,
        usedExports: false,
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /node_modules/,
                    filename: 'vendor.bundle.js',
                    name: 'vendor',
                    priority: -10
                }
            },
            chunks: 'all',
            maxSize: 500000000,
            automaticNameDelimiter: '.'
        }
    },
    plugins: [
        new ESLintPlugin({
            context: projectBasePath,
            extensions: ['js', 'ts'],
            files: [
                'app/**',
                'test/**'
            ],
            exclude: [
                'node_modules',
                'scripts',
                'dist'
            ],
            failOnError: false, // enable when code is ready
            threads: true
        }),
        new webpack.DefinePlugin({
            __TEST_MODE__: JSON.stringify(false)
        })
    ]
});

module.exports = webpackProd;
