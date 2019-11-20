// Require
const
    gulp = require('gulp'),
    builds = require('./gulp/builds'),
    services = require('./gulp/services')(builds);

// Export
Object.assign(exports, {
    default: gulp.series(builds.global, services.global),
    services: services.global,
    builds: builds.global,
    templates: builds.templates,
    scripts: builds.scripts,
    styles: builds.styles,
    clean: builds.clean
});