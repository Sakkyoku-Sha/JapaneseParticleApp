const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')

module.exports = defineConfig({
  publicPath: './',
  transpileDependencies: true,
  configureWebpack:{
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_OPTIONS_API__': JSON.stringify(true),
        '__VUE_PROD_DEVTOOLS__': JSON.stringify(false),
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false)
      })
    ],
    devtool: 'source-map',
    resolve: {
      alias:{
        path: 'path-browserify',
        '@': path.resolve(__dirname, 'src/'),
      },
      fallback: {
        path: require.resolve("path-browserify")
      },
    },
  },
})
