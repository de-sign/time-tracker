const
    ES = require(`./plugins/electron-starter/_`);

ES.initialize( {
    sUrl: ES.env.root + '/index.html',
    oWindowOptions: {
        width: 800,
        height: 600,
        minWidth: 500,
        minHeight: 600,
        center: true,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    },

    modules: {
        store: {
            task_def: {
                defaults: {
                    nAutoIncrement: 2,
                    oData: {
                        1: {
                            nId: 1,
                            sName: 'Pause'
                        }
                    }
                }
            },
            task: {
                defaults: {
                    nAutoIncrement: 1,
                    oData: {}
                }
            },
            chrono: {
                defaults: {
                    nAutoIncrement: 1,
                    oData: {}
                }
            }
        }
    }
} )
.then( () => {
    ES.windows.main.maximize();
} );