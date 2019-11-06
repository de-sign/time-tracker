// Require
const
    gulp = require('gulp'),
    builds = require('./gulp/builds'),
    serves = require('./gulp/serves')(builds);

// Export
Object.assign(exports, {
    default: gulp.series(builds.global, serves.global),
    builds: builds.global,
    templates: builds.templates,
    scripts: builds.scripts,
    styles: builds.styles,
    clean: builds.clean
});