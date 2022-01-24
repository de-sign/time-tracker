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
            oChrono: this.nId ? 
                ES.store.chrono.select( ES.store.chrono.index('nIdTask', this.nId) ) :
                {},
            bRemove: false
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
        this.$root.$on('task-list-item-chrono--add', (nId, nHour) => this.nId == nId && this.add(nHour) );
        this.$on('task-list-item-chrono--remove', nId => this.remove(nId));
        this.$nextTick( () => this.update() );
    },
    methods: {
        action(sAction, uArg) {
            this[ sAction ](uArg);
        },

        add(nHour) {
            const dDate = new Date( this.dDate.getTime() );
            if( nHour ){
                dDate.setHours(nHour);
                dDate.setMinutes(0);
            }
            dDate.setSeconds(0);
            
            const oAdd = ES.store.chrono.insert( {
                nIdTask: this.nId,
                nIdProject: this.nIdProject,
                sDate: APP_getStringDate(dDate),
                sDatetime: dDate.toISOString(),
                bIsRunning: !nHour,
                sTimeEnd: nHour ? null : dDate.getHours().toString().padStart(2, '0') + ':' + dDate.getMinutes().toString().padStart(2, '0')
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

        addTask(nHour) {
            this.$root.$emit('task-control-button--add-task', this.nIdProject, nHour);
        },

        removeTask() {
            if( this.bRemove || !ES.store.chrono.index('nIdTask', this.nId).length ){
                this.$root.$emit('task-list-item--remove', this.nId);
            } else {
                this.bRemove = true;
                setTimeout( () => {
                    this.bRemove = false;
                }, 2000 );
            }
        }
    },
    
    template: `
        <article
            class="v-taskListItem v-taskListColumn uk-margin-right"
            :class="{ '--suggest': !nId }"
        >
            <header class="v-taskListItem__header uk-padding-small uk-padding-small uk-background-muted uk-transition-toggle">
                <h2 class="uk-h5 uk-margin-remove uk-text-normal uk-text-center uk-text-truncate" :title="sName">{{sName}}</h2>
                <span
                    class="uk-transition-fade uk-position-center-right"
                >
                    <a @click="action(nId ? 'add' : 'addTask', false)" href="#" class="v-taskListItem__add uk-text-primary">
                        <span uk-icon="clock"></span>
                    </a>
                    <a
                        v-if="nId"
                        @click="removeTask()"
                        :title="bRemove ? 'Sure ?!' : ''"
                        href="#"
                        class="v-taskListItem__remove uk-text-danger"
                    >
                        <span :uk-icon="bRemove ? 'ban' : 'close'"></span>
                    </a>
                    <a
                        v-else
                        @click="action('addTask')"
                        href="#"
                        class="v-taskListItem__add uk-text-primary"
                    >
                        <span uk-icon="plus"></span>
                    </a>
                </span>
            </header>
            <div class="v-taskListItem__content uk-position-relative">
                <div class="v-taskListItem__listHour">
                    <div v-for="nHour in aHour" class="v-taskListColumn__row uk-position-relative uk-padding-small uk-transition-toggle">
                        <a
                            v-if="nId"
                            @click="action(nId ? 'add' : 'addTask', nHour)"
                            href="#"
                            class="v-taskListItem__add uk-transition-fade uk-position-cover"
                        >
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