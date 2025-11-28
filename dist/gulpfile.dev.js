"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = css;
exports.js = js;
exports.imagenes = imagenes;
exports.dev = dev;
exports.build = exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _glob = require("glob");

var _gulp = require("gulp");

var dartSass = _interopRequireWildcard(require("sass"));

var _gulpSass = _interopRequireDefault(require("gulp-sass"));

var _gulpTerser = _interopRequireDefault(require("gulp-terser"));

var _sharp = _interopRequireDefault(require("sharp"));

var _gulpPlumber = _interopRequireDefault(require("gulp-plumber"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sass = (0, _gulpSass["default"])(dartSass);
var paths = {
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js'
}; // ✅ CSS

function css() {
  return (0, _gulp.src)(paths.scss, {
    sourcemaps: true
  }).pipe((0, _gulpPlumber["default"])()) // evita que se cierre
  .pipe(sass({
    outputStyle: 'compressed'
  }).on('error', sass.logError)).pipe((0, _gulp.dest)('./public/build/css', {
    sourcemaps: '.'
  }));
} // ✅ JS


function js() {
  return (0, _gulp.src)(paths.js).pipe((0, _gulpPlumber["default"])()).pipe((0, _gulpTerser["default"])()).pipe((0, _gulp.dest)('./public/build/js'));
} // ✅ IMÁGENES


function imagenes() {
  var srcDir, buildDir, images, promises;
  return regeneratorRuntime.async(function imagenes$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          srcDir = './src/img';
          buildDir = './public/build/img';
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _glob.glob)('./src/img/**/*.{png,jpg,jpeg,webp,avif,svg}'));

        case 4:
          images = _context.sent;
          promises = images.map(function (file) {
            var relativePath = _path["default"].relative(srcDir, _path["default"].dirname(file));

            var outputSubDir = _path["default"].join(buildDir, relativePath);

            return procesarImagen(file, outputSubDir);
          });
          return _context.abrupt("return", Promise.all(promises));

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

function procesarImagen(file, outputSubDir) {
  var baseName, extName, _outputFile, outputFile, outputFileWebp, outputFileAvif, options;

  return regeneratorRuntime.async(function procesarImagen$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!_fs["default"].existsSync(outputSubDir)) {
            _fs["default"].mkdirSync(outputSubDir, {
              recursive: true
            });
          }

          baseName = _path["default"].basename(file, _path["default"].extname(file));
          extName = _path["default"].extname(file).toLowerCase();

          if (!(extName === '.svg')) {
            _context2.next = 7;
            break;
          }

          _outputFile = _path["default"].join(outputSubDir, "".concat(baseName, ".svg"));

          _fs["default"].copyFileSync(file, _outputFile);

          return _context2.abrupt("return");

        case 7:
          outputFile = _path["default"].join(outputSubDir, "".concat(baseName).concat(extName));
          outputFileWebp = _path["default"].join(outputSubDir, "".concat(baseName, ".webp"));
          outputFileAvif = _path["default"].join(outputSubDir, "".concat(baseName, ".avif"));
          options = {
            quality: 80
          };
          _context2.next = 13;
          return regeneratorRuntime.awrap((0, _sharp["default"])(file).jpeg(options).toFile(outputFile));

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap((0, _sharp["default"])(file).webp(options).toFile(outputFileWebp));

        case 15:
          _context2.next = 17;
          return regeneratorRuntime.awrap((0, _sharp["default"])(file).avif().toFile(outputFileAvif));

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  });
} // ✅ MODO DESARROLLO


function dev() {
  (0, _gulp.watch)(paths.scss, css);
  (0, _gulp.watch)(paths.js, js);
  (0, _gulp.watch)('src/img/**/*.{png,jpg,jpeg}', imagenes);
}

var _default = (0, _gulp.series)(js, css, imagenes, dev);

exports["default"] = _default;
var build = (0, _gulp.series)(js, css, imagenes);
exports.build = build;