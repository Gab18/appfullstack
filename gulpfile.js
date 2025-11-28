import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import { src, dest, watch, series, parallel } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import terser from 'gulp-terser';
import sharp from 'sharp';
import plumber from 'gulp-plumber';

const sass = gulpSass(dartSass);

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js'
};

// ✅ CSS
export function css() {
    return src(paths.scss, { sourcemaps: true })
        .pipe(plumber()) // evita que se cierre
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(dest('./public/build/css', { sourcemaps: '.' }));
}

// ✅ JS
export function js() {
    return src(paths.js)
        .pipe(plumber())
        .pipe(terser())
        .pipe(dest('./public/build/js'));
}

// ✅ IMÁGENES
export async function imagenes() {
    const srcDir = './src/img';
    const buildDir = './public/build/img';
    const images = await glob('./src/img/**/*.{png,jpg,jpeg,webp,avif,svg}');

    const promises = images.map(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        return procesarImagen(file, outputSubDir);
    });

    return Promise.all(promises);
}

async function procesarImagen(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true });
    }

    const baseName = path.basename(file, path.extname(file));
    const extName = path.extname(file).toLowerCase();

    if (extName === '.svg') {
        const outputFile = path.join(outputSubDir, `${baseName}.svg`);
        fs.copyFileSync(file, outputFile);
        return;
    }

    const outputFile = path.join(outputSubDir, `${baseName}${extName}`);
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`);
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`);
    const options = { quality: 80 };

    await sharp(file).jpeg(options).toFile(outputFile);
    await sharp(file).webp(options).toFile(outputFileWebp);
    await sharp(file).avif().toFile(outputFileAvif);
}

// ✅ MODO DESARROLLO
export function dev() {
    watch(paths.scss, css);
    watch(paths.js, js);
    watch('src/img/**/*.{png,jpg,jpeg}', imagenes);
}

export default series(js, css, imagenes, dev);

export const build = series(js, css, imagenes);


