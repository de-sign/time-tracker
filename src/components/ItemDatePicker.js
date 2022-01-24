module.exports = {

    components: {
        datepicker: vuejsDatepicker
    },

    props: {
        dDate: Date,
        bArrow: Boolean
    },
    data() {
        return {
            fr: vdp_translation_fr.js
        }
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
    
    template: `
        <span class="v-itemDatePicker">
            <a v-if="bArrow" href="#" uk-icon="chevron-left" @click="$emit('action', 'prev')"></a>
            <a v-if="bArrow" href="#" uk-icon="chevron-right" @click="$emit('action', 'next')"></a>
            <a href="#" class="uk-margin-small-right" uk-icon="calendar"></a>
            <div class="uk-padding-remove" uk-dropdown="pos: bottom-left">
                <datepicker
                    :value="dDate"
                    :inline="true"
                    :language="fr"
                    :monday-first="true"
                    @selected="$emit('action', 'set', $event)"
                ></datepicker>
            </div>
            <span class="v-itemDatePicker__title uk-text-emphasis uk-text-capitalize">{{sDate}}</span>
        </span>
    `
};