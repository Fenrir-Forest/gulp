
// Variables de librerias
var gulp = require('gulp'), // Lp
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	usemin = require('gulp-usemin'),
	watch = require('gulp-watch'),
	sass = require('gulp-sass'),
	jade = require('gulp-jade'),
	uglify = require('gulp-uglify'),
	minifyCss= require('gulp-minify-css');

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

gulp.task('watch', ['fuentes'], function () {
	gulp.watch([proyecto.sass], ['sass']);
	gulp.watch([proyecto.raiz, proyecto.templ], ['raiz', 'templ']);
	gulp.watch([proyecto.imagenes], ['img']);
	gulp.watch([proyecto.js], ['js']);
})

gulp.task('default', ['sass']);