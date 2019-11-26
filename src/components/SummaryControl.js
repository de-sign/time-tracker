module.exports = {

    methods: {
        exportXLSX() {
            this.$root.$emit('summary-control--export');
        }
    },

    template: `
        <header class="v-task-control uk-section uk-section-small">
            <div class="uk-container uk-container-small uk-text-right">
                <button @click="exportXLSX" class="uk-button uk-button-default">
                    Exporter
                    <span class="uk-visible@s">en XLSX</span>
                </button>
            </div>
        </header>
    `
};