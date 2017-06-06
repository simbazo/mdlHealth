//******************************************************************************
//
//******************************************************************************

App.Views.TriageOutcomeView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    events: {
        "click button": "showNext"
    },
    
    onRender: function() {
        this.$el.enhanceWithin();
        this.$el.find('.ui-heading-triage').css('color', this.model.attributes.Color);
        this.$el.find('.ui-table-columntoggle-btn').css('display', 'none');
        
        //always move to the top of the page
        window.scrollTo(0, 0);
    },
    
    showNext: function(e) {
        e.preventDefault();
        
        App.pressRouter.navigate("#triage1", {trigger: true});
    }
});