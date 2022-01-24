function APP_getStringDate(dDate) {
    return dDate.getFullYear() + '-' + (dDate.getMonth() + 1).toString().padStart(2, '0') + '-' + dDate.getDate().toString().padStart(2, '0');
}

module.exports = {

    components: {
        'task-list-header': require('./TaskListHeader'),
        'task-list-item': require('./TaskListItem')
    },

    props: {
        dDate: Date,
        oProject: Object
    },
    data() {
        return {
            nHourStart: 7,
            nHourEnd: 20,
            nDateRange: 11,
            oTask: ES.store.task.select( ES.store.task.index('sDate', APP_getStringDate(this.dDate)) )
        };
    },
    computed: {
        nHoursElapsed() {
            return this.nHourEnd - this.nHourStart;
        },

        aPossibleTask() {
            const aTask = Object.values(this.oTask),
                aPossibleTask = [],
                oIdProject = {},
                dRange = new Date( this.dDate ),
                nMid = Math.floor(this.nDateRange / 2);

            aTask.forEach( oTask => {
                oIdProject[ oTask.nIdProject ] = true;
            } );

            dRange.setDate( dRange.getDate() - nMid );
            for( let nIndex = 0; nIndex < this.nDateRange; nIndex++ ){
                if( nIndex != nMid ){
                    const oDateTask = ES.store.task.select( ES.store.task.index('sDate', APP_getStringDate(dRange)) );
                    Object.values(oDateTask).forEach( oTask => {
                        if( !oIdProject[oTask.nIdProject] ){
                            oIdProject[oTask.nIdProject] = true;
                            aPossibleTask.push( {
                                nIdProject: oTask.nIdProject,
                                sName: oTask.sName
                            } );
                        }
                    } );
                }
                dRange.setDate( dRange.getDate() + 1 );
            }

            aPossibleTask.sort( (oA, oB) => oA.sName.localeCompare(oB.sName, 'fr', { numeric: true, sensitivity: 'base' }) );
            Array.prototype.unshift.apply(aPossibleTask, aTask);

            return aPossibleTask;
        }
    },

    mounted() {
        this.$root.$on('task-control-button--add-task', (nIdProject, nHour) => {
            const nIdTask = this.add(nIdProject);
            nHour == null || this.$nextTick( () => {
                this.$root.$emit('task-list-item-chrono--add', nIdTask, nHour);
            } );
        } );
        this.$root.$on('task-list-item--remove', nId => this.remove(nId));
    },
    watch: {
        dDate(dNewDate, dOldDate) {
            this.oTask = ES.store.task.select( ES.store.task.index('sDate', APP_getStringDate(dNewDate)) );
        }
    },
    methods: {
        add(nIdProject) {
            const oAdd = ES.store.task.insert( {
                nIdProject: nIdProject,
                sName: this.oProject[nIdProject].sName,
                sDatetime: this.dDate.toISOString(),
                sDate: APP_getStringDate(this.dDate)
            } );
                    
            this.oTask = Object.assign( {},
                this.oTask, {
                    [oAdd._id]: oAdd
                }
            );

            return oAdd._id;
        },

        remove(nId) {
            ES.store.task.delete(nId);
            if( this.oTask[nId] ){
                this.oTask = ES.store.task.select( ES.store.task.index('sDate', APP_getStringDate(this.dDate)) );
            }

            ES.store.chrono.delete( ES.store.chrono.index('nIdTask', nId) );
        }
    },
    
    template: `
        <main class="uk-flex-auto uk-overflow-auto uk-position-relative uk-background-muted">
            <div class="uk-container uk-container-expand uk-text-nowrap uk-margin-top">
                <task-list-header
                    :n-hour-start="nHourStart"
                    :n-hours-elapsed="nHoursElapsed"
                ></task-list-header><!--

                --><task-list-item
                    v-for="oCurrentTask in aPossibleTask"
                    :key="oCurrentTask._id"

                    :n-hour-start="nHourStart"
                    :n-hours-elapsed="nHoursElapsed"
                    :d-date="dDate"
                    
                    :n-id="oCurrentTask._id"
                    :n-id-project="oCurrentTask.nIdProject"
                    :s-name="oCurrentTask.sName"
                ></task-list-item> 
            </div>
        </main>
    `
};