module.exports = {

    data() {
        return {
            hElement: null,
            oChrono: null,

            sName: '',
            sDescription: '',
            sTimeStart: '',
            sTimeEnd: ''
        };
    },

    mounted() {
        this.hElement = document.getElementById('v-taskModal');
        this.$root.$on('task-list-item-chrono--edit', oChrono => this.open(oChrono));
    },
    methods: {
        open(oChrono) {
            this.oChrono = oChrono;
            this.sName = oChrono.sName;
            this.sDescription = oChrono.sDescription;
            this.sTimeStart = oChrono.sTimeStart;
            this.sTimeEnd = oChrono.sTimeEnd;

            this.$nextTick( () => UIkit.modal(this.hElement).show() );
        },
        
        save() {
            this.oChrono.set(this);
            this.$nextTick( () => UIkit.modal(this.hElement).hide() );
        }
    },
    
    template: `
        <div id="v-taskModal" class="uk-flex-top" uk-modal>
            <div class="uk-modal-dialog uk-modal-body">
                <h2 class="uk-modal-title"></h2>
                <form>
                    <div class="uk-margin">
                        <input class="uk-input" type="text" placeholder="Name" v-model="sName">
                    </div>
                    <div class="uk-margin">
                        <textarea class="uk-textarea" rows="3" placeholder="Description" v-model="sDescription"></textarea>
                    </div>
                    <div class="uk-margin">
                        <input class="uk-input" type="time" placeholder="Name" v-model="sTimeStart">
                    </div>
                    <div class="uk-margin">
                        <input class="uk-input" type="time" placeholder="Name" v-model="sTimeEnd">
                    </div>
                </form>
                <div class="uk-text-right">
                    <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                    <button @click="save" class="uk-button uk-button-primary" type="button">Save</button>
                </div>
            </div>
        </div>
    `
};