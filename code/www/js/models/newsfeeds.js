App.Models.Newsfeeds = Backbone.Collection.extend({
    model: App.Models.Newsfeed,
    
    initialize: function () {
        this.on('change', this.render, this);
    }
});