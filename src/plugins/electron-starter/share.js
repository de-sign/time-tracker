const
    path = require('path'),
    Store = require('electron-store');

module.exports = (electron) => {

    // Ajout des PROP et METHOD communs aux deux processus dans ELECTRON
    Object.assign(electron, {

        // Propreties
        paths: {
            root: 'file://' + path.join(__dirname, '..', '..', '')
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
            oMixin: {

                index(sIndex, aKeys) {
                    let bObjectReturn = true;
                    const oData = this.get('_data'),
                        oResult = {};

                    if( aKeys == null ){
                        aKeys = Object.keys(oData[sIndex]);
                    }
                    else if( !Array.isArray(aKeys) ){
                        aKeys = [aKeys];
                        bObjectReturn = false;
                    }
                    aKeys.forEach( sKey => oResult[sKey] = oData[sIndex][sKey] || [] );
                    
                    return bObjectReturn ? oResult : oResult[aKeys[0]];
                },

                select(aId) {
                    let bObjectReturn = true;
                    const oData = this.get('_data._id'),
                        oResult = {};

                    if( aId == null ){
                        return oData;
                    }
                    else if( !Array.isArray(aId) ){
                        aId = [aId];
                        bObjectReturn = false;
                    }

                    aId.forEach( sKey => oResult[sKey] = oData[sKey] );
                    
                    return bObjectReturn ? oResult : oResult[aId[0]];
                },
        
                insert(aInsert) {
                    let bObjectReturn = true,
                        nAutoIncrement = this.get('_autoIncrement');
                    const oData = this.get('_data'),
                        aIndex = this.get('_index'),
                        oResult = {};

                    if( !Array.isArray(aInsert) ){
                        aInsert = [aInsert];
                        bObjectReturn = false;
                    }

                    aInsert.forEach( oInsert => {
                        oInsert._id = nAutoIncrement++;
                        oResult[oInsert._id] = oData._id[oInsert._id] = oInsert;
                        aIndex.forEach( sIndex => {
                            let uValue = oInsert[sIndex];
                            oData[sIndex][uValue] || (oData[sIndex][uValue] = []);
                            oData[sIndex][uValue].push(oInsert._id);
                        } );
                    } );

                    this.set( {
                        _autoIncrement: nAutoIncrement,
                        _data: oData
                    } );

                    return bObjectReturn ? oResult : oResult[ aInsert[0]._id ];
                },
        
                update(nId, oUpdate) {
                    oUpdate = typeof nId === 'number' ? { [nId]: oUpdate } : nId;
                    const oData = this.get('_data'),
                        aIndex = this.get('_index');

                    for( nId in oUpdate ){
                        aIndex.forEach( sIndex => {
                            if( oData._id[nId][sIndex] != oUpdate[nId][sIndex] ){
                                let uValue = oData._id[nId][sIndex];
                                oData[sIndex][uValue].splice( oData[sIndex][uValue].indexOf(nId), 1);
                                uValue = oUpdate[nId][sIndex];
                                oData[sIndex][uValue] || (oData[sIndex][uValue] = []);
                                oData[sIndex][uValue].push(nId);
                            }
                        } );
                        oData._id[nId] = oUpdate[nId];
                    }
                    this.set('_data', oData);

                    return oData;
                },
        
                delete(aId) {
                    Array.isArray(aId) || (aId = [aId]);
                    const oData = this.get('_data'),
                        aIndex = this.get('_index');

                    aId.forEach( nId => {
                        aIndex.forEach( sIndex => {
                            let uValue = oData._id[nId][sIndex];
                            oData[sIndex][uValue].splice( oData[sIndex][uValue].indexOf(nId), 1);
                        } );
                        delete oData._id[nId];
                    } );
                    this.set('_data', oData);

                    return oData;
                }
            },

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
                    oOptions = this.options(sName, oOptions);
                    this[sName] = this.oInstances[sName] = Object.assign(
                        new Store(oOptions),
                        this.oMixin
                    );

                    oOptions._index && this.updateIndex(sName, oOptions._index);
                    if( oOptions._defaults && !this[sName].get('_initialized') ){
                        this[sName].insert(oOptions._defaults);
                    }
                    this[sName].set('_initialized', true);
                }
            },

            options(sName, oOptions = {}) {
                oOptions || (oOptions = {});
                return Object.assign( oOptions, {
                    name: sName,
                    cwd: path.join('Electron Starter', 'Storage', oOptions.cwd || ''),
                    defaults: Object.assign(
                        oOptions.defaults || {},
                        {
                            _initialized: false,
                            _autoIncrement: 1,
                            _data: {
                                _id: {}
                            },
                            _index: []
                        }
                    )
                } );
            },

            updateIndex(sName, aIndex) {
                Array.isArray(aIndex) || (aIndex = [aIndex]);
                const aLastIndex = this[sName].get('_index'),
                    aAddIndex = aIndex.filter(x => !aLastIndex.includes(x)),
                    aDelIndex = aLastIndex.filter(x => !aIndex.includes(x));

                if( aAddIndex.length || aDelIndex.length ){
                    const oData = this[sName].get('_data');
                    
                    aAddIndex.forEach( sIndex => {
                        let nId, uValue;
                        oData[sIndex] = {};
                        for( nId in oData._id ){
                            uValue = oData._id[nId][sIndex];
                            oData[sIndex][uValue] || (oData[sIndex][uValue] = []);
                            oData[sIndex][uValue].push(nId);
                        }
                    } );
                    aDelIndex.forEach( sIndex => delete oData[sIndex] );

                    this[sName].set( {
                        _index: aIndex,
                        _data: oData
                    } );
                }
            }
        }
    } );

    return electron;
};