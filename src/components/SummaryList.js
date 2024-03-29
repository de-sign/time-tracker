function APP_getNumberDate(oChrono) {
    return parseInt( ( oChrono.sDate + oChrono.sTimeStart ).replace(/-|:/g, '') );
}

module.exports = {

    components: {
        'summary-list-item': require('./SummaryListItem')
    },

    props: {
        oProject: Object,
        aSortedProject: Array,
        aFilteredProject: Array,
        aFilterChrono: Array,
        dDateStart: Date,
        dDateEnd: Date
    },

    mounted(){
        this.$root.$on('summary-control--export', () => this.export() );
    },
    methods: {
        export() {
            const oXlsx = ES.excel.export.create(),
                oSheet = oXlsx.User, aId = [];

            // Sheet Parametre
            oXlsx.Parametre.appendRow.apply( oXlsx.Parametre, this.aSortedProject.map( oProject => [oProject.sName] ) );

            // Sheet User
            this.aFilteredProject.forEach( oProject => {
                [].push.apply( aId, ES.store.chrono
                    .index('nIdProject', oProject._id)
                    .filter(nId => this.aFilterChrono.includes(nId))
                );
            } );

            Object.values( ES.store.chrono.select(aId) )
                .sort( (oA, oB) => APP_getNumberDate(oA) - APP_getNumberDate(oB) )
                .forEach( oChrono => {

                    const nTpsHH = Math.floor(oChrono.nHoursElapsed),
                        nTpsMM = Math.floor( (oChrono.nHoursElapsed - nTpsHH) * 60 );

                    oSheet.appendRow( [
                        oChrono.sDate.split('-').splice(0, 2).join('-'), // YYYY-MM
                        this.oProject[ oChrono.nIdProject ].sName, // Task
                        nTpsHH || null, // HH
                        nTpsMM || null, // MM
                        `IF( D${oSheet._row} * 60 + E${oSheet._row} = 0, "", D${oSheet._row} * 60 + E${oSheet._row})`, // Tot MM
                        `IF( F${oSheet._row} = "", "", F${oSheet._row} / 60)`, // Tot HH
                        oChrono.sName // Comment
                    ] );
                } );

            // Write file
            ES.remote.dialog.showSaveDialog( {
                defaultPath: path.join(ES.remote.app.getPath('documents'), oXlsx._options.cwd, oXlsx._options.name),
            } ).then( oReturn => {
                !oReturn.canceled && oXlsx.write( oReturn.filePath );
            } );
        }
    },
    
    template: `
        <main class="v-summaryList uk-section uk-section-small uk-overflow-auto uk-position-relative uk-background-muted">
            <div class="uk-container uk-container-small">
                <summary-list-item
                    v-for="oCurrentProject in aFilteredProject"
                    :key="oCurrentProject._id"
                    
                    :n-id="oCurrentProject._id"
                    :s-name="oCurrentProject.sName"
                    :a-filter-chrono="aFilterChrono"
                ></summary-list-item> 
            </div>
        </main>
    `
};