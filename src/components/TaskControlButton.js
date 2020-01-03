module.exports = {

    props: {
        oProject: Object
    },
    data() {
        return {
            sSearch: ''
        };
    },
    computed: {
        aSortedProject() {
            return Object.entries(this.oProject)
                .map( aA => aA[1] )
                .sort( (oA, oB) => {
                    return oA.sName.localeCompare(oB.sName, 'fr', { numeric: true, sensitivity: 'base' } );
                } );
        },
        aFilteredProject() {
            const sEscapedSearch = this.sSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                rSearch = new RegExp(`(${sEscapedSearch})`, 'i');
            return this.sSearch ?
                this.aSortedProject
                    .filter( oA => rSearch.test(oA.sName) )
                    .map( oA => Object.assign( {}, oA, {
                        sName: oA.sName.replace(rSearch, '<mark>$1</mark>')
                    } ) ) :
                [...this.aSortedProject];
        }
    },

    methods: {
        resetSearch() {
            setTimeout( () => this.sSearch = '', 800 );
        },

        action(sAction, uArgs) {
            this.$root.$emit('task-control-button--' + sAction, uArgs);
        }
    },
    
    template: `
        <div class="v-taskControlButton uk-inline uk-text-right">
            <button class="uk-button uk-button-default">
                Ajouter
                <span class="uk-visible@s">une tâche</span>
            </button>
            <div class="uk-text-left" uk-dropdown="pos: bottom-right">
                <div class="uk-margin-bottom">
                    <div class="uk-inline uk-width-1-1">
                        <span class="uk-form-icon" uk-icon="icon: search"></span>
                        <input class="uk-input" type="text" v-model="sSearch" @blur="resetSearch">
                    </div>
                </div>
                <ul v-if="aFilteredProject.length" class="uk-nav uk-dropdown-nav uk-height-max-large uk-overflow-auto">
                    <li
                        v-for="oCurrentProject in aFilteredProject"
                        :key="oCurrentProject._id"
                        class="uk-transition-toggle uk-position-relative"
                    >
                        <a @click="action('add-task', oCurrentProject._id)" href="#" class="v-taskControlButton__add" v-html="oCurrentProject.sName"></a>
                        <a
                            href="#"
                            @click="action('remove-def-task', oCurrentProject._id)"
                            class="v-taskControlButton__remove uk-transition-fade uk-position-center-right uk-text-danger uk-padding-small"
                        >
                            <span uk-icon="close"></span>
                        </a>
                    </li>
                </ul>
                <div v-show="sSearch" class="uk-margin-top">
                    <a @click="action('add-def-task', sSearch)" class="v-taskControlButton__new" href="#">Créer une nouvelle tâche</a>
                </div>
            </div>
        </div>
    `
};