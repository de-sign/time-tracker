module.exports = function(electron){

    // Ajout des PROP et METHOD communs ...
    const ES = require('./share')(electron);
    
    // Liste des Modules
    ES.modules.add( {
        windows: require('./modules/window-main')(ES)
    } );

    // Ajout des PROP et METHOD du processus MAIN
    return Object.assign(ES, {

        // Liste des Méthodes
        initialize(oOptions = {}) {
            const aPromises = [];

            // Gestion de .remote suite à Electron 14.0
            ES.remote = require('@electron/remote/main');
            ES.remote.initialize();

            // INIT des Modules
            aPromises.push( ES.modules.initialize(oOptions.modules) );

            // APP initialize et MAIN BrowserWindow
            aPromises.push(
                new Promise( (fResolve, fReject ) => {
                    const fCreate = () => {
                        ES.windows.create('main', oOptions.sUrl, oOptions.oWindowOptions);
                        fResolve();
                    };
                    ES.on( electron.app, {
                        'ready': fCreate,
                        'activate': fCreate,
                        'window-all-closed': () => {
                            if (process.platform !== 'darwin') {
                                ES.app.quit();
                            }
                        }
                    } );
                })
            );

            return Promise.all(aPromises);
        }

    });
};
