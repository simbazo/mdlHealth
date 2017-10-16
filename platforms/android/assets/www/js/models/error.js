//******************************************************************************
//Each bookmark is one of the Bookmarks collection
//******************************************************************************

App.Models.Error = Backbone.Model.extend({
    defaults: {
        Email: 'unspecified',
        Key: 'unspecified',
        Message: '',
        Detail: ''  
    },
    initialize: function () {
        //when the model changes, it will re-render itself
        this.on('change', this.render, this);
    }
});

