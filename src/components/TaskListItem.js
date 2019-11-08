module.exports = {

    components: {
        'task-list-item-part': require('./TaskListItemPart'),
    },

    props: {
        nId: Number,
        sName: String,
        nHourStart: Number,
        nHoursElapsed: Number
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
        addChrono() {
            console.log('TODO CHRONO');
        }
    },
    
    template: `
        <article class="v-taskListItem v-taskListColumn uk-margin-right">
            <header class="v-taskListItem__header uk-padding-small uk-padding-small uk-background-default">
                <h5 class="uk-margin-remove uk-text-normal uk-text-center uk-text-truncate" :title="sName">{{sName}}</h5>
            </header>
            <div v-for="nHour in aHour" class="v-taskListColumn__row uk-position-relative uk-padding-small uk-transition-toggle">
                <a href="#" class="uk-transition-fade uk-overlay-default uk-position-cover">
                    <span class="uk-position-center">
                        <span uk-icon="plus"></span>
                    </span>
                </a>
            </div>
        </article>
    `
};