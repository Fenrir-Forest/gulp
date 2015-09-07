
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
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	jade = require('gulp-jade'),
	minifyCss= require('gulp-minify-css'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	usemin = require('gulp-usemin'),
	watch = require('gulp-watch'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

// Directorios del proyecto
var proyecto = {
	imagenes: './src/img/**/*.*',
	componentes: './src/components/**',
	fuentes: './src/fuentes/**/*.{ttf,woff,eof,svg}',
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

// Fuentes
gulp.task('fuentes', function () {
	return gulp.src(proyecto.fuentes)
		.pipe(rename({
			dirname: '/fonts'
		}))
		.pipe(gulp.dest(produccion.librerias));
});

// static assets
gulp.task('componentes', function () {
	return gulp.src(proyecto.componentes)
		.pipe(rename({
			dirname: '/components'
		}))
		.pipe(gulp.dest(produccion.dist));
})

// Comprimiendo SASS -      .pipe(watch(proyecto.sass))
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
	gulp.watch([proyecto.componentes], ['componentes'], reload({stream:true}));
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

gulp.task('build-custom', ['img', 'componentes', 'fuentes', 'sass', 'js', 'raiz', 'templ']);
gulp.task('build', ['usemin', 'build-custom'])
gulp.task('default', ['build', 'watch']);
