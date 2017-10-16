//******************************************************************************
//This is the 'master' index view that wraps the models in the collection.
//******************************************************************************
////** is recent changes to accomodate coenrats new deferred templates way of doing things
App.Views.SearchView = Backbone.Marionette.CompositeView.extend({
    template: this.template,
    childView: App.Views.SearchNodeView,
    childViewContainer: 'ul',
    
    onRender: function () {
        //Need to get rid of the wrapper <div> for JQM 
        this.$el = this.$el.children();
        
        //Unwrap the element to prevent infinitely nesting elements during re-render.
        this.$el.unwrap();        
        
        this.setElement(this.$el);
        
        //needed by jquery mobile:
        this.$el.listview();
    },
    
    events: {
        'click li a' : 'showContent'
    },
    
    showContent: function(e){
        //prevent default href behaviour and stop event bubbling up through node views
        e.preventDefault(); 
        e.stopPropagation();
        
        var id = $(e.currentTarget).attr("ID");
        
        if (id > 0) {
            App.pressRouter.navigate("#content?" + id, {trigger: true});
        } else {
            //else navigate to the menu screen
            //alert("there is no content for this search result");
        }
    }
});