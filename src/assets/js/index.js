const
    fs = require('fs'),
    path = require('path'),
    ES = require('./plugins/electron-starter/_');
    
let oVue = null;

ES.initialize().then( () => {

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
            oDefTask: {
                1: 'Pause'
            }
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
                const nId = Math.max.apply( Math, Object.keys(this.oDefTask) ) + 1,
                    oDefTask = Object.assign({}, this.oDefTask);
    
                oDefTask[nId] = sName;
                this.oDefTask = oDefTask;
            },

            editChrono(oChrono) {
                console.log('Open Modal Chrono', oChrono);
            }
        }
    } );
} );