module.exports = {

    props: {
        nHourStart: Number,
        nHoursElapsed: Number
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

    methods: {},
    
    template: `
        <header class="v-taskListHeader v-taskListColumn uk-background-default uk-margin-right">
            <div class="uk-padding-small">
                <div class="uk-h5 uk-margin-remove">&nbsp;</div>
            </div>
            <div v-for="nHour in aHour" class="v-taskListColumn__row uk-position-relative uk-padding-small">
                <span class="v-taskListHeader__hour uk-text-muted uk-background-default uk-position-top-left uk-padding-small">
                    {{nHour}}h
                </span>
                {{nHour}}h
            </div>
        </header>
    `
};