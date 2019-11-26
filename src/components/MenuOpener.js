module.exports = {

    props: {
        sWindowTitle: String
    },

    template: `
        <a href="#" class="v-menuOpener uk-padding-small uk-text-primary" uk-toggle="target: .v-menuOffcanvas">
            <span class="uk-margin-small-right" uk-icon="menu"></span>
            <slot></slot> - {{sWindowTitle}}
        </a>
    `
};