function APP_getStringDate(dDate) {
    return dDate.getFullYear() + '-' + dDate.getMonth().toString().padStart(2, '0') + '-' + dDate.getDate().toString().padStart(2, '0');
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
        sName: String
    },
    data() {
        return {
            oChrono: ES.store.chrono.get(`oData.${this.nId}`) || {}
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
            const nId = ES.store.chrono.get('nAutoIncrement'),
                oChrono = Object.assign({}, this.oChrono),
                dDate = new Date( this.dDate.getTime() );

            dDate.setHours(nHour);
            dDate.setMinutes(0);
            dDate.setSeconds(0);

            oChrono[nId] = {
                nId: nId,
                nIdTask: this.nId,
                sDate: dDate.toISOString()
            };
            this.oChrono = oChrono;

            ES.store.chrono.set( {
                nAutoIncrement: nId + 1,
                oData: Object.assign(
                    ES.store.chrono.get('oData'), {
                        [this.nId]: this.oChrono
                    }
                )
            } );
        },

        remove(nId) {
            const oChrono = Object.assign({}, this.oChrono);
            delete oChrono[nId];
            this.oChrono = oChrono;

            ES.store.chrono.set('oData', Object.assign(
                ES.store.chrono.get('oData'), {
                    [this.nId]: this.oChrono
                }
            ) );
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
                        :key="oCurrentChrono.nId"

                        :n-hour-start-ref="nHourStart"

                        :n-id="oCurrentChrono.nId"
                        :n-id-task="oCurrentChrono.nIdTask"
                        :s-date="oCurrentChrono.sDate"
                    ></task-list-item-part>
                </div>
            </div>
        </article>
    `
};