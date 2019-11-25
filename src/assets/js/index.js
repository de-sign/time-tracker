const
    fs = require('fs'),
    path = require('path'),
    ES = require('./plugins/electron-starter/_');
    
let oVue = null;

ES.initialize( {
    modules: {
        store: ['project', 'task', 'chrono']
    }
} ).then( () => {

    oVue = new Vue({
        el: '.ES-wrap',
        
        components: {
            'task-control': require('./components/TaskControl'),
            'task-list': require('./components/TaskList'),
            'task-modal': require('./components/TaskModal'),
            'window-control': require('./components/WindowControl')
        },
        
        data: {
            dDate: new Date(),
            oProject: ES.store.project.select()
        },
        
        mounted() {
            this.addEventListener();
            setTimeout( () => document.body.classList.remove('ES-loading'), 800 );
        },
        methods: {
            addEventListener() {
                this.$on('task-control-date-picker--prev', () => this.setDate(-1) );
                this.$on('task-control-date-picker--next', () => this.setDate(1) );
                this.$on('task-control-button--add-def-task', sName => this.addDefTask(sName) );
                this.$on('task-control-button--remove-def-task', nId => this.removeDefTask(nId) );
            },

            setDate(nDayModify) {
                this.dDate.setDate( this.dDate.getDate() + nDayModify );
                this.dDate = new Date(this.dDate.getTime());
            },

            addDefTask(sName) {
                const oAdd = ES.store.project.insert( {
                    sName: sName.trim()
                } );
                    
                this.oProject = Object.assign( {},
                    this.oProject, {
                        [oAdd._id]: oAdd
                    }
                );

                this.$nextTick( () => this.$emit('task-control-button--add-task', oAdd._id) );
            },

            removeDefTask(nId) {
                const oProject = Object.assign({}, this.oProject);

                UIkit.modal
                    .confirm(
                        `
                            <h2 class="uk-modal-title">Supprimer un projet</h2>
                            <p class="uk-text-danger">
                                Êtes vous sûr de vouloir supprimer définitivement <u>${this.oProject[nId].sName}</u> ainsi que toutes les tâches et tous les chronomètres qui lui sont assignés ?
                            </p>
                        `,
                        {
                            labels: {
                                ok: 'Supprimer',
                                cancel: 'Annuler'
                            }
                        }
                    )
                    .then(
                        () => {
                            ES.store.task
                                .index('nIdProject', nId)
                                .forEach( nIdTask => this.$emit('task-list-item--remove', nIdTask) );
                        }
                    );
            }
        }
    } );
} );