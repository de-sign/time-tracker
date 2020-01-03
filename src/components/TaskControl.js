module.exports = {

    components: {
        'item-date-picker': require('./ItemDatePicker'),
        'task-control-button': require('./TaskControlButton')
    },

    props: {
        dDate: Date,
        oProject: Object
    },

    methods: {
        action(sAction, uValue) {
            this.$root.$emit('task-control--item-date-picker--' + sAction, uValue);
        }
    },
    
    template: `
        <header class="v-taskControl uk-section uk-section-small">
            <div class="uk-container uk-container-small">
                <div class="uk-grid-small uk-flex-middle" uk-grid>
                    <div class="uk-width-expand">
                        <item-date-picker
                            :b-arrow="true"
                            :d-date="dDate"
                            @action="action"
                        ></item-date-picker>
                    </div>
                    <div class="uk-width-auto">
                        <task-control-button :o-project="oProject"></task-control-button>
                    </div>
                </div>
            </div>
        </header>
    `
};