const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    'index': path.join(__dirname, 'src', 'index.ts'),
    'raw/index': path.join(__dirname, 'src', 'raw', 'index.ts')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'NodeRelation',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}