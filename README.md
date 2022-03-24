## A Gulp plugin to produce pre-parsed assets for [QmlWeb](https://github.com/qmlweb/qmlweb)

[![Join the chat at https://gitter.im/qmlweb/qmlweb](https://badges.gitter.im/qmlweb/qmlweb.svg)](https://gitter.im/qmlweb/qmlweb)

[![npm](https://img.shields.io/npm/v/gulp-qmlweb.svg)](https://www.npmjs.com/package/gulp-qmlweb)
[![GitHub tag](https://img.shields.io/github/tag/qmlweb/gulp-qmlweb.svg)](https://github.com/qmlweb/gulp-qmlweb/releases)

This gulp plugin takes your project's Qt resource file (qrc) and generates a
JavaScript file (qrc.js) that you can bundle along with your qmlweb
application, allowing you to load assets in your project using the `qrc:/`
scheme.

## Installation

Add the following dependencies to your `package.json`:

```js
{
  "name": "QmlWebProject",
  "scripts": {
    "rcc": "gulp rcc",
    "watch": "gulp watch"
  },
  "devDependencies": {
    "gulp": "^4.0.0",
    "gulp-qmlweb": "~0.1.0"
  }
}
```

## Usage

Create a `Gulpfile.js` file such as:

```js
var gulp = require("gulp");
var qrc = require("gulp-qmlweb");

var qrcSource = "resources.qrc";
var sources = [
    qrcSource,
    "qml/**/*.qml",
    "qml/**/*.js",
    "qml/**/qmldir"
];
var output = "./dist/";

gulp.watch();

gulp.task("rcc", function() {
  return gulp.src(qrcSource)
    .pipe(qrc())
    .pipe(gulp.dest(output));
});

gulp.task("watch", gulp.series("rcc", function() {
  return gulp.watch(sources, gulp.series("rcc"));
}));
```

Running `npm run rcc` will parse your Qt resource file, and generate a
`dist/qrc.js` file.

Running `npm run watch` will watch the files specified in the `qrcSource` and
`sources` variable in your Gulpfile, and run the `rcc` task whenever a change
is detected.

The generated file will be availabel at `./dist/qrc.js`. Including this file in
your application will make all the registered resources available to QmlWeb
through `QmlWeb.qrc`, allowing you to use QML imports, or loading files (such
as pictures) using the `qrc:/` scheme.
