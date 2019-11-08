module.exports = {
    props: {
        dDate: Date
    },
    computed: {
        sDate() {
            return this.dDate.toLocaleDateString( 'fr-FR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            } );
        }
    },

    methods: {
        action(sAction) {
            this.$root.$emit('task-control-date-picker--' + sAction);
        }
    },
    
    template: `
        <div class="v-taskControlDatePicker">
            <a href="#" class="uk-margin-small-left" uk-icon="chevron-left" @click="action('prev')"></a>
            <a href="#" uk-icon="chevron-right" @click="action('next')"></a>
            <span class="v-taskControlDatePicker__title uk-text-emphasis uk-text-capitalize">{{sDate}}</span>
        </div>
    `
};