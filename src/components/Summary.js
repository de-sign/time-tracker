function APP_getNumberDate(dDate) {
    return parseInt( dDate.getFullYear() + (dDate.getMonth() + 1).toString().padStart(2, '0') + dDate.getDate().toString().padStart(2, '0') );
}

module.exports = {

    components: {
        'summary-control': require('./SummaryControl'),
        'summary-list': require('./SummaryList')
    },

    props: {
        oProject: Object
    },
    data() {
        const dLastYear = new Date();
        dLastYear.setFullYear( dLastYear.getFullYear() - 1 );
        return {
            dDateStart: dLastYear,
            dDateEnd: new Date(),
            oCheckedProject: {},
            oChrono: ES.store.chrono.select(),
            oIndexedId: ES.store.chrono.index('sDate')
        };
    },
    computed: {
        aFilterChrono() {
            const aFilterChrono = [],
                nStart = APP_getNumberDate(this.dDateStart),
                nEnd = APP_getNumberDate(this.dDateEnd);

            for( let i in this.oIndexedId ){
                const nCurrent = parseInt( i.replace(/-/g, '') );
                if( nCurrent >= nStart && nCurrent <= nEnd ){
                    [].push.apply(aFilterChrono, this.oIndexedId[i]);
                }
            }
            return aFilterChrono;
        },
        aSortedProject() {
            return Object.values(this.oProject)
                .sort( (oA, oB) => oA.sName.localeCompare(oB.sName, 'fr', { numeric: true, sensitivity: 'base' }) );
        },
        aPossibleProject() {
            return this.aSortedProject
                .filter( oA => {
                    return ES.store.chrono
                        .index('nIdProject', oA._id)
                        .filter(nId => this.aFilterChrono.includes(nId))
                        .length;
                } );
        },
        aFilteredProject() {
            return this.aPossibleProject
                .filter( oA => this.isChecked(oA._id) );
        }
    },

    mounted() {
        this.$root.$on('summary-control--item-date-picker--set', (sTarget, uDate) => this.setDate(sTarget, uDate) );
        this.$root.$on('summary-control-button--check', nId => this.checkProject(nId) );
    },
    methods: {
        setDate(sTarget, uDate) {
            if( sTarget == 'start' ){
                this.dDateStart = new Date(uDate);
            } else {
                this.dDateEnd = new Date(uDate);
            }
        },
        checkProject(nId) {
            this.oCheckedProject[nId] = !this.isChecked(nId);
            this.oCheckedProject = Object.assign({}, this.oCheckedProject);
        },
        isChecked(nId) {
            return this.oCheckedProject[nId] == undefined || this.oCheckedProject[nId];
        }
    },

    template: `
        <section class="v-sumary uk-flex uk-flex-column">
            <summary-control
                :a-possible-project="aPossibleProject"
                :o-checked-project="oCheckedProject"
                :d-date-start="dDateStart" :d-date-end="dDateEnd"
            ></summary-control>
            <summary-list
                :o-project="oProject"
                :a-sorted-project="aSortedProject"
                :a-filtered-project="aFilteredProject"
                :a-filter-chrono="aFilterChrono"
                :d-date-start="dDateStart" :d-date-end="dDateEnd"
            ></summary-list>
        </section>
    `
};