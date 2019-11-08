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
                <nav uk-navbar>
                    <div class="uk-navbar-left">
                        <task-control-date-picker :d-date="dDate"></task-control-date-picker>
                    </div>
                    <div class="uk-navbar-right">
                        <task-control-button :o-def-task="oDefTask"></task-control-button>
                    </div>
                </nav>
            </div>
        </header>
    `
};