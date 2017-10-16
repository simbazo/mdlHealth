//******************************************************************************
//
//******************************************************************************

App.Models.Triage = Backbone.Model.extend({
    defaults: {
        Outcome: '',
        Color: '',
        Time: '',
        Score: '',
        Syndrome: '',
        Mobility: '',
        RR: '',
        HR: '',
        SBP: '',
        Temp: '',
        AVPU: '',
        Trauma : ''
    },
    
    initialize: function () {
        //when the model changes, it will re-render itself
        this.on('change', this.render, this);
    }
});