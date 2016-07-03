var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var path = require('path');

module.exports = {
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/^\.\/layout$/, 'custom-layout')
    ],
    resolve: {
        alias: {
            'custom-layout': path.resolve('.storybook/layout/index.js')
        }
    },
    module: {
        loaders: [
            {
                test: /(\.scss)$/,
                loaders: ['style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]!postcss!sass?sourceMap']
            },
            {
                test: /(\.css)$/,
                loaders: ['style', 'css']
            }
        ]
    },
    postcss: [autoprefixer]
}
