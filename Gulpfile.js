"use strict";

var gulp = require('gulp'),
		gutil = require('gulp-util'),
		sass = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		sourcemaps = require('gulp-sourcemaps'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
		svgstore = require('gulp-svgstore'),
		svgmin = require('gulp-svgmin'),
		imagemin = require('gulp-imagemin'),
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
	  JS: [
	  	'./assets/scripts/vendor/*.js',
	  	'./assets/scripts/*.js'
	  	],
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
	gulp.src(path.JS)
		.pipe(sourcemaps.init())
		.pipe(concat('mashup.js'))
		.pipe(sourcemaps.write())
    .pipe(livereload(server))
		.pipe(gulp.dest('./js'));
});

gulp.task('scripts-pro', function() {
	gulp.src(path.JS)
		.pipe(concat('mashup.js'))
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

gulp.task('images', function() {
	gulp.src( path.IMG )
  .pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
  .pipe(livereload(server))
	.pipe(gulp.dest('./img'));
});

// FONTS --- MOVE AND MINIFY FONTS FOR PRODUCTION ------------------------------------------------

gulp.task('fonts', function() {
	gulp.src( path.FONTS )
	.pipe(gulp.dest('./fonts'))
});

// WATCH and TASKS

gulp.task('watch', function() {
  // Listen on port 35729
  server.listen(35729, function (err) {
  if (err) {
    return console.log(err)
  };

	gulp.watch(path.SASS, ['style-dev']);
	gulp.watch(path.JS, ['scripts-dev']);
	gulp.watch(path.SVG), ['svg'];
	gulp.watch(path.IMG), ['images'];
  });
});

gulp.task('default', ['style-dev', 'scripts-dev', 'svg', 'images', 'fonts', 'watch']);

gulp.task('production', ['style-pro', 'scripts-pro', 'svg', 'images', 'fonts']);
