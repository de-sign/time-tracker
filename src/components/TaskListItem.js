let nUIdChrono = 0;

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
            aChrono: []
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

    methods: {
        addChrono(nHour) {
            const dDate = new Date( this.dDate.getTime() );
            dDate.setHours(nHour);
            dDate.setMinutes(0);

            this.aChrono.push( {
                nId: ++nUIdChrono,
                dDateInit: dDate
            } );
        }
    },
    
    template: `
        <article class="v-taskListItem v-taskListColumn uk-margin-right">
            <header class="v-taskListItem__header uk-padding-small uk-padding-small uk-background-default">
                <h2 class="uk-h5 uk-margin-remove uk-text-normal uk-text-center uk-text-truncate" :title="sName">{{sName}}</h2>
            </header>
            <div class="v-taskListItem__content uk-position-relative">
                <div class="v-taskListItem__listHour">
                    <div v-for="nHour in aHour" class="v-taskListColumn__row uk-position-relative uk-padding-small uk-transition-toggle">
                        <a @click="addChrono(nHour)" href="#" class="v-taskListItem__addChrono uk-transition-fade uk-overlay-default uk-position-cover">
                            <span class="uk-position-center">
                                <span uk-icon="plus"></span>
                            </span>
                        </a>
                    </div>
                </div>
                <div class="v-taskListItem__listChrono">
                    <task-list-item-chrono
                        v-for="oChrono in aChrono"
                        :key="oChrono.nId"

                        :n-hour-start-ref="nHourStart"

                        :n-id="oChrono.nId"
                        :d-date-init="oChrono.dDateInit"
                    ></task-list-item-part>
                </div>
            </div>
        </article>
    `
};