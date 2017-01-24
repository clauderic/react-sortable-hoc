build:
	@webpack 'mocha!./test/test.js' ./test/build/sourcemap.js --devtool source-map
	@webpack 'mocha!./test/test.js' ./test/build/eval-sourcemap.js --devtool eval-source-map
	@webpack 'mocha!./test/test.js' ./test/build/inline-sourcemap.js --devtool inline-source-map
	@webpack 'mocha!./test/test.js' ./test/build/cheap-module-eval-sourcemap.js --devtool cheap-module-eval-source-map
	@webpack 'mocha!./test/test.js' ./test/build/cheap-eval-sourcemap.js --devtool cheap-eval-source-map

test:
	@open http://localhost:3000/test/index.html
	@serve

.PHONY: build test
