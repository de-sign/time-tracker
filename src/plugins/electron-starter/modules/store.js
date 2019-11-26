const
    path = require('path'),
    Store = require('electron-store');

module.exports = (ES) => {

    return {
        // Properties
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
                    this._updateIndex(oData, oInsert);
                    oResult[oInsert._id] = oData._id[oInsert._id] = oInsert;
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
                    this._updateIndex(oData, oUpdate[nId]);
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
                    this._updateIndex(oData, nId);
                    delete oData._id[nId];
                } );
                this.set('_data', oData);

                return oData;
            },

            _initialize(oOptions){
                oOptions._index && this._updateIndexKeys(oOptions._index);
                if( oOptions._defaults && !this.get('_initialized') ){
                    this.insert(oOptions._defaults);
                }
                this.set('_initialized', true);
            },

            _updateIndex(oData, oAdd) {
                const aIndex = this.get('_index'),
                    bDelete = typeof oAdd === 'number',
                    nId = bDelete ? oAdd : oAdd._id;

                aIndex.forEach( sIndex => {
                    oData._id[nId] || (oData._id[nId] = {});
                    if( bDelete || oData._id[nId][sIndex] != oAdd[sIndex] ){
                        let uValue = oData._id[nId][sIndex];
                        if( oData[sIndex][uValue] && oData[sIndex][uValue].includes(nId) ){
                            oData[sIndex][uValue].splice( oData[sIndex][uValue].indexOf(nId), 1);
                        }

                        if( !bDelete ){
                            uValue = oAdd[sIndex];
                            oData[sIndex][uValue] || (oData[sIndex][uValue] = []);
                            oData[sIndex][uValue].push(nId);
                        }
                    }
                } );
            },
            
            _updateIndexKeys(aIndex) {
                Array.isArray(aIndex) || (aIndex = [aIndex]);
                const aLastIndex = this.get('_index'),
                    aAddIndex = aIndex.filter(x => !aLastIndex.includes(x)),
                    aDelIndex = aLastIndex.filter(x => !aIndex.includes(x));
    
                if( aAddIndex.length || aDelIndex.length ){
                    const oData = this.get('_data');
                    
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
    
                    this.set( {
                        _index: aIndex,
                        _data: oData
                    } );
                }
            }
        },

        // Methods
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

                this[sName]._initialize(oOptions);
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
        }
    };
};