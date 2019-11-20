module.exports = {

    props: {
        oTaskDef: Object
    },
    data() {
        return {
            sSearch: ''
        };
    },
    computed: {
        aSortedDefTask() {
            return Object.entries(this.oTaskDef)
                .map( aA => aA[1] )
                .sort( (oA, oB) => {
                    return oA.sName.localeCompare(oB.sName, 'fr', { numeric: true, sensitivity: 'base' } );
                } );
        },
        aFilteredDefTask() {
            return this.sSearch ?
                this.aSortedDefTask.filter( oA => oA.sName.toLowerCase().indexOf( this.sSearch.toLowerCase() ) != -1 ) :
                [...this.aSortedDefTask];
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
                <div class="uk-inline uk-margin-bottom">
                    <span class="uk-form-icon" uk-icon="icon: search"></span>
                    <input class="uk-input" type="text" v-model="sSearch" @blur="resetSearch">
                </div>
                <ul class="uk-nav uk-dropdown-nav">
                    <li
                        v-for="oCurrentDefTask in aFilteredDefTask"
                        :key="oCurrentDefTask.nId"
                        class="uk-transition-toggle uk-position-relative"
                    >
                        <a href="#" @click="action('add-task', oCurrentDefTask.nId)">{{oCurrentDefTask.sName}}</a>
                        <a @click="action('remove-def-task', oCurrentDefTask.nId)" href="#" class="v-taskListItem__remove uk-transition-fade uk-position-center-right uk-text-danger">
                            <span uk-icon="close"></span>
                        </a>
                    </li>
                </ul>
                <div v-if="sSearch">
                    <a href="#" @click="action('add-def-task', sSearch)">Créer une nouvelle tâche</a>
                </div>
            </div>
        </div>
    `
};