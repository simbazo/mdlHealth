App.Views.NewsfeedView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    events: {
    },
    
    onBeforeRender: function () {
    },
    
    onRender: function() {
        //always move to the top of the page
        window.scrollTo(0, 0);
    }
});

