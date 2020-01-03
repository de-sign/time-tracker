module.exports = {

    props: {
        aPossibleProject: Array,
        oCheckedProject: Object
    },

    methods: {
        isChecked(nId) {
            return this.oCheckedProject[nId] == undefined || this.oCheckedProject[nId];
        },
        check(nId) {
            this.$root.$emit('summary-control-button--check', nId);
        },
        exportXLSX() {
            this.$root.$emit('summary-control--export');
        }
    },
    
    template: `
        <div class="v-taskControlButton uk-inline uk-text-right">
            <button v-show="aPossibleProject.length" class="uk-button uk-button-default" >
                Filtrer
                <span class="uk-visible@s">les tâches</span>
            </button>
            <div class="uk-text-left" uk-dropdown="pos: bottom-right">
                <ul class="uk-nav uk-dropdown-nav uk-height-max-large uk-overflow-auto">
                    <li
                        v-for="oCurrentProject in aPossibleProject"
                        :key="oCurrentProject._id"
                        class="uk-transition-toggle uk-position-relative"
                    >
                        <a href="#" class="uk-display-block" @click="check(oCurrentProject._id)">
                            <input
                                :checked="isChecked(oCurrentProject._id)"
                                class="uk-checkbox uk-margin-small-right" type="checkbox"
                            >
                            <span v-html="oCurrentProject.sName"></span>
                        </a>
                    </li>
                </ul>
            </div>
            <button @click="exportXLSX" class="uk-button uk-button-primary">
                Exporter
                <span class="uk-visible@s">en XLSX</span>
            </button>
        </div>
    `
};
            