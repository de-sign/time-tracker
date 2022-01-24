module.exports = {

    props: {
        nHourStartRef: Number,

        nId: Number,
        sDatetime: String
    },
    data() {
        const dDateInit = new Date(this.sDatetime),
            oData = ES.store.chrono.select(this.nId);

        return {
            sName: oData.sName || 'Chrono #' + this.nId,
            sDescription: oData.sDescription || '',
            sTimeStart: oData.sTimeStart || dDateInit.getHours().toString().padStart(2, '0') + ':' + dDateInit.getMinutes().toString().padStart(2, '0'),
            sTimeEnd: oData.sTimeEnd || ( dDateInit.getHours() + 1 ).toString().padStart(2, '0') + ':' + dDateInit.getMinutes().toString().padStart(2, '0'),
            bIsRunning: oData.bIsRunning || false,

            bRemove: false
        };
    },
    computed: {
        hDescription() {
            return this.sDescription.replace(/\r\n|\n\r|\r|\n/g, '<br/>');
        },
        dDateStart() {
            const dDate = new Date(this.sDatetime),
                aTimeStart = this.sTimeStart.split(':');

            dDate.setHours(aTimeStart[0]);
            dDate.setMinutes(aTimeStart[1]);
            return dDate;
        },

        dDateEnd() {
            const dDate = new Date(this.sDatetime),
                aTimeEnd = this.sTimeEnd.split(':');

            dDate.setHours(aTimeEnd[0]);
            dDate.setMinutes(aTimeEnd[1]);
            return dDate;
        },

        nHoursElapsed() {
            const dDiff = this.dDateEnd - this.dDateStart;
            return Math.round( (dDiff / 3600000) * 100 ) / 100;
        },

        oPosition() {
            const nDateStart = this.dDateStart.getHours() + this.dDateStart.getMinutes() / 60,
                nCoefTop = nDateStart - this.nHourStartRef;

            return {
                top: (150 * nCoefTop + 5) + 'px',
                height: Math.max(56, 150 * this.nHoursElapsed - 9) + 'px',
                left: '5px',
                right: '5px',
                zIndex: ( 15 * nCoefTop + 800 )
            };
        },

        sTitle() {
            const sTitle = `<b>${this.sName}</b><br/>Début - ${this.sTimeStart}<br/> Fin - ${this.bIsRunning ? 'En cours' : this.sTimeEnd}`;
            return sTitle.replace(/:/g, 'h');
        }
    },

    mounted() {
        this.store();
        this.$on('task-list-item--update', () => this.update());
    },
    methods: {

        store() {
            const oData = ES.store.chrono.select(this.nId);
            ES.store.chrono.update(oData._id, Object.assign( oData, this._data, { nHoursElapsed: this.nHoursElapsed } ) );
        },

        edit() {
            this.$root.$emit('task-list-item-chrono--edit', this);
        },

        changeRunning(){
            this.bIsRunning = !this.bIsRunning;
            this.update();
        },

        set(oValues) {
            this.sName = oValues.sName;
            this.sDescription = oValues.sDescription;
            this.sTimeStart = oValues.sTimeStart;
            this.bIsRunning = oValues.bIsRunning;
            this.setTimeEnd(oValues.sTimeEnd);
            this.store();
        },

        setTimeEnd(sTimeEnd) {
            if( this.bIsRunning ){
                const dNow = new Date();
                this.sTimeEnd = dNow.getHours().toString().padStart(2, '0') + ':' + dNow.getMinutes().toString().padStart(2, '0');
            } else {
                this.sTimeEnd = sTimeEnd;
            }
        },

        update() {
            this.setTimeEnd(this.sTimeEnd);
            this.store();
        },

        remove() {
            if( this.bRemove ){
                this.$parent.$emit('task-list-item-chrono--remove', this.nId);
            } else {
                this.bRemove = true;
                setTimeout( () => {
                    this.bRemove = false;
                }, 2000 );
            }
        }
    },
    
    template: `
        <article
            @dblclick="edit"
            :uk-tooltip="'pos: right; title: ' + sTitle"
            :style="oPosition"
            :class="{ '--isRunning': bIsRunning }"
            class="v-taskListItemChrono uk-position-absolute uk-tile uk-padding-small uk-transition-toggle"
        >
            <header>
                <h3 class="uk-h5 uk-margin-remove">{{sName}}</h3>
                <span class="uk-transition-fade uk-position-top-right uk-padding-small">
                    <a @click="changeRunning()" href="#" class="v-taskListItem__add uk-text-primary">
                        <span v-show="!bIsRunning" uk-icon="play-circle"></span><!--
                        --><span v-show="bIsRunning" uk-icon="clock"></span>
                    </a>
                    <a
                        @click="remove()"
                        :title="bRemove ? 'Sure ?!' : ''"
                        href="#"
                        class="v-taskListItem__remove uk-text-danger"
                    >
                        <span :uk-icon="bRemove ? 'ban' : 'close'""></span>
                    </a>
                </span>
            </header>
            <p class="uk-text-meta" v-html="hDescription"></p>
        </article>
    `
};