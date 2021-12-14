/* eslint-disable no-console */
/* global __dirname, process, module */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const chalk = require('chalk');
const { parsed } = require('dotenv').config();
const ESLintPlugin = require('eslint-webpack-plugin');

const projectBasePath = path.resolve(__dirname, '..');

const targetLive = 'localhost:3000'
const targetLocal = 'localhost:3000'
const TARGET = 't'
const THREADS = 2
const LIVE = false

module.exports = (env, argv, TEST_MODE) =>
    merge(common({ DEV: true, TARGET: TARGET, THREADS: THREADS || !TEST_MODE }), {
        mode: 'development',
        devtool: true ? 'eval-source-map' : 'source-map',
        stats: 'errors-warnings',
        optimization: {
            runtimeChunk: false,
            usedExports: false,
            splitChunks: {
                chunks: 'all'
            }
        },
        devServer: {
            allowedHosts: [
                targetLive,
                targetLocal,
            ],
            devMiddleware: {
                index: true
            },
            client: {
                logging: 'error',
                overlay: false,
                progress: false
            },
            historyApiFallback: true,
            host: '0.0.0.0',
            hot: true,
            liveReload: true,
            onListening: (devServer) => {
                console.log(
                    chalk.blueBright(
                        `STATUS: ${LIVE ? chalk.redBright('Live') : 'Docker'} Mode`,
                        '\nENV:\n',
                        JSON.stringify(parsed, null, 4)
                    )
                );
                console.log('Listening on address:', devServer.server.address());
            },
            open: false,
            port: 3000,
            static: {
                directory: path.resolve(__dirname, '..', './dist')
            }
        },
        cache: {
            type: 'memory'
        },
        plugins: [
            new ESLintPlugin({
                context: projectBasePath,
                extensions: ['js', 'ts'],
                files: ['app/**', 'test/**'],
                exclude: ['node_modules', 'scripts', 'dist'],
                failOnError: false,
                lintDirtyModulesOnly: true,
                threads: true,
                formatter: 'codeframe',
                quiet: true
            }),
            new webpack.DefinePlugin({
                __TEST_MODE__: TEST_MODE || JSON.stringify(false)
            })
        ]
    });
