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
                { "sName": "Administration production // DSI // Administration" },
                { "sName": "BETTER // VSA // Management" },
                { "sName": "C3PO (Référentiel Fournisseur) // DFJ // Data Integration" },
                { "sName": "Cristal // DMC // Data Integration" },
                { "sName": "Cristal // DMC // Reporting" },
                { "sName": "Cristal Market // DMC // Reporting" },
                { "sName": "CRM // Australia // Data Integration" },
                { "sName": "CRM // Australia // Reporting" },
                { "sName": "CRM // BeNeSca // Data Integration" },
                { "sName": "CRM // BeNeSca // Reporting" },
                { "sName": "CRM // Group // Data Integration" },
                { "sName": "CRM // Group // Management" },
                { "sName": "CRM // Group // Reporting" },
                { "sName": "CRM // Poland // Data Integration" },
                { "sName": "CRM // Poland // Reporting" },
                { "sName": "CRM // South Korea // Data Integration" },
                { "sName": "CRM // South Korea // Reporting" },
                { "sName": "CRM // Spain & Portugal // Data Integration" },
                { "sName": "CRM // Spain & Portugal // Reporting" },
                { "sName": "CRM // UK & ROI // Data Integration" },
                { "sName": "CRM // UK & ROI // Reporting" },
                { "sName": "CRM // USA // Data Integration" },
                { "sName": "CRM // USA // Reporting" },
                { "sName": "DRP // DIQ // Data Integration" },
                { "sName": "DRP // DIQ // Reporting" },
                { "sName": "DSI Tools // DSI // DSI Tools" },
                { "sName": "DSI Tools // DSI // Upgrade" },
                { "sName": "GSV // DIQ // Data Integration" },
                { "sName": "GSV // DIQ // Reporting" },
                { "sName": "HAI // DFJ // Reporting" },
                { "sName": "Item Data Management // DIQ // Data Integration" },
                { "sName": "Item Data Management // DIQ // Reporting" },
                { "sName": "JDE // Group // Editique" },
                { "sName": "JDE // Group // Editique Marshall" },
                { "sName": "JDE // Group // Flux" },
                { "sName": "JDE // Group // BO" },
                { "sName": "LIMS // DIQ // Data Integration" },
                { "sName": "LIMS // DIQ // Reporting" },
                { "sName": "Management Equipe // DSI // Management" },
                { "sName": "Management Project // DSI // Management" },
                { "sName": "Operating Expenses Reporting // DFJ // Data Integration" },
                { "sName": "Operating Expenses Reporting // DFJ // Nprinting" },
                { "sName": "Operating Expenses Reporting // DFJ // Reporting" },
                { "sName": "Others interfaces // Group // Data Integration" },
                { "sName": "P2P // DFJ // Data Integration" },
                { "sName": "PAB // DMC // Data Integration" },
                { "sName": "PAB // DMC // Reporting" },
                { "sName": "QUAD // DIQ // Reporting" },
                { "sName": "QUAD // India // Reporting" },
                { "sName": "QUAD // Pologne // Reporting" },
                { "sName": "QUAD // France // Reporting" },
                { "sName": "QUAD // Australie // Reporting" },
                { "sName": "QUAD // BeNe // Reporting" },
                { "sName": "QUAD // Espagne // Reporting" },
                { "sName": "QUAD // Canada // Reporting" },
                { "sName": "QUAD // UKIE // Reporting" },
                { "sName": "QUAD // Suisse // Reporting" },
                { "sName": "QUAD // DSI // Formation" },
                { "sName": "QUAD // DSI // Reporting" },
                { "sName": "QUAD // Group // Communication Formation" },
                { "sName": "QUAD // Group // Data Integration" },
                { "sName": "QUAD // Group // Management" },
                { "sName": "QUAD // Group // Recette" },
                { "sName": "Radar // Canada // Reporting" },
                { "sName": "RH // DRH // Data Integration" },
                { "sName": "RH // DRH // Reporting" },
                { "sName": "Rolling Forecast // DFJ // Data Integration" },
                { "sName": "Rolling Forecast // DFJ // Reporting" },
                { "sName": "RPN // DFJ // Data Integration" },
                { "sName": "RPN // DFJ // Reporting" },
                { "sName": "Salesdash // USA // Data Integration" },
                { "sName": "Salesdash // USA // Reporting" },
                { "sName": "Sourcing // DFJ // Data Integration" },
                { "sName": "Sourcing // DFJ // Reporting" },
                { "sName": "SPIRIT // DFJ // Data Integration" },
                { "sName": "SPIRIT // DFJ // Reporting" },
                { "sName": "Stock Control // DIQ // Data Integration" },
                { "sName": "Stock Control // DIQ // Reporting" },
                { "sName": "Synapse // Canada // Reporting" },
                { "sName": "Synchro // Canada // Data Integration" },
                { "sName": "Synchro // Canada // Reporting" },
                { "sName": "Telephony // DSI // Data Integration" },
                { "sName": "Telephony // DSI // Reporting" },
                { "sName": "Traceability // DIQ // Data Integration" },
                { "sName": "Traceability // DIQ // Reporting" },
                { "sName": "Transfert Price // DFJ // Data Integration" },
                { "sName": "Transfert Price // DFJ // Reporting" },
                { "sName": "WMS // DIQ // Data Integration" },
                { "sName": "WO Analyse // Canada // Reporting" }
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