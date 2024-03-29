const
    path = require('path'),
    ES = require('./plugins/electron-starter/core'),
    config = require('./plugins/config');

ES.initialize( {
    sUrl: path.join('file:/', ES.paths.root, 'index.html'),
    oWindowOptions: {
        width: 800,
        height: 600,
        minWidth: 500,
        minHeight: 600,
        center: true,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
            // devTools: false
        }
    },

    modules: {
        store: config.store
    }
} )
.then( () => {
    ES.windows.main.maximize();
} );