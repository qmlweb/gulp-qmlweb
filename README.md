## A Gulp plugin to produce pre-parsed assets for [QmlWeb](https://github.com/qmlweb/qmlweb)

[![Join the chat at https://gitter.im/qmlweb/qmlweb](https://badges.gitter.im/qmlweb/qmlweb.svg)](https://gitter.im/qmlweb/qmlweb)

[![npm](https://img.shields.io/npm/v/gulp-qmlweb.svg)](https://www.npmjs.com/package/gulp-qmlweb)
[![GitHub tag](https://img.shields.io/github/tag/qmlweb/gulp-qmlweb.svg)](https://github.com/qmlweb/gulp-qmlweb/releases)

## Installation

Add the following dependencies to your `package.json`:

```js
{
  "name": "QmlWebProject",
  "scripts": {
    "rcc": "gulp rcc"
  },
  "devDependencies": {
    "gulp": "~3.6.0",
    "gulp-qmlweb": "~0.1.0"
  }
}
```

## Usage
```js
var gulp = require('gulp');
var qrc = require('gulp-qmlweb');

gulp.watch(['qml/**/*.qml', 'qml/**/*.js', 'qml/**/qmldir'], ['rcc']);

gulp.task('rcc', function() {
  return gulp.src('resources.qrc')
    .pipe(qrc())
    .pipe(gulp.dest('./dist/'));
});
```

Running `npm run rcc` will parse your Qt resource file, and generate a `dist/qrc.js` file.
Including this file in your application build will make all the registered resources available to QmlWeb
through `QmlWeb.qrc`, allowing you to use QML imports, or loading files (such as pictures) using the
`qrc:/` scheme.
