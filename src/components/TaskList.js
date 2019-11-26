function APP_getStringDate(dDate) {
    return dDate.getFullYear() + '-' + dDate.getMonth().toString().padStart(2, '0') + '-' + dDate.getDate().toString().padStart(2, '0');
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
            nHourStart: 8,
            nHourEnd: 17,
            oTask: ES.store.task.select( ES.store.task.index('sDate', APP_getStringDate(this.dDate)) )
        };
    },
    computed: {
        nHoursElapsed() {
            return this.nHourEnd - this.nHourStart;
        }
    },

    mounted() {
        this.$root.$on('task-control-button--add-task', nId => this.add(nId));
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
        <main>
            <div class="uk-container uk-container-small uk-text-nowrap">
                <task-list-header
                    :n-hour-start="nHourStart"
                    :n-hours-elapsed="nHoursElapsed"
                ></task-list-header><!--

                --><task-list-item
                    v-for="oCurrentTask in oTask"
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