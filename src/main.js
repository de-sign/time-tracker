const
    ES = require(`./plugins/electron-starter/_`);

ES.initialize( {
    sUrl: ES.paths.root + '/index.html',
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
            // devTools: false
        }
    },

    modules: {
        store: {
            project: {
                _defaults: require('./plugins/defaults.js')
            },
            task: {
                _index: ['nIdProject', 'sDate']
            },
            chrono: {
                _index: ['nIdTask', 'sDate']
            }
        }
    }
} )
.then( () => {
    ES.windows.main.maximize();
} );