const imagemin = require('gulp-imagemin');

// Data
let env = process.env.NODE_ENV || 'development',
    out = {
        development: 'build',
        testing: 'test',
        production: 'dist'
    },
    src = {
        root: 'src',
        assets: 'src/assets',
        pages: 'src/pages'
    },
    dest = {
        root: `${out[env]}`,
        assets: `${out[env]}/assets`
    };

// Export
Object.assign(exports, {
    
    env: {
        current: env,
        isDevelopment: env == 'development',
        isTesting: env == 'testing',
        isProduction: env == 'production'
    },

    paths: {
        src: Object.assign(src, {
            html: `${src.pages}`,
            data: `${src.pages}/data`,
            scss: `${src.assets}/scss`,
            js: `${src.root}`,
            images: `${src.assets}/images`,
            fonts: `${src.assets}/fonts`
        }),
        dest: Object.assign(dest, {
            html: `${dest.root}`,
            scss: `${dest.assets}/css`,
            js: `${dest.root}`,
            images: `${dest.assets}/images`,
            fonts: `${dest.assets}/fonts`
        })
    },

    files: {
        watch: {
            html: [
                '**/*.html',
                '**/*.json',
                '**/*.njk'
            ],
            scss: '**/*.scss',
            js: '**/*.js',
            images: '**/*.*',
            fonts: '**/*.*'
        },
        src: {
            html: '*.html',
            scss: '*.scss',
            js: '**/*.js',
            images: '**/*.*',
            fonts: '**/*.*'
        }
    },

    plugins: {
        beautify: {
            css: undefined,
            html: {
                'end-with-newline': true,
                'indent-inner-html': true,
                'preserve-newlines': false
            },
            js: undefined
        },
        cleancss: undefined,
        htmlmin: undefined,
        imagemin: [
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: false },
                    { removeComments: true },
                    { removeHiddenElems: true },
                    { removeDimensions: true },
                    { cleanupIDs: true }
                ]
            })
        ],
        plumber: undefined,
        sass: undefined,
        sourcemaps: {
            js: {
                init: undefined,
                write: undefined
            },
            css: {
                init: undefined,
                write: undefined
            }
        },
        terserjs: undefined
    }
});