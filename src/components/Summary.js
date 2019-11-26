module.exports = {

    components: {
        'summary-control': require('./SummaryControl'),
        'summary-list': require('./SummaryList')
    },

    props: {
        oProject: Object
    },

    template: `
        <section class="v-sumary uk-flex uk-flex-column">
            <summary-control></summary-control>
            <summary-list :o-project="oProject"></summary-list>
        </section>
    `
};