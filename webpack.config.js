const path = require("path");

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
        port: 3000
    },
    resolve: {
        fallback: {
            stream: require.resolve("stream-browserify"),
            crypto: require.resolve("crypto-browserify")
        }
    }

};