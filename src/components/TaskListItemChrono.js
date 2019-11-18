module.exports = {

    props: {
        nHourStartRef: Number,

        nId: Number,
        nIdTask: Number,
        sDate: String
    },
    data() {
        const dDateInit = new Date(this.sDate),
            oData = Object.assign(
            {
                sName: 'Chrono #' + this.nId,
                sDescription: '',
                sTimeStart: dDateInit.getHours().toString().padStart(2, '0') + ':' + dDateInit.getMinutes().toString().padStart(2, '0'),
                sTimeEnd: ( dDateInit.getHours() + 1 ).toString().padStart(2, '0') + ':' + dDateInit.getMinutes().toString().padStart(2, '0'),
                bIsRunning: false
            },
            ES.store.chrono.get(`oData.${this.nIdTask}.${this.nId}`)
        );
        return oData;
    },
    computed: {
        dDateStart() {
            const dDate = new Date(this.sDate),
                aTimeStart = this.sTimeStart.split(':');

            dDate.setHours(aTimeStart[0]);
            dDate.setMinutes(aTimeStart[1]);
            return dDate;
        },

        dDateEnd() {
            const dDate = new Date(this.sDate),
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
            const oData = ES.store.chrono.get('oData');
            Object.assign( oData[this.nIdTask][this.nId], this._data );
            ES.store.chrono.set('oData', oData );
        },

        edit() {
            this.$root.$emit('task-list-item-chrono--edit', this);
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
            <p class="uk-text-meta">{{sDescription}}</p>
        </article>
    `
};