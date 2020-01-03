function APP_getStringDate(dDate) {
    return dDate.getFullYear() + '-' + (dDate.getMonth() + 1).toString().padStart(2, '0') + '-' + dDate.getDate().toString().padStart(2, '0');
}

module.exports = {

    components: {
        'task-list-item-chrono': require('./TaskListItemChrono')
    },

    props: {
        nHourStart: Number,
        nHoursElapsed: Number,
        dDate: Date,

        nId: Number,
        nIdProject: Number,
        sName: String
    },
    data() {
        return {
            oChrono: ES.store.chrono.select( ES.store.chrono.index('nIdTask', this.nId) )
        };
    },
    computed: {
        aHour() {
            const aHour = [];
            for( let i = 0; i <= this.nHoursElapsed; i++ ){
                aHour.push(this.nHourStart + i);
            }
            return aHour;
        }
    },

    mounted() {
        this.$on('task-list-item-chrono--remove', nId => this.remove(nId));
        this.$nextTick( () => this.update() );
    },
    methods: {
        add(nHour) {
            const dDate = new Date( this.dDate.getTime() );
            dDate.setHours(nHour);
            dDate.setMinutes(0);
            dDate.setSeconds(0);
            
            const oAdd = ES.store.chrono.insert( {
                nIdTask: this.nId,
                nIdProject: this.nIdProject,
                sDate: APP_getStringDate(dDate),
                sDatetime: dDate.toISOString()
            } );
                
            this.oChrono = Object.assign( {},
                this.oChrono, {
                    [oAdd._id]: oAdd
                }
            );
        },

        remove(nId) {
            ES.store.chrono.delete(nId);
            this.oChrono = ES.store.chrono.select( ES.store.chrono.index('nIdTask', this.nId) );
        },

        update() {
            this.$children.map( oChild => oChild.$emit('task-list-item--update') );
            setTimeout( () => this.update(), 120000 );
        },

        removeTask() {
            UIkit.modal
                .confirm(
                    `
                        <h2 class="uk-modal-title">Supprimer une tâche</h2>
                        <p class="uk-text-danger">
                            Êtes vous sûr de vouloir supprimer définitivement <u>${this.sName}</u> et tous les chronomètres qui lui sont assignés ?
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
                        this.$root.$emit('task-list-item--remove', this.nId);
                    }
                );
            
        }
    },
    
    template: `
        <article class="v-taskListItem v-taskListColumn uk-margin-right">
            <header class="v-taskListItem__header uk-padding-small uk-padding-small uk-background-default uk-transition-toggle">
                <h2 class="uk-h5 uk-margin-remove uk-text-normal uk-text-center uk-text-truncate" :title="sName">{{sName}}</h2>
                <a @click="removeTask()" href="#" class="v-taskListItem__remove uk-transition-fade uk-position-center-right uk-text-danger">
                    <span uk-icon="close"></span>
                </a>
            </header>
            <div class="v-taskListItem__content uk-position-relative">
                <div class="v-taskListItem__listHour">
                    <div v-for="nHour in aHour" class="v-taskListColumn__row uk-position-relative uk-padding-small uk-transition-toggle">
                        <a @click="add(nHour)" href="#" class="v-taskListItem__add uk-transition-fade uk-overlay-default uk-position-cover">
                            <span class="uk-position-center">
                                <span uk-icon="plus"></span>
                            </span>
                        </a>
                    </div>
                </div>
                <div class="v-taskListItem__listChrono">
                    <task-list-item-chrono
                        v-for="oCurrentChrono in oChrono"
                        :key="oCurrentChrono._id"

                        :n-hour-start-ref="nHourStart"

                        :n-id="oCurrentChrono._id"
                        :s-datetime="oCurrentChrono.sDatetime"
                    ></task-list-item-part>
                </div>
            </div>
        </article>
    `
};