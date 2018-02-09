const fs = require('fs');
const path = require('path');
const zip = require('zip-webpack-plugin');

module.exports = function(env) {
  const lambdaFunctionsDir = path.join(__dirname, 'src');
  const functionsToBuild = env && env.fxn ? env.fxn.split(",") : fs.readdirSync(lambdaFunctionsDir).filter(item => item.endsWith(".function.ts"));
  console.log(`Building ${functionsToBuild.join(", ")}`);

  return functionsToBuild.map(fxn => ({
    context: path.resolve(__dirname),
    entry: path.join(lambdaFunctionsDir, fxn),
    output: {
      path: path.join(__dirname, 'dist', fxn.split(".")[0]),
      filename: 'index.js',
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['es2015'],
                plugins: ['transform-async-to-generator'],
                compact: false,
                babelrc: false
              }
            },
            'ts-loader'
          ]
        },
        {
          test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new zip({
        path: path.join(__dirname, 'dist', fxn.split(".")[0]),
        pathPrefix: '',
        filename: `${fxn.split(".")[0]}.zip`
      })
    ],
    target: 'node',
    externals: {
      'aws-sdk': 'aws-sdk',
      'awslambda': 'awslambda',
      'dynamodb-doc': 'dynamodb-doc',
      'imagemagick': 'imagemagick'
    },
    node: {
      __filename: false,
      __dirname: false
    },
    stats: 'errors-only',
    bail: true
  }));
};
