const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        NodeRelation: path.join(__dirname, 'src', 'NodeRelation.ts')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        libraryExport: 'default',
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