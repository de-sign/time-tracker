const
    fs = require('fs'),
    path = require('path'),
    ES = require('./plugins/electron-starter/_');
    
let oVue = null;

ES.initialize().then( () => {

    oVue = new Vue({
        el: '.ES-wrap',
        
        components: {
            'window-control': require('./components/WindowControl')
        },
        
        data: {},
        
        mounted() {
            this.$nextTick( () => document.body.classList.remove('ES-loading') );
        },
        methods: {}
    } );
} );