module.exports = {

    components: {
        'item-date-picker': require('./ItemDatePicker'),
        'summary-control-button': require('./SummaryControlButton')
    },

    props: {
        aPossibleProject: Array,
        oCheckedProject: Object,
        dDateStart: Date,
        dDateEnd: Date
    },

    methods: {
        actionDateStart(sAction, uValue) {
            this.$root.$emit('summary-control--item-date-picker--' + sAction, 'start', uValue);
        },
        actionDateEnd(sAction, uValue) {
            this.$root.$emit('summary-control--item-date-picker--' + sAction, 'end', uValue);
        }
    },

    template: `
        <header class="v-summaryControl uk-section uk-section-small uk-flex-none uk-background-default uk-box-shadow-small uk-position-relative uk-position-z-index">
            <div class="uk-container uk-container-expand">
                <div class="uk-grid-small uk-flex-middle" uk-grid>
                    <div class="uk-width-medium">
                        <span class="uk-text-bolder uk-margin-small-left uk-margin-small-right">&nbsp;Du</span>
                        <item-date-picker :d-date="dDateStart" @action="actionDateStart"></item-date-picker>
                    </div>
                    <div class="uk-width-expand">
                        <span class="uk-text-bolder uk-margin-small-right">Au</span>
                        <item-date-picker :d-date="dDateEnd" @action="actionDateEnd"></item-date-picker>
                    </div>
                    <div class="uk-width-auto">
                        <summary-control-button
                            :a-possible-project="aPossibleProject"
                            :o-checked-project="oCheckedProject"
                        ></summary-control-button>
                    </div>
                </div>
            </div>
        </header>
    `
};