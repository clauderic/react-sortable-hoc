# Notes on Developing for React Infinite

## Infinite Jest
I am seated in an office, surrounded by heads and bodies. There I've written some tests for this package, using Facebook's Jest library<small><sup>1</sup></small>, which provides automatic mocking and jsdom testing.

Tests are located in the `__tests__` directory<small><sup>2</sup></small>, and can be run with `npm test` after `npm install`.

## Developing
React Infinite is built with Browserify and Gulp. To get started, install the development dependencies with `npm install`. If you do not already have Gulp, you might wish to install it globally with `npm install -g gulp`.

The newly revamped development environment is based on `gulp develop`. When run, this command sets up a watch on the `/src` folder with Browserify as well as the `examples` folder.

The other major command, `gulp release`, prepares files for release. It produces normal and minified versions of `react-infinite.js` in the `dist` folder and also directly transpiles the source to ES5 in the `build` folder so it can be required by other asset pipelines.

### Infinite Computers

Extending React Infinite to support different specifications of `elementHeight`s is now much easier. To do so, write a class that extends the `InfiniteComputer` and satisfies its interface of five methods (see `src/computers/infinite_computer.js`). You can consult `ConstantInfiniteComputer` and `ArrayInfiniteComputer` to see how constant and variable heights are handled respectively.

## Future Development

It would be useful for React Infinite to be adapted to any arbitrary two-dimensional grid.

<small><sup>1</sup></small> In sum, Jest is a library that provides several layers on top of Jasmine. More information can be found on Facebook's [Jest page](https://facebook.github.io/jest/).

<small><sup>2</sup></small> The directory name is specified by Jest. Tests can be written in JSX because they are first run through a preprocessor that compiles them to plain Javascript.
