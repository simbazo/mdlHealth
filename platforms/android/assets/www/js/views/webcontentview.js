App.Views.WebContentView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    onRender: function () {
        //always move to the top of the page
        window.scrollTo(0, 0);
    }
});