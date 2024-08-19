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
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false),
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY),
        'EXPRESS_SERVER_PORT': JSON.stringify(process.env.EXPRESS_SERVER_PORT),
        'FRONT_END_API_ADDRESS': JSON.stringify(process.env.FRONT_END_API_ADDRESS),
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
