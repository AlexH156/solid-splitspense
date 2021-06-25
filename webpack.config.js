const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  
   mode: "development",
   entry: "./index.js",
   output: {
     path: path.resolve(__dirname, "public"), 
     filename: "index.js" 
   },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ { loader: "style-loader" }, { loader: "css-loader" } ],
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
  },
  resolve: {
      fallback: { 
         stream: require.resolve("stream-browserify") ,
         crypto: require.resolve("crypto-browserify")
      }
  },
  plugins: [
    new NodePolyfillPlugin()
]
};