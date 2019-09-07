## A Gulp plugin to produce pre-parsed assets for [QmlWeb](https://github.com/qmlweb/qmlweb)

[![Join the chat at https://gitter.im/qmlweb/qmlweb](https://badges.gitter.im/qmlweb/qmlweb.svg)](https://gitter.im/qmlweb/qmlweb)

[![npm](https://img.shields.io/npm/v/gulp-qmlweb.svg)](https://www.npmjs.com/package/gulp-qmlweb)
[![GitHub tag](https://img.shields.io/github/tag/qmlweb/gulp-qmlweb.svg)](https://github.com/qmlweb/gulp-qmlweb/releases)

## Installation

Add the following dependencies to your `package.json`:

```js
{
  "name": "QmlWebProject",
  "devDependencies": {
    "gulp": "~4.0.2",
    "gulp-concat": "~2.6.1",
    "gulp-qmlweb": "~0.0.7"
  }
}
```

## Usage

Set up `gulpfile.js` in your project's root folder:

```js
var gulp = require('gulp');
var qml = require('gulp-qmlweb');
var concat = require('gulp-concat');

function myPathFilter(path) {
  return "/mynamespace/" + path;
}

gulp.task('scripts', function() {
  return gulp.src(['qml/**/*.qml', 'qml/**/*.js', 'qml/**/qmldir'])
    .pipe(qml({pathFilter: myPathFilter}))
    .pipe(concat('qrc.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', gulp.series('scripts'));
```

Now, running `npx gulp` will compile all your QML sources (qml and javascript) and concatenate them in the `/dist/qrc.js` file.

### Basic setup

Include the `qrc.js` file and `qmlweb.js` file from the `qmlweb` package to get your application up and running.

Note that the path to files included from `qrc.js` must be preppended with the `qrc:/` scheme.

```html
<html>
  <head>
    <title>Gulp-powered QmlWeb App</title>
    <script src="dist/qrc.js"></script>
    <script src="dist/qmlweb.js"></script>
  </head>
  <body data-qml="qrc:/mynamespace/qml/main.qml">
  </body>
</html>
```
