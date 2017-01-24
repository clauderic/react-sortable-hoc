#!/bin/bash

# IMPORTANT
# ---------
# This is an auto generated file with React CDK.
# Do not modify this file.
# Use `.scripts/user/prepublish.sh instead`.

echo "=> Transpiling 'src' into ES5 ..."
echo ""
rm -rf ./dist
./node_modules/.bin/babel --ignore __tests__ --plugins "transform-runtime" ./src --out-dir ./dist
echo ""
echo "=> Transpiling completed."
