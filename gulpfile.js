
// Copyright (c) 2015 The Forest (Sander Pacheco Hernández)

// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

// Variables de librerias
var gulp = require('gulp'), // Lp
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	usemin = require('gulp-usemin'),
	autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
	watch = require('gulp-watch'),
	sass = require('gulp-sass'),
	jade = require('gulp-jade'),
	uglify = require('gulp-uglify'),
	minifyCss= require('gulp-minify-css'),
	reload = browserSync.reload;

// Directorios del proyecto
var proyecto = {
	imagenes: './src/img/**/*.*',
	fuentes: './src/components/**/*.{ttf,woff,eof,svg}',
	sass: './src/scss/*.scss',
	js: './src/js/**/*.js',
	raiz: './src/jade/*.jade',
	templ: './src/jade/templ/**/*.jade'
};

// Directorio final del proyecto (dist)
var produccion = {
	imagenes: './dist/img',
	librerias: './dist/lib',
	estilos: './dist/css',
	js: './dist/js',
	dist: './dist/',
	templ: './dist/templ/',
	//usemin
	index: './dist/index.html'
};

gulp.task('img', function () {
	return gulp.src(proyecto.imagenes)
		.pipe(gulp.dest(produccion.imagenes));
})

// static assets
gulp.task('fuentes', function () {
	return gulp.src(proyecto.fuentes)
		.pipe(rename({
			dirname: '/fonts'
		}))
		.pipe(gulp.dest(produccion.librerias));
});

// Comprimiendo SASS - 		.pipe(watch(proyecto.sass))
gulp.task('sass', function () {
	return gulp.src(proyecto.sass)
		.pipe(sass())
		.pipe(autoprefixer('> 5%'))
		.pipe(concat('main.min.css'))
		.pipe(gulp.dest(produccion.estilos));
});

// Comprimiendo js
gulp.task('js', function () {
	return gulp.src(proyecto.js)
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest(produccion.js));
})

//Jade a html
gulp.task('raiz', function () {
	return gulp.src(proyecto.raiz)
		.pipe(jade({
			'pretty':true
		}))
		.pipe(gulp.dest(produccion.dist))
})

gulp.task('templ', function  () {
	return gulp.src(proyecto.templ)
		.pipe(jade({
			'pretty':true
		}))
		.pipe(gulp.dest(produccion.templ))
})

gulp.task('usemin', function () {
	return gulp.src(produccion.index)
		.pipe(usemin({
			js:[uglify(), 'concat'],
			css: [minifyCss({keepSpecialComments: 0}), 'concat']
		}))
		.pipe(gulp.dest(produccion.dist));
})

gulp.task('watch', function () {
	gulp.watch([proyecto.sass], ['sass'], reload({stream:true}));
	gulp.watch([proyecto.raiz, proyecto.templ], ['raiz', 'templ'], reload({stream:true}));
	gulp.watch([proyecto.imagenes], ['img'], reload({stream:true}));
	gulp.watch([proyecto.js], ['js'], reload({stream:true}));
})

gulp.task('server', function() {
    browserSync({
        //logConnections: false,
        //logFileChanges: false,
        notify: true,
        open: false,
        server: {
            baseDir: produccion.dist
        }
    });
});

gulp.task('build-custom', ['img', 'fuentes', 'sass', 'js', 'raiz', 'templ']);
gulp.task('build', ['usemin', 'build-custom'])
gulp.task('default', ['build', 'watch']);
