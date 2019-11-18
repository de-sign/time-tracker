module.exports = function(electron){

    // Ajout des PROP et METHOD communs ...
    const ES = require('./share')(electron);

    // Liste des Modules
    ES.modules.add( {

        // Gestionnaire des BrowserWindow
        windows: {

            oInstances: {},
            oIdMap: {},

            // Initilisation du module
            initialize(oOptions = {}) {
                ES.on( ES.ipcMain, {
                    // INIT du gestionnaire d'un RENDERER
                    'es-window-init-renderer': (oEvent) => oEvent.reply('es-window-update', ES.windows.oIdMap),
                    // UPDATE du gestionnaire lors de modificaton de BrowserWindow via RENDERER
                    'es-window-create-from-renderer': (oEvent, sName, nId) => ES.windows.createFromRenderer(sName, nId),
                    'es-window-destroy-from-renderer': (oEvent, sName) => ES.windows.destroy(sName)
                } );
                return Promise.resolve();
            },
            // CREATE d'un BrowserWindow
            create(sName, sUrl = null, oOptions = {}) {
                if( !this[sName] ){
                    this[sName] = this.oInstances[sName] = new electron.BrowserWindow(oOptions);
                    sUrl && this[sName].loadURL(sUrl);
                    this[sName].on('closed', () => this.destroy(sName));
                    this.update();
                    this.oIdMap[sName] = this[sName].id;
                    return this[sName];
                }
            },
            // Récupération d'un BrowserWindow via un RENDERER
            createFromRenderer(sName, nId) {
                if( !this[sName] ){
                    this[sName] = this.oInstances[sName] = ES.BrowserWindow.fromId(nId);
                    this.oIdMap[sName] = nId;
                    this.update();
                }
            },
            // UPDATE des gestionnaire des RENDERER
            update() {
                for( let sName in this.oIdMap ){
                    this[sName].webContents.send('es-window-update', this.oIdMap);
                }
            },
            // DESTROY d'un BrowserWindow
            destroy(sName) {
                if( this.oInstances[sName] ){
                    delete this.oIdMap[sName];
                    delete this.oInstances[sName];
                    delete this[sName];
                    this.update();
                }
            }
        }
    } );

    // Ajout des PROP et METHOD du processus MAIN
    return Object.assign(ES, {

        // Liste des Méthodes
        initialize(oOptions = {}) {
            const aPromises = [];

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
