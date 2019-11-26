function APP_getStringDate(dDate) {
    return dDate.getFullYear() + '-' + dDate.getMonth().toString().padStart(2, '0') + '-' + dDate.getDate().toString().padStart(2, '0');
}

module.exports = {

    components: {
        'task-control': require('./TaskControl'),
        'task-list': require('./TaskList'),
    },

    props: {
        oProject: Object
    },
    data() {
        return {
            dDate: new Date()
        };
    },
    computed: {
        nHoursElapsed() {
            return this.nHourEnd - this.nHourStart;
        }
    },

    mounted() {
        this.$root.$on('task-control-date-picker--prev', () => this.setDate(-1) );
        this.$root.$on('task-control-date-picker--next', () => this.setDate(1) );
        this.$root.$on('task-control-button--add-def-task', sName => this.addDefTask(sName) );
        this.$root.$on('task-control-button--remove-def-task', nId => this.removeDefTask(nId) );
    },
    methods: {

        setDate(nDayModify) {
            this.dDate.setDate( this.dDate.getDate() + nDayModify );
            this.dDate = new Date(this.dDate.getTime());
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
            const oProject = Object.assign({}, this.oProject);

            UIkit.modal
                .confirm(
                    `
                        <h2 class="uk-modal-title">Supprimer un projet</h2>
                        <p class="uk-text-danger">
                            Êtes vous sûr de vouloir supprimer définitivement <u>${this.oProject[nId].sName}</u> ainsi que toutes les tâches et tous les chronomètres qui lui sont assignés ?
                        </p>
                    `,
                    {
                        labels: {
                            ok: 'Supprimer',
                            cancel: 'Annuler'
                        }
                    }
                )
                .then(
                    () => {
                        ES.store.task
                            .index('nIdProject', nId)
                            .forEach( nIdTask => this.$root.$emit('task-list-item--remove', nIdTask) );
                    }
                );
        }
    },
    
    template: `
        <section class="v-task">
            <div class="uk-flex uk-flex-column">
                <task-control :d-date="dDate" :o-project="oProject"></task-control>
                <task-list :d-date="dDate" :o-project="oProject"></task-list>
            </div>
        </section>
    `
};