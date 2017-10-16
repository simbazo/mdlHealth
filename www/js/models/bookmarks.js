//******************************************************************************
//A collection of Bookmark models
//******************************************************************************

App.Models.Bookmarks = Backbone.Collection.extend({
    model: App.Models.Bookmark,
    initialize: function () {
        //when a collection changes, it will re-render itself
        this.on('change', this.render, this);
    }
});

