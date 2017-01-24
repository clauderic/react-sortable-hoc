echo "> Start transpiling ES2015"
echo ""
babel --plugins "transform-runtime" lib --ignore __tests__ --out-dir ./dist
cd dist
browserify --debug --ignore-missing -t [ exposify --expose [ --react React ] ] ./window_bind.js > ./browser.js
cat ./browser.js | uglifyjs -c > ./browser.min.js
echo ""
echo "> Complete transpiling ES2015"
