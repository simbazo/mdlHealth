//******************************************************************************
//This is a sub view that wraps the models in the collection to a <ul>
//It does not have template because it is attached to an existing view
//******************************************************************************
App.Views.NodesSubView = Backbone.View.extend({
    tagName: "ul",
    className: "table-view",
    initialize: function (options) {
        this.options = options;
    },
    render: function () { 
        this.collection.each(function(node){
            var nodeView = new App.Views.NodeView({ model: node });
            //manually call the node's render() method
            this.$el.append(nodeView.render().el.childNodes);
            //$(this.options.targetEl, this.el).append(nodeView.render().el.childNodes);
        }, this);
        return this;
    },
    events: {
        'click li.table-view-cell a' : 'showDependents'
    },
    showDependents: function(e){
        //prevent default href behaviour and stop event bubbling up through node views
        e.preventDefault(); 
        e.stopPropagation();
        
        var id = $(e.currentTarget).closest("li").attr("id");
        var link = $(e.currentTarget).attr("href");

        loadJSONFile('data/toc.json', function(data) {
            filtered = filterJSONByParent(data, id)
            showChildNodes(filtered, id, link);
        });
    }
});