const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const projectBasePath = path.resolve(__dirname, '..');

const distPath = path.resolve(projectBasePath, 'dist');
const srcPath = path.resolve(projectBasePath, 'app');
const envPath = path.resolve(projectBasePath, 'env');
const testPath = path.resolve(projectBasePath, 'test');

const LABELS = {
    t: {
        endpoints: ['t.com'],
        color: '#0431b8'
    }
};

const allTemplates = [].concat.apply(
    [],
    Object.keys(LABELS).map((labelName) => {
        return [
            {
                label: 'dev',
                title: 't.com',
                template: path.resolve(projectBasePath, 'app/index.live.webpack.ejs'),
                filename: `index.html`
            },
            {
                label: labelName,
                title: 't.com',
                template: path.resolve(projectBasePath, 'app/index.live.webpack.ejs'),
                filename: `index.live.${labelName}.html`
            },
        ];
    })
);

const buildTemplateParams = (label) => {
    const params = {
        LABEL: label
    };
    if (LABELS[label]) {
        params.THEMECOLOR = LABELS[label].color
    } else {
        params.THEMECOLOR = '#000'
    }
    return params
};

module.exports = ({ DEV = false, TARGET = 't', THREADS = false }) => ({
    entry: {
        platform: path.resolve(projectBasePath, 'app/import.ts')
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                include: [
                    path.resolve(srcPath, 'atomic-components/'),
                    path.resolve(srcPath, 'components/'),
                    path.resolve(srcPath, 'error/')
                ],
                oneOf: [
                    {
                        // Example: require('./foo.html?external')
                        resourceQuery: /external/,
                        type: 'asset/resource',
                        generator: {
                            filename: '[path][name][ext]'
                        }
                    },
                    {
                        // Example: require('./foo.html')
                        use: [
                            ...(THREADS ? ['thread-loader'] : []),
                            {
                                loader: 'html-loader',
                                options: {
                                    esModule: false,
                                    sources: {
                                        urlFilter: (attribute, value, resourcePath) => {
                                            // The `attribute` argument contains a name of the HTML attribute.
                                            // The `value` argument contains a value of the HTML attribute.
                                            // The `resourcePath` argument contains a path to the loaded HTML file.
                                            if (/\/staticfiles/.test(value)) {
                                                return false;
                                            }
                                            return true;
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                include: [srcPath, envPath],
                use: [
                    ...(THREADS ? ['thread-loader'] : []),
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                            transpileOnly: true,
                            experimentalWatchApi: true
                        }
                    }
                ]
            },
        ]
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
        pathinfo: false,
        path: distPath
    },
    plugins: [
        new HtmlWebpackPlugin({
            ...allTemplates.find((obj) => obj.label === TARGET),
            templateParameters: buildTemplateParams(TARGET)
        }),
    ],
    resolve: {
        cacheWithContext: false,
        symlinks: false,
        alias: {
            '@': path.resolve(srcPath),
        },
        extensions: [
            '.tsx',
            '.ts',
            '.js',
            '.html'
        ]
    }
});
