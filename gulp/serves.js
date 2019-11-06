// Require
const
    gulp            = require('gulp'),
    config          = require('./config'),
    childprocess    = require('child_process');

// Export
module.exports = function(builds){

    const aWatcher = [],
        serves = {
            exec() {
                return childprocess.exec(
                    `set NODE_ENV=${config.env.current}& npm start`,
                    (error, stdout, stderr) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log(stdout);
                            console.error(stderr);
                        }
                        aWatcher.map( oWatcher => oWatcher.close() );
                    }
                );
            },
            
            watch(done) {
                for( let task in config.files.watch){
                    aWatcher.push(
                        gulp.watch(
                            Array.isArray(config.files.watch[task]) ?
                                config.files.watch[task].map( file => config.paths.src[task] + '/' + file ) :
                                config.paths.src[task] + '/' + config.files.watch[task],
                            gulp.series(builds[task])
                        )
                    );
                };
                done();
            }
        };
    serves.global = gulp.series(serves.watch, serves.exec);

    return serves;
};