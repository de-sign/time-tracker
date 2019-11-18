const
    env = process.env.NODE_ENV || 'development',
    out = {
        development: 'build',
        testing: 'test',
        production: 'dist'
    };
    
require(`./${out[env]}/main`);