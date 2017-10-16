//******************************************************************************
//Each menu is simply a collection of sections represented as Content models.
//******************************************************************************

App.Models.Contents = Backbone.Collection.extend({
    model: App.Models.Content,
    initialize: function () {
        //when a collection changes, it will re-render itself
        this.on('change', this.render, this);
    }
});


