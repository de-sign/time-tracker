const
    fs = require('fs'),
    path = require('path'),

    config = require('./plugins/config'),
    ES = require('./plugins/electron-starter/core');

ES.initialize( {
    modules: {
        store: ['project', 'task', 'chrono'],
        excel: config.excel
    }
} ).then( () => {

    ES.oVue = new Vue({
        el: '.ES-wrap',
        
        components: {
            'menu-offcanvas': require('./components/MenuOffcanvas'),
            'menu-opener': require('./components/MenuOpener'),
            'summary-tab': require('./components/Summary'),
            'task-modal': require('./components/TaskModal'),
            'task-tab': require('./components/Task'),
            'window-control': require('./components/WindowControl')
        },
        
        data: {
            oMenu: {
                'task-tab': { sCode: 'task-tab', sLabel: 'Saisie', sIcon: 'calendar', },
                'summary-tab': { sCode: 'summary-tab', sLabel: 'Récapitulatif', sIcon: 'history' }
            },
            sSelectedMenu: 'task-tab',
            oProject: ES.store.project.select()
        },
        computed: {
            sWindowTitle() {
                return this.oMenu[ this.sSelectedMenu ].sLabel;
            }
        },
        
        mounted() {
            this.$on('menu--change', sMenu => this.changeMenu(sMenu));
            setTimeout( () => document.body.classList.remove('ES-loading'), 800 );
        },
        methods: {
            changeMenu(sMenu) {
                this.sSelectedMenu = sMenu;
            }
        }
    } );
} );