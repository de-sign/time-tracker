let nUIdTask = 0;

module.exports = {

    components: {
        'task-control-date-picker': require('./TaskControlDatePicker'),
        'task-control-button': require('./TaskControlButton')
    },

    props: {
        dDate: Date,
        oDefTask: Object
    },
    
    template: `
        <header class="v-task-control uk-section uk-section-small">
            <div class="uk-container uk-container-small">
                <div class="uk-grid-small uk-flex-middle" uk-grid>
                    <div class="uk-width-expand">
                        <task-control-date-picker :d-date="dDate"></task-control-date-picker>
                    </div>
                    <div class="uk-width-auto">
                        <task-control-button :o-def-task="oDefTask"></task-control-button>
                    </div>
                </div>
            </div>
        </header>
    `
};