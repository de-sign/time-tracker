// Gestionnaire des BrowserWindow dans RENDERER
module.exports = (ES) => {

    return {
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
                this[sName] = new ES.BrowserWindow(oOptions);
                this.oIdMap[sName] = this[sName].id;
                sUrl && this[sName].loadURL(sUrl);
                this[sName].on('closed', () => this.destroy(sName));
                this.update();
                return this.oInstances[sName] = this[sName];
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
            for( let sName in this.oInstances ){
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
    };
};