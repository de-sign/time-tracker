function APP_getNumberDate(oChrono) {
    return parseInt( ( oChrono.sDate + oChrono.sTimeStart ).replace(/-|:/g, '') );
}

module.exports = {

    components: {},

    props: {
        nId: Number,
        sName: String,
        aFilterChrono: Array
    },
    data() {
        return {
            aColumn: [
                { sField: 'sName', sLabel: 'Nom', sClass: 'uk-table-expand'  },
                // { sField: 'sDescription', sLabel: 'Description', sClass: 'uk-table-expand' },
                { sField: 'bIsRunning', sLabel: 'En cours', fRender: bIsRunning => bIsRunning ? 'en cours' : '' },
                { sField: 'sDate', sLabel: 'Date' },
                { sField: 'sTimeStart', sLabel: 'Début' },
                { sField: 'sTimeEnd', sLabel: 'Fin' },
                { sField: 'nHoursElapsed', sLabel: 'Heures', fRender: nHoursElapsed => nHoursElapsed + ' heure(s)', sClass: 'uk-text-right' }
            ],
            oChrono: ES.store.chrono.select( ES.store.chrono.index('nIdProject', this.nId) )
        };
    },
    computed: {
        aFilteredChrono() {
            return Object.values(this.oChrono)
                .filter(oChrono => this.aFilterChrono.includes(oChrono._id))
                .sort( (oA, oB) => APP_getNumberDate(oA) - APP_getNumberDate(oB) )
        },

        nTotalHours() {
            return this.aFilteredChrono.reduce(
                (nTotalHours, oCurrentChrono) => {
                    return nTotalHours + oCurrentChrono.nHoursElapsed;
                },
                0
            );
        }
    },
    
    template: `
        <table class="v-summaryListItem uk-table uk-table-hover uk-table-small uk-margin-large-bottom">
            <caption>
                <h2 class="uk-h3 uk-position-relative">
                    {{sName}}
                    <span class="uk-text-default uk-position-center-right uk-padding-small">
                        {{nTotalHours}} heure(s)
                    </span>
                </h2>
            </caption> ` + /*
            <thead>
                <tr>
                    <th
                        v-for="oColumn in aColumn"
                        :class="[oColumn.sClass]"
                    >{{oColumn.sLabel}}</th>
                </tr>
            </thead> */ `
            <tbody>
                <tr
                    v-for="oCurrentChrono in aFilteredChrono"
                    :key="oCurrentChrono._id"
                >
                    <td
                        v-for="oColumn in aColumn"
                        :class="[oColumn.sClass]"
                    >
                        {{ oColumn.fRender ? oColumn.fRender( oCurrentChrono[oColumn.sField] ) : oCurrentChrono[oColumn.sField] }}
                    </td>
                </tr>
            </tbody>
        </table>
    `
};