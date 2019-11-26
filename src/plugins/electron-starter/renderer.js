module.exports = function(electron){

    // Ajout des PROP et METHOD communs ...
    const ES = require('./share')(electron);

    // Liste des Modules
    ES.modules.add( {
        windows: require('./modules/window-renderer')(ES)
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
