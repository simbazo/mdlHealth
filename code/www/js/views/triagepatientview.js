//******************************************************************************
//
//******************************************************************************

App.Views.TriagePatientView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    events: {
        "click button": "showNext"
    },
    
    onRender: function() {
        this.$el.enhanceWithin();
        
        //always move to the top of the page
        window.scrollTo(0, 0);
    },
    
    showNext: function(e) {
        e.preventDefault();
        
        App.pressRouter.navigate("#triageprint", {trigger: true});
    }
});