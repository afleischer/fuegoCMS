var HTMLWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/index.html',
    filename: 'index.html',
    inject: 'body'
});

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
    },
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
    }
        ]
    },
    devServer : {
        proxy: {
            'src': 'http://localhost:3000'
        }
    },
    output: {
        filename: 'transformed.js',
        path: __dirname + '/build'
    },
    mode: 'development',
    plugins: [HTMLWebpackPluginConfig],
    devtool: "inline-source-map"
};

