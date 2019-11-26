function APP_getNumberDate(oChrono) {
    return parseInt( ( oChrono.sDate + oChrono.sTimeStart ).replace(/-|:/g, '') );
}

module.exports = {

    components: {},

    props: {
        nId: Number,
        sName: String
    },
    data() {
        return {
            aColumn: [
                // { sField: 'sDescription', sLabel: 'Description' },
                { sField: 'sDate', sLabel: 'Date' },
                { sField: 'sTimeStart', sLabel: 'Début' },
                { sField: 'sTimeEnd', sLabel: 'Fin' },
                { sField: 'nHoursElapsed', sLabel: 'Heures' },
                { sField: 'sName', sLabel: 'Nom' },
                { sField: 'bIsSupport', sLabel: 'Support' }
            ],
            oChrono: ES.store.chrono.select( ES.store.chrono.index('nIdProject', this.nId) )
        };
    },
    computed: {
        oSortedChrono() {
            return Object.values(this.oChrono).sort( (oA, oB) => APP_getNumberDate(oA) - APP_getNumberDate(oB) );
        }
    },
    
    template: `
        <table class="v-summaryListItem uk-table uk-table-justify uk-table-hover uk-table-small uk-margin-large-bottom">
            <caption>
                <h2 class="uk-h3">{{sName}}</h2>
            </caption>
            <thead>
                <tr>
                    <th v-for="oColumn in aColumn">{{oColumn.sLabel}}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="oCurrentChrono in oSortedChrono"
                    :key="oCurrentChrono._id"
                >
                    <td v-for="oColumn in aColumn">
                        {{oCurrentChrono[oColumn.sField]}}
                    </td>
                </tr>
            </tbody>
        </table>
    `
};