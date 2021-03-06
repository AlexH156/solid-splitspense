const path = require("path");
console.log('The code is executed at localhost:8080');
module.exports = {

    mode: "development",
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "index.js"
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }],
            },
            {
                test: /\.css$/,
                loader: 'css-loader',
                options: {
                    modules: {
                        mode: 'local',
                        localIdentName: '[local]--[hash:base64:5]',
                    },
                },
            },
        ],
    },
    devServer: {
        contentBase: "./",
        host: 'localhost',
        port: 8080
    },
    resolve: {
        fallback: {
            stream: require.resolve("stream-browserify"),
            crypto: require.resolve("crypto-browserify")
        }
    }

};