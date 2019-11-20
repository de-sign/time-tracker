// Require
const
    del           = require('del'),
    fs            = require('fs'),
    path          = require('path'),
    merge         = require('lodash.merge'),

    gulp          = require('gulp'),
    config        = require('./config'),
    beautify      = require('gulp-beautify'),
    cleancss      = require('gulp-clean-css'),
    concat        = require('gulp-concat'),
    data          = require('gulp-data'),
    htmlmin       = require('gulp-htmlmin'),
    gulpif        = require('gulp-if'),
    imagemin      = require('gulp-imagemin'),
    nunjucks      = require('gulp-nunjucks'),
    plumber       = require('gulp-plumber'),
    rename        = require('gulp-rename'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    terserjs      = require('gulp-terser-js');

// Tasks
const builds = {
    clean() {
        return del([config.paths.dest.root], { force: true });
    },

    package() {
        return gulp.src(config.paths.src.package + '/' + config.files.src.package)
            .pipe(gulp.dest(config.paths.dest.package));
    },
    
    html() {
        return gulp.src(config.paths.src.html + '/' + config.files.src.html)
            .pipe(plumber(config.plugins.plumber))
            .pipe(data(file => {
                let ES = JSON.parse(fs.readFileSync(config.paths.src.data + '/base.json')),
                    f_path = config.paths.src.data + '/' + path.basename(file.path, '.html') + '.json';
                fs.existsSync(f_path) && merge(ES, JSON.parse(fs.readFileSync(f_path)));
                return { ES };
            }))
            .pipe(nunjucks.compile())
            .pipe(gulpif(config.env.isDevelopment, beautify.html(config.plugins.beautify.html), htmlmin(config.plugins.htmlmin)))
            .pipe(plumber.stop())
            .pipe(gulp.dest(config.paths.dest.html));
    },

    js() {
        return gulp.src(config.paths.src.js + '/' + config.files.src.js)
            .pipe(plumber(config.plugins.plumber))
            .pipe(gulpif(config.env.isDevelopment, beautify.js(config.plugins.beautify.js), terserjs(config.plugins.terserjs)))
            .pipe(plumber.stop())
            .pipe(gulp.dest(config.paths.dest.js));
    },
    
    scss() {
        return gulp.src(config.paths.src.scss + '/' + config.files.src.scss)
            .pipe(plumber(config.plugins.plumber))
            .pipe(gulpif(config.env.isDevelopment, sourcemaps.init(config.plugins.sourcemaps.css.init)))
            .pipe(sass())
            .pipe(gulpif(config.env.isDevelopment, beautify.css(config.plugins.beautify.css), cleancss(config.plugins.cleancss)))
            .pipe(gulpif(config.env.isDevelopment, sourcemaps.write(config.plugins.sourcemaps.css.write)))
            .pipe(plumber.stop())
            .pipe(gulp.dest(config.paths.dest.scss));
    },
    
    images() {
        return gulp.src(config.paths.src.images + '/' + config.files.src.images)
            .pipe(imagemin(config.plugins.imagemin))
            .pipe(gulp.dest(config.paths.dest.images));
    },
    
    fonts() {
        return gulp.src(config.paths.src.fonts + '/' + config.files.src.fonts)
            .pipe(gulp.dest(config.paths.dest.fonts));
    }
};

Object.assign(builds, {
    templates: builds.html,
    scripts: gulp.parallel(builds.package, builds.js),
    styles: gulp.parallel(builds.scss, builds.images, builds.fonts)
});
builds.global = gulp.series(builds.clean, gulp.parallel(builds.templates, builds.scripts, builds.styles));

// Export
module.exports = builds;