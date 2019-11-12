module.exports = {

    props: {
        nHourStartRef: Number,

        nId: Number,
        dDateInit: Number
    },
    data() {
        return {
            sName: 'Chrono #' + this.nId,
            sDescription: '',
            sTimeStart: this.dDateInit.getHours().toString().padStart(2, '0') + ':' + this.dDateInit.getMinutes().toString().padStart(2, '0'),
            sTimeEnd: ( this.dDateInit.getHours() + 1 ).toString().padStart(2, '0') + ':' + this.dDateInit.getMinutes().toString().padStart(2, '0'),
            isRunning: false
        };
    },
    computed: {
        dDateStart() {
            const dDate = new Date( this.dDateInit.getTime() ),
                aTimeStart = this.sTimeStart.split(':');

            dDate.setHours(aTimeStart[0]);
            dDate.setMinutes(aTimeStart[1]);
            return dDate;
        },

        dDateEnd() {
            const dDate = new Date( this.dDateInit.getTime() ),
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
            return {
                top: (150 * (this.dDateStart.getHours() - this.nHourStartRef) + 5) + 'px',
                height: (150 * this.nHoursElapsed - 9) + 'px',
                left: '5px',
                right: '5px'
            };
        }
    },

    methods: {
        edit() {
            this.$root.$emit('task-list-item-chrono--edit', this);
        },

        set(oValues) {
            this.sName = oValues.sName;
            this.sDescription = oValues.sDescription;
            this.sTimeStart = oValues.sTimeStart;
            this.sTimeEnd = oValues.sTimeEnd;
        }
    },
    
    template: `
        <article
            :style="oPosition"
            @dblclick="edit"
            :class="{ '--isRunning': isRunning }"
            class="v-taskListItemChrono uk-position-absolute uk-tile uk-padding-small"
        >
            <header>
                <h3 class="uk-h5 uk-margin-remove">{{sName}}</h3>
            </header>
            <p class="uk-text-meta">{{sDescription}}</p>
        </article>
    `
};