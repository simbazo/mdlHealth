App.Models.Newsfeed = Backbone.Model.extend({
    defaults: {
        Date: 'unspecified',
        Header: 'unspecified',
        Content: 'unspecified'
    },
    initialize: function () {
        //when the model changes, it will re-render itself
        this.on('change', this.render, this);
    }
});

