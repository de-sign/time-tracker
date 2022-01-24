module.exports = {

    props: {
        nHourStart: Number,
        nHoursElapsed: Number
    },
    computed: {
        aHour() {
            const aHour = [];
            for( let i = 0; i <= this.nHoursElapsed; i++ ){
                aHour.push( {
                    nHour: this.nHourStart + i,
                    sClass: ( i && i < this.nHoursElapsed ) ?
                        'uk-text-emphasis' :
                        'uk-text-muted'
                } );
            }
            return aHour;
        }
    },

    methods: {},
    
    template: `
        <header class="v-taskListHeader v-taskListColumn uk-background-muted uk-margin-right">
            <div class="uk-padding-small uk-padding-remove-left">
                <div class="uk-h5 uk-margin-remove">&nbsp;</div>
            </div>
            <div v-for="oHour in aHour" class="v-taskListColumn__row uk-position-relative uk-padding-small uk-padding-remove-left">
                <span
                    :class="[oHour.sClass]"
                    class="v-taskListHeader__hour uk-background-muted uk-position-top-left uk-padding-small uk-padding-remove-left"
                >
                    {{oHour.nHour}}h
                </span>
                {{oHour.sClass}}h
            </div>
        </header>
    `
};