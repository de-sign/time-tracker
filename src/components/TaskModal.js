module.exports = {

    data() {
        return {
            hElement: null,
            oChrono: null,
            oError: {},

            sName: '',
            sDescription: '',
            sTimeStart: '',
            sTimeEnd: '',
            bIsRunning: false,

            nRemoveTimeout: null
        };
    },

    mounted() {
        this.hElement = document.getElementsByClassName('v-taskModal')[0];
        this.$root.$on('task-list-item-chrono--edit', oChrono => this.open(oChrono));
    },
    methods: {
        open(oChrono) {
            if( this.nRemoveTimeout ){
                clearTimeout( this.nRemoveTimeout );
                this.nRemoveTimeout = null;
            }
            bRemove = false;
            this.oError = {};

            this.assign(oChrono);
            this.$nextTick( () => UIkit.modal(this.hElement).show() );
        },
        
        save() {
            if( this.check() ){
                this.oChrono.set(this);
                this.$nextTick( () => UIkit.modal(this.hElement).hide() );
            }
        },

        remove() {
            if( this.nRemoveTimeout ){
                this.oChrono.remove();
                this.$nextTick( () => UIkit.modal(this.hElement).hide() );
            } else {
                this.nRemoveTimeout = setTimeout( () => {
                    this.nRemoveTimeout = null;
                }, 2000 );
            }
        },

        assign(oChrono) {
            this.oChrono = oChrono;
            this.sName = oChrono.sName;
            this.sDescription = oChrono.sDescription;
            this.sTimeStart = oChrono.sTimeStart;
            this.sTimeEnd = oChrono.sTimeEnd;
            this.bIsRunning = oChrono.bIsRunning;
        },

        check() {
            let bError = false;
            const oError = {};

            if( this.sName.trim() == '' ){
                oError.sName = 'Aucun nom transmis';
                bError = true;
            }

            if( this.sTimeStart == '' || this.sTimeStart == '--:--' ){
                oError.sTimeStart = 'Aucune heure de début transmise';
                bError = true;
            }
                
            if( !this.bIsRunning ){

                if( this.sTimeEnd == '' || this.sTimeEnd == '--:--' ){
                    oError.sTimeEnd = 'Aucune heure de fin transmise';
                    bError = true;
                }

                else if( !oError.sTimeStart && parseInt(this.sTimeEnd.split(':').join('')) < parseInt(this.sTimeStart.split(':').join('')) ){
                    oError.sTimeEnd = 'L\'heure de fin est inférieur à l\'heure de début';
                    bError = true;
                }
            }
            this.oError = oError;

            return !bError;
        }
    },
    
    template: `
        <div class="v-taskModal uk-flex-top" uk-modal>
            <div class="uk-modal-dialog uk-margin-auto-vertical">
            <form>
                <div class="uk-modal-body">
                    <h2 class="uk-modal-title">Éditer un chronomètre</h2>
                    <div class="uk-margin">
                        <span class="uk-text-small uk-text-danger">{{oError.sName}}</span>
                        <input v-model="sName" :class="{ 'uk-form-danger': oError.sName }" class="uk-input uk-h2" type="text" placeholder="Name">
                    </div>
                    <div class="uk-margin">
                        <textarea class="uk-textarea" rows="5" placeholder="Description de la tâche" v-model="sDescription"></textarea>
                    </div>
                    <div class="uk-grid-small uk-margin uk-flex-middle" uk-grid>
                        <div class="uk-width-1-6">
                            Début
                        </div>
                        <div class="uk-width-5-6">
                            <span class="uk-text-small uk-text-danger">{{oError.sTimeStart}}</span>
                            <input v-model="sTimeStart" :class="{ 'uk-form-danger': oError.sTimeStart }" class="uk-input" type="time" placeholder="Name">
                        </div>
                    </div>
                    <div class="uk-grid-small uk-margin uk-flex-middle" uk-grid>
                        <div class="uk-width-1-6">
                            Fin
                        </div>
                        <div class="uk-width-5-6">
                            <div class="uk-margin">
                                <span class="uk-text-small uk-text-danger">{{oError.sTimeEnd}}</span>
                                <input v-model="sTimeEnd" :disabled="bIsRunning" :class="{ 'uk-form-danger': oError.sTimeEnd }" class="uk-input" type="time" placeholder="Name">
                                <label>
                                    <input class="uk-checkbox" type="checkbox" v-model="bIsRunning">
                                    Est actuellement en cours d'execution
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="uk-modal-footer uk-background-muted">
                    <div class="uk-grid-small" uk-grid>
                        <div class="uk-text-left uk-width-auto">
                            <button
                                @click="remove"
                                :class="{ 'ES-active': nRemoveTimeout }"
                                class="uk-button uk-button-danger"
                                type="button"
                            >
                                {{ nRemoveTimeout ? "Sure ?!" : "Supprimer" }}
                            </button>
                        </div>
                        <div class="uk-text-right uk-width-expand">
                            <button class="uk-button uk-button-default uk-modal-close" type="button">Annuler</button>
                            <button @click="save" class="uk-button uk-button-primary" type="button">Sauver</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `
};