module.exports = {

    props: {
        sSelectedMenu: String,
        oMenu: Object
    },

    methods: {
        change(sMenu) {
            this.$root.$emit('menu--change', sMenu);
        }
    },

    template: `
        <nav class="uk-navbar-container" uk-navbar>
            <div class="uk-navbar-left">
                <a class="uk-navbar-item uk-logo uk-text-primary" href="#">
                    <slot></slot>
                </a>
                <ul class="uk-navbar-nav uk-margin-small-top">
                    <li
                        v-for="oCurrentMenu in oMenu"
                        :key="oCurrentMenu.sCode"
                        :class="{ 'uk-active': sSelectedMenu == oCurrentMenu.sCode }"
                    >
                        <a @click="change(oCurrentMenu.sCode)" href="#">
                            <span :uk-icon="oCurrentMenu.sIcon" class="uk-margin-small-right"></span>
                            <span class="ES-menu-label-text" v-html="oCurrentMenu.sLabel"></span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    `
};