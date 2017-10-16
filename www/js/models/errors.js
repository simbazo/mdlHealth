//******************************************************************************
//A collection of Bookmark models
//******************************************************************************

App.Models.Errors = Backbone.Collection.extend({
    model: App.Models.Error,
    initialize: function () {
        this.on('change', this.render, this);
    }
});

