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
        oTaskDef: Object
    },
    data() {
        return {
            nHourStart: 8,
            nHourEnd: 17,
            oTask: ES.store.task.get(`oData.${APP_getStringDate(this.dDate)}`)
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
            this.oTask = ES.store.task.get(`oData.${APP_getStringDate(dNewDate)}`);
        }
    },
    methods: {
        add(nIdDefTask) {
            const nId = ES.store.task.get('nAutoIncrement'),
                oTask = Object.assign({}, this.oTask);

            oTask[nId] = {
                nId: nId,
                nIdDefTask: nIdDefTask,
                sName: this.oTaskDef[nIdDefTask].sName,
                sDate: this.dDate.toISOString()
            };
            this.oTask = oTask;

            ES.store.task.set( {
                nAutoIncrement: nId + 1,
                oData: Object.assign(
                    ES.store.task.get('oData'), {
                        [APP_getStringDate(this.dDate)]: this.oTask
                    }
                )
            } );
        },

        remove(nId) {
            const oDataTask = ES.store.task.get('oData'),
            oDataChrono = ES.store.chrono.get('oData');
            
            let sDate, oTask = Object.assign({}, this.oTask);
            
            if( oTask[nId] ){
                sDate = APP_getStringDate(this.dDate);
                delete oTask[nId];
                this.oTask = oTask;
            } else {
                for( sDate in oDataTask ){
                    if( oDataTask[sDate][nId] ){
                        oTask = oDataTask[sDate];
                        delete oTask[nId];
                        break;
                    }
                }
            }
            
            ES.store.task.set('oData', Object.assign(
                oDataTask, {
                    [sDate]: oTask
                }
            ) );

            delete oDataChrono[nId];
            ES.store.chrono.set('oData', oDataChrono);
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
                    :key="oCurrentTask.nId"

                    :n-hour-start="nHourStart"
                    :n-hours-elapsed="nHoursElapsed"
                    :d-date="dDate"
                    
                    :n-id="oCurrentTask.nId"
                    :s-name="oCurrentTask.sName"
                ></task-list-item> 
            </div>
        </main>
    `
};