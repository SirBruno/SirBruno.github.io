module.exports = {
  module: {
    test: /\.css$/,
    loaders: [
      'style-loader',
      'css-loader?modules'
    ]
  },
};