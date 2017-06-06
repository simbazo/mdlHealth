//******************************************************************************
//Each menu is simply a collection of menu items represented as Node models.
//******************************************************************************

App.Models.Index = Backbone.Collection.extend({
    model: App.Models.IndexNode,
    initialize: function () {
        //when a collection changes, it will re-render itself
        this.on('change', this.render, this);
    }
});