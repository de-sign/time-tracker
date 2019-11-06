const
    env = process.env.NODE_ENV || 'development',
    out = {
        development: 'build',
        testing: 'test',
        production: 'dist'
    };

module.exports = (electron) => {

    // Ajout des PROP et METHOD communs aux deux processus dans ELECTRON
    return Object.assign(electron, {

        env: {
            current: env,
            root: `file://${process.cwd()}/${out[env]}`,
            
            isDevelopment: env == 'development',
            isTesting: env == 'testing',
            isProduction: env == 'production'
        },
        
        // Permet ajout de multiples EVENT via OBJECT par TARGET.on(...)
        onWithObject(oTarget, oEventListener) {
            for( let sEvent in oEventListener ){
                oTarget.on(sEvent, oEventListener[sEvent]);
            }
        }
    });
};