const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack:{
    resolve: {
      alias:{
        path: 'path-browserify'
      },
      fallback: {
        path: require.resolve("path-browserify")
      }
    }
  }
})
