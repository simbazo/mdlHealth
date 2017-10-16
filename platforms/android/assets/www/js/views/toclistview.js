//******************************************************************************
//This is the 'master' view that wraps the models in the collection.
//******************************************************************************
App.Views.TocListView = Backbone.Marionette.CompositeView.extend({
    template: this.template,
    childView: App.Views.TocView,
    childViewContainer: 'ul',
    
    events: {
        'click li > a': 'showDependents'
    },
    
    onRender: function () {
        //Need to get rid of the wrapper <div> for JQM 
        this.$el = this.$el.children();
        
        //Unwrap the element to prevent infinitely nesting elements during re-render.
        this.$el.unwrap();        
        
        this.setElement(this.$el);
        
        //needed by jquery mobile:
        this.$el.listview();
    },
    
    showDependents: function(e) {
        //prevent default href behaviour and stop event bubbling up through node views
        e.preventDefault(); 
        e.stopPropagation();
        
        var id = $(e.currentTarget).attr("id");
        var link = $(e.currentTarget).attr("href");

        App.Utils.loadJSONFile('data/toc.json', function(data) {
            filtered = App.Utils.filterJSONByParent(data, id)
            App.Utils.showChildNodes(filtered, id, link);
        });
    }
});