"use strict";

var gulp = require('gulp'),
		gutil = require('gulp-util'),
		sass = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		sourcemaps = require('gulp-sourcemaps'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		browserify = require('browserify'),
		babelify = require('babelify'),
		source = require('vinyl-source-stream'),
		buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
		svgstore = require('gulp-svgstore'),
		svgmin = require('gulp-svgmin'),
		imagemin = require('gulp-imagemin'),
		clean = require('gulp-clean'),
		watch = require('gulp-watch'),
		livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

var path = {
	  SASS: [
		'./assets/style/style.sass',
		'./assets/style/**/*.scss',
		'./assets/style/**/*.sass'
			],
	  JS: './assets/scripts/entry.js',
	  SVG: './assets/vectors/*.svg',
	  IMG: [
	  	'./assets/images/**/*.jpg',
	  	'./assets/images/**/*.gif',
	  	'./assets/images/**/*.png'
	  	],
	  FONTS: [
	  	'./assets/fonts/*.woff2',
	  	'./assets/fonts/*.woff',
	  	'./assets/fonts/*.ttf'
	  ]
};

// STYLE SHEETS - SASS COMMANDS --------------------------------------------------------------------

gulp.task('style-dev', function() {
	gulp.src(path.SASS)
		.pipe(sourcemaps.init())
		.pipe(sass({style: 'expanded', lineNumbers : true }).on('error', sass.logError))
		.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(concat('style.css'))
		.pipe(sourcemaps.write())
    .pipe(livereload(server))
		.pipe(gulp.dest('./'));
});

gulp.task('style-pro', function() {
	gulp.src(path.SASS)
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./'));
});

// JAVASCRIPT - JS COMMANDS --------------------------------------------------------------------

gulp.task('scripts-dev', function() {
	return browserify({entries: './assets/scripts/gateway.js', debug: true})
			.transform('babelify', {presets: ['es2015']})
			.bundle()
			.on('error', function (err) {
					console.error(err);
					this.emit('end');
			})
			.pipe(source('mashup.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./js'));
});

gulp.task('scripts-pro', function() {
	gulp.src(path.JS)
	return browserify({entries: './assets/scripts/gateway.js', debug: true})
			.transform('babelify', {presets: ['es2015']})
			.bundle()
			.on('error', function (err) {
					console.error(err);
					this.emit('end');
			})
			.pipe(source('mashup.js'))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(gulp.dest('./js'));
});

// SVGS - BUILD svg.def FILE FOR INLINE USE --------------------------------------------------------

gulp.task('svg', function() {
    gulp.src(path.SVG)
    	.pipe(rename({prefix: 'svg-'}))
    	.pipe(svgmin())
    	.pipe(svgstore())
    	.pipe(rename('defs.svg'))
      .pipe(livereload(server))
    	.pipe(gulp.dest('./svg'));
});

// IMAGES -- MOVE AND MINIFY IMAGES FOR PRODUCTION -----------------------------------------

gulp.task('images-dev', function() {
	gulp.src( path.IMG )
	.pipe(clean({force: true}))
	.pipe(gulp.dest('./img'));
});

gulp.task('images-pro', function() {
	gulp.src( path.IMG )
  .pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
  .pipe(livereload(server))
	.pipe(clean({force: true}))
	.pipe(gulp.dest('./img'));
});

// FONTS --- MOVE AND MINIFY FONTS FOR PRODUCTION ------------------------------------------------

gulp.task('fonts', function() {
	gulp.src( path.FONTS )
	.pipe(gulp.dest('./fonts'))
});

// WATCH and TASKS

gulp.task('watch', function() {

  livereload.listen();

	gulp.watch(path.SASS, ['style-dev']);
	gulp.watch(path.JS, ['scripts-dev']);
	gulp.watch(path.SVG), ['svg'];
	gulp.watch(path.IMG), ['images'];

});

gulp.task('default', ['style-dev', 'scripts-dev', 'svg', 'images-dev', 'fonts', 'watch']);

gulp.task('production', ['style-pro', 'scripts-pro', 'svg', 'images-pro', 'fonts']);
