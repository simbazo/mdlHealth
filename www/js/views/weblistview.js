App.Views.WebListView = Backbone.Marionette.CompositeView.extend({
    template: this.template,
    childView: App.Views.WebContentView,
    //childViewContainer: 'ul',
    
    events: {
    },
    
    onRender: function () {
        
    }
});