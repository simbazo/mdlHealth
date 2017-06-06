//******************************************************************************
//Each bookmark is one of the Bookmarks collection
//******************************************************************************

App.Models.Settings = Backbone.Model.extend({
    defaults: {
        Name: 'unspecified',
        Email: 'unspecified',
        Key: 'unspecified',
        PushContent: true,
        SendErrors: true
    },
    initialize: function () {
        //when the model changes, it will re-render itself in the view
        this.on('change', this.render, this);
    }
});

