//******************************************************************************
//Provides search functionality for the toc list
//******************************************************************************
App.Views.IndexSearchView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    onRender: function() {
        this.$el.collapsibleset();
        this.$el.enhanceWithin();
    }
});



