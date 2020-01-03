const path = require('path');

module.exports = (electron) => {

    // Ajout des PROP et METHOD communs aux deux processus dans ELECTRON
    Object.assign(electron, {

        // Propreties
        paths: {
            root: path.join(__dirname, '..', '..', '')
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
        store: require('./modules/store')(electron),
        excel: require('./modules/excel')(electron)
    } );

    return electron;
};