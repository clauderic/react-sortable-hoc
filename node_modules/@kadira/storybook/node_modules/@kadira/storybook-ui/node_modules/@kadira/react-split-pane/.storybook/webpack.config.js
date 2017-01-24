const path = require('path');

module.exports = {
  module: {
    loaders: [
      { test: /\.css?$/, loaders: ['style', 'raw'], include: path.resolve(__dirname, '../') },
    ],
  },
};
