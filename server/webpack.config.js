var path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    // externals: [{ 'express': { commonjs: 'express' } }],
    entry: {
        'index': './index.ts',
    },
    target: 'node',
    resolve: {
        alias: {
          data: '/data',
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        projectReferences: true,
                    },
                },
                exclude: /node_modules/,
                
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
        new CopyPlugin({
           patterns: [
              {from: path.join(__dirname, "../app/build"), to:  path.join(__dirname, "../dist/build")},
            ]
        })
     ],
     output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
};
