const path = require('path')

const base = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}

const esnext = {
  ...base,
  experiments: {
    outputModule: true
  },
  entry: {
    'esm/index': path.join(__dirname, 'src', 'esm', 'index.ts'),
    'esm/raw/index': path.join(__dirname, 'src', 'esm', 'raw', 'index.ts')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      type: 'module'
    }
  },
}

const umd = {
  ...base,
  entry: {
    'umd/index': path.join(__dirname, 'src', 'umd', 'index.ts'),
    'umd/raw/index': path.join(__dirname, 'src', 'umd', 'raw', 'index.ts')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      type: 'umd',
      name: 'NodeRelation'
    },
    globalObject: 'this'
  },
}

module.exports = [
  umd,
  esnext
]