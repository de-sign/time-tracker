const
    path = require('path'),
    Store = require('electron-store');

module.exports = (electron) => {

    // Ajout des PROP et METHOD communs aux deux processus dans ELECTRON
    Object.assign(electron, {

        // Propreties
        paths: {
            root: 'file://' + path.join(__dirname, '../../')
        },
        
        // Methods
        // Permet ajout de multiples EVENT via OBJECT par TARGET.on(...)
        on(oTarget, sEvent, fListener = null) {
            const oEventListener = typeof sEvent === 'string' ?
                { [sEvent]: fListener } :
                sEvent;

            for( sEvent in oEventListener ){
                oTarget.on(sEvent, oEventListener[sEvent]);
            }
        },

        // Modules
        modules: {
            aModules: [],

            initialize(oOptions = {}) {
                const aPromise = [];
                this.aModules.forEach( (sName) => {
                    aPromise.push( electron[sName].initialize(oOptions[sName]) );
                } );
                return Promise.all(aPromise);
            },

            add(sName, oModule = {}) {

                oModule = typeof sName === 'string' ?
                    { [sName]: oModule } :
                    sName;

                for( sName in oModule ){
                    if( electron[sName] ){
                        console.error(`ES.modules.add : ${sName} already exist`);
                    } else {
                        electron[sName] = oModule[sName];
                        this.aModules.push(sName);
                    }
                }
            }
        }
    });

    electron.modules.add( {
        store: {
            oInstances: {},

            initialize(oOptions = {}) {
                
                if( typeof oOptions === 'string' ){
                    oOptions = [oOptions];
                }
                if( Array.isArray(oOptions) ){
                    let aOption = oOptions;
                    oOptions = {};
                    aOption.forEach( sName => {
                        oOptions[sName] = null;
                    } );
                }

                for( let sName in oOptions ){
                    this.create(sName, oOptions[sName]);
                }
                return Promise.resolve();
            },

            create(sName, oOptions = {}) {
                if( !this.oInstances[sName] ){
                    this[sName] = this.oInstances[sName] = new Store(
                        Object.assign( oOptions || {}, {
                            name: sName
                        } )
                    );
                }
            }
        }
    } );

    return electron;
};