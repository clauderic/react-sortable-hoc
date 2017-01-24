#!/bin/bash

echo "> Start transpiling ES2015"
echo ""
rm -rf ./dist
./node_modules/.bin/babel --ignore __tests__,manager --plugins "transform-runtime" ./src --out-dir ./dist
if [[ -z $DEV_BUILD ]]; then
  ./node_modules/.bin/webpack --config scripts/webpack.manager.conf.js
fi
echo ""
echo "> Complete transpiling ES2015"
