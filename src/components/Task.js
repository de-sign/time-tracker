function APP_getStringDate(dDate) {
    return dDate.getFullYear() + '-' + (dDate.getMonth() + 1).toString().padStart(2, '0') + '-' + dDate.getDate().toString().padStart(2, '0');
}

module.exports = {

    components: {
        'task-control': require('./TaskControl'),
        'task-list': require('./TaskList'),
    },
    
    data() {
        return {
            dDate: new Date(),
            oProject: ES.store.project.select()
        };
    },
    computed: {
        nHoursElapsed() {
            return this.nHourEnd - this.nHourStart;
        }
    },

    mounted() {
        this.$root.$on('task-control--item-date-picker--prev', () => this.modifyDate(-1) );
        this.$root.$on('task-control--item-date-picker--next', () => this.modifyDate(1) );
        this.$root.$on('task-control--item-date-picker--set', sDate => this.setDate(sDate) );
        this.$root.$on('task-control-button--add-def-task', sName => this.addDefTask(sName) );
        this.$root.$on('task-control-button--remove-def-task', nId => this.removeDefTask(nId) );
    },
    methods: {

        modifyDate(nDayModify) {
            this.dDate.setDate( this.dDate.getDate() + nDayModify );
            this.setDate( this.dDate.getTime() );
        },

        setDate(uDate) {
            this.dDate = new Date(uDate);
        },

        addDefTask(sName) {
            const oAdd = ES.store.project.insert( {
                sName: sName.trim()
            } );
                
            this.oProject = Object.assign( {},
                this.oProject, {
                    [oAdd._id]: oAdd
                }
            );

            this.$nextTick( () => this.$root.$emit('task-control-button--add-task', oAdd._id) );
        },

        removeDefTask(nId) {
            
            delete this.oProject[nId];
            this.oProject = Object.assign({}, this.oProject);

            ES.store.project.delete(nId);
            ES.store.task
                .index('nIdProject', nId)
                .forEach( nIdTask => this.$root.$emit('task-list-item--remove', nIdTask) );
        }
    },
    
    template: `
        <section class="v-task uk-flex uk-flex-column uk-height-1-1">
            <task-control :d-date="dDate" :o-project="oProject"></task-control>
            <task-list :d-date="dDate" :o-project="oProject"></task-list>
        </section>
    `
};