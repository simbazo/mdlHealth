//******************************************************************************
//Each bookmark is one of the Bookmarks collection
//******************************************************************************

App.Models.Bookmark = Backbone.Model.extend({
    defaults: {
        ID: '',
        Heading: '',
        Annotation: ''  
    },
    
    initialize: function () {
        //when the model changes, it will re-render itself
        this.on('change', this.render, this);
    }
});

