module.exports = function(electron){

    // Ajout des PROP et METHOD communs ...
    const ES = require('./share')(electron);

    ES.modules.add( {
        // Liste des Modules
            // Gestionnaire des BrowserWindow
        windows: {

            oInstances: {},

            // Initilisation du module
            initialize(oOptions = {}) {
                return new Promise( (fResolve, fReject) => {
                    // UPDATE du gestionnaire lors de modificaton de BrowserWindow via MAIN
                    ES.ipcRenderer.on('es-window-update', (oEvent, oMap) => {
                        fResolve();
                        ES.windows.update(oMap);
                    });
                    // Demande de l'INIT du gestonnaire via MAIN
                    ES.ipcRenderer.send('es-window-init-renderer');
                } );
            },
            // CREATE d'un BrowserWindow
            create(sName, sUrl = null, oOptions = {}) {
                if( !this[sName] ){
                    this[sName] = this.oInstances[sName] = new electron.BrowserWindow(oOptions);
                    sUrl && this[sName].loadURL(sUrl);
                    this[sName].on('closed', () => this.destroy(sName));
                    ES.ipcRenderer.send('es-window-create-from-renderer', sName, this[sName].id);
                    return this[sName];
                }
            },
            // UPDATE du gestonnaire via MAIN
            update(oMap) {
                let sName = null;
                // Récupération des BrowserWindow inconnu
                for( sName in oMap ){
                    if( !this[sName] ){
                        this[sName] = this.oInstances[sName] = ES.remote.BrowserWindow.fromId( oMap[sName] );
                    }
                }
                // Suppression des BrowserWindow inexistant
                for( sName in this.oInstances ){
                    if( !oMap[sName] ){
                        delete this[sName];
                        delete this.oInstances[sName];
                    }
                }
            },
            // DESTROY d'un BrowserWindow
            destroy(sName) {
                ES.ipcRenderer.send('es-window-destroy-from-renderer', sName);
            }
        }
    } );

    // Ajout des PROP et METHOD du processus RENDERER
    return Object.assign(ES, {

        // Liste des Méthodes
        initialize(oOptions = {}) {
            const aPromises = [];

            // INIT des Modules
            aPromises.push( ES.modules.initialize(oOptions.modules) );

            return Promise.all(aPromises);
        }

    });
};
