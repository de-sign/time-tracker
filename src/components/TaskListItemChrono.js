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
            bIsSupport: oData.bIsSupport || false
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
            return dDiff / 3600000;
        },

        oPosition() {
            const nDateStart = this.dDateStart.getHours() + this.dDateStart.getMinutes() / 60,
                nCoefTop = nDateStart - this.nHourStartRef;

            return {
                top: (150 * nCoefTop + 5) + 'px',
                height: (150 * this.nHoursElapsed - 9) + 'px',
                left: '5px',
                right: '5px',
                zIndex: ( 15 * nCoefTop + 800 )
            };
        },

        sTitle() {
            const sTitle = `<b>${this.sName}</b><br/>Début - ${this.sTimeStart}<br/> Fin - ${this.sTimeEnd}`;
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

        set(oValues) {
            this.sName = oValues.sName;
            this.sDescription = oValues.sDescription;
            this.sTimeStart = oValues.sTimeStart;
            this.bIsRunning = oValues.bIsRunning;
            this.bIsSupport = oValues.bIsSupport;
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
            this.$parent.$emit('task-list-item-chrono--remove', this.nId);
        }
    },
    
    template: `
        <article
            @dblclick="edit"
            :uk-tooltip="'pos: right; title: ' + sTitle"
            :style="oPosition"
            :class="{ '--isRunning': bIsRunning }"
            class="v-taskListItemChrono uk-position-absolute uk-tile uk-padding-small"
        >
            <header>
                <h3 class="uk-h5 uk-margin-remove">{{sName}}</h3>
            </header>
            <p v-if="bIsSupport" class="uk-text-meta">Support</p>
            <p class="uk-text-meta" v-html="hDescription"></p>
        </article>
    `
};