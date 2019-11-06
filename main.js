const
    env = process.env.NODE_ENV || 'development',
    out = {
        development: 'build',
        testing: 'test',
        production: 'dist'
    },
    ES = require(`./${out[env]}/plugins/electron-starter/_`);

ES.initialize( {
    sUrl: ES.env.root + '/index.html',
    oWindowOptions: {
        width: 800,
        height: 600,
        minWidth: 400,
        center: true,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    }
} )
.then( () => ES.windows.main.maximize() );