let nUIdTask = 0;

module.exports = {

    components: {
        'task-list-header': require('./TaskListHeader'),
        'task-list-item': require('./TaskListItem')
    },

    props: {
        dDate: Date,
        oDefTask: Object
    },
    data() {
        return {
            nHourStart: 8,
            nHourEnd: 17,
            aTask: []
        };
    },
    computed: {
        nHoursElapsed() {
            return this.nHourEnd - this.nHourStart;
        }
    },

    created() {
        this.$root.$on('task-control-button--add-task', nId => this.addTask(nId));
    },
    watch: {
        dDate(dNewDate, dOldDate) {
            this.aTask = [];
        }
    },
    methods: {
        addTask(nId) {
            this.aTask.push( {
                nId: ++nUIdTask,
                nIdDeftask: nId,
                sName: this.oDefTask[nId]
            } );
        }
    },
    
    template: `
        <main>
            <div class="uk-container uk-container-small uk-text-nowrap">
                <task-list-header
                    :n-hour-start="nHourStart"
                    :n-hours-elapsed="nHoursElapsed"
                ></task-list-header><!--

                --><task-list-item
                    v-for="oTask in aTask"
                    :key="oTask.nId"

                    :n-id="oTask.nId"
                    :s-name="oTask.sName"
                    :n-hour-start="nHourStart"
                    :n-hours-elapsed="nHoursElapsed"
                ></task-list-item> 
            </div>
        </main>
    `
};