module.exports = {
    
    props: {
        sSelectedMenu: String,
        oMenu: Object
    },
    data() {
        return {
            hOffCanvas: null
        };
    },
    
    mounted() {
        this.hOffCanvas = document.getElementsByClassName('v-menuOffcanvas')[0];
    },
    methods: {
        change(sMenu) {
            this.$root.$emit('menu--change', sMenu);
            UIkit.offcanvas(this.hOffCanvas).hide();
        }
    },

    template: `
        <section class="v-menuOffcanvas" uk-offcanvas="mode: push; overlay: true">
            <nav class="uk-offcanvas-bar">
                <h1><slot></slot></h1>
                <ul class="uk-nav uk-nav-primary">
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
            </nav>
        </section>
    `
};