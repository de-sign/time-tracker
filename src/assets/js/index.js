const
    fs = require('fs'),
    path = require('path'),
    ES = require('./plugins/electron-starter/_');
    
let oVue = null;

ES.initialize( {
    modules: {
        store: {
            'task_def': null,
            'task': null,
            'chrono': null
        }
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
            oTaskDef: ES.store.task_def.get('oData')
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
            },

            setDate(nDayModify) {
                this.dDate.setDate( this.dDate.getDate() + nDayModify );
                this.dDate = new Date(this.dDate.getTime());
            },

            addDefTask(sName) {
                const nId = ES.store.task_def.get('nAutoIncrement'),
                    oTaskDef = Object.assign({}, this.oTaskDef);
    
                oTaskDef[nId] = {
                    nId: nId,
                    sName: sName.trim()
                };
                this.oTaskDef = oTaskDef;

                ES.store.task_def.set({
                    nAutoIncrement: nId + 1,
                    oData: oTaskDef
                });

                this.$nextTick( () => this.$emit('task-control-button--add-task', nId) );
            }
        }
    } );
} );