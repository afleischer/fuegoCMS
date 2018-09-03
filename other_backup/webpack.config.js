var HTMLWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/index.html',
    filename: 'index.html',
    inject: 'body'
});

const client = {
    entry: {
        'client': './index.js'
    },
    target: 'web',
    output:{
        filename: '[name].js',
        path: path.resolve(__dirname, 'translated')
    },
    mode: 'development',
    plugins: [HTMLWebpackPlugin],
    {
            rules: [
        {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            presets: ['react', 'es2015', 'stage-0']
          }
        }
            ]
    }
}

const server= {
    entry: {
        'server' : 'src/server.js'
    },
    target: 'node',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'translated')
    },
    {
            rules: [
        {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            presets: ['react', 'es2015', 'stage-0']
          }
        }
            ]
    }
}

module.exports = [client, server];

/*
module.exports = {
    entry: __dirname + '/index.js',
    module: {
        rules: [
    {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    query: {
        presets: ['react', 'es2015', 'stage-0']
      }
    }
        ]
    },
    output: {
        filename: 'transformed.js',
        path: __dirname + '/build'
    },
    mode: 'development',
    plugins: [HTMLWebpackPluginConfig],
    devtool: "inline-source-map"
};

*/