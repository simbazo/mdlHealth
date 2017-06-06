//******************************************************************************
//Each menu is simply a collection of menu items represented as Node models.
//******************************************************************************

App.Models.Nodes = Backbone.Collection.extend({
    model: App.Models.Node,
    initialize: function () {
        this.on('change', this.render, this);
    }
});