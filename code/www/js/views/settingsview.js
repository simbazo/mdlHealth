//******************************************************************************
//Each model view generates a header and content section on the page.
//******************************************************************************
App.Views.SettingsView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    onRender: function() {
        this.$el.enhanceWithin();
    }
});
