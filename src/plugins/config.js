const
    os = require('os'),
    
    username = os.userInfo().username;

module.exports = {

    excel: {
        export: {
            name: `Saisie_temps_${username}.xlsx`,
            sheets: {
                /*
                    'Exemple Sheet': {
                        oOptions: {},
                        aColumn: [ {
                            _title: 'Header',
                            _width: 50,
                            _freeze: 0,
                            _hide: false,
                            _filter: false | {
                                firstRow: 1,
                                firstColumn: 1,
                                lastRow: 20,
                                lastColumn: 5,
                            },
                            _group: [1, true],
                            _type: 'string' | 'number' | 'formula' | 'date' | 'link' | 'bool',
                            _style: 'CustomStyle'
                        } ]
                    }
                */
                Parametre: [
                    {
                        _title: 'Liste des Tâches',
                        _width: 55
                    }
                ],
                User: [
                    {
                        _title: 'YYYY-MM',
                        _width: 12,
                        _filter: true,
                        _style: 'center'
                    },
                    {
                        _title: 'Tâche',
                        _width: 60
                    },
                    {
                        _title: 'Flag',
                        _width: 12
                    },
                    {
                        _title: 'tpshh',
                        _width: 11,
                        _type: 'number',
                        _style: 'center'
                    },
                    {
                        _title: 'tpsmm',
                        _width: 11,
                        _type: 'number',
                        _style: 'center'
                    },
                    {
                        _title: 'totminute',
                        _width: 12,
                        _type: 'formula',
                        _style: 'center'
                    },
                    {
                        _title: 'heure',
                        _width: 12,
                        _type: 'formula',
                        _style: 'center'
                    },
                    {
                        _title: 'commentaires',
                        _width: 60
                    }
                ]
            },

            style: {
                _header: {
                    alignment: {
                        horizontal: 'center'
                    },
                    fill: {
                        type: 'pattern',
                        patternType: 'solid',
                        fgColor: 'F7F7F7'
                    },
                    font: {
                        bold: true
                    }
                },

                center: {
                    alignment: {
                        horizontal: 'center'
                    }
                }
            }
        }
    },

    store: {
        project: {
            _defaults: [
                { "sName": "Pause" }
            ]
        },
        task: {
            _index: ['nIdProject', 'sDate']
        },
        chrono: {
            _index: ['nIdProject', 'nIdTask', 'sDate']
        }
    }
};