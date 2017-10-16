//******************************************************************************
//Each model view is wrapped in the collection's view
//******************************************************************************

App.Views.BookmarkFormView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    onRender: function() {
        this.$el.enhanceWithin();
    },
    
    events: {
        'click #btnBookmarkCreate': 'saveBookmark',
        'click #btnBookmarkCancel': 'cancelBookmark'
    },
    
    saveBookmark: function(e) {
        var id = $('h2:first').data('nodeid');
        var heading = ($(e.currentTarget).closest('form').find('#txtBookmarkName').val().length) ? $(e.currentTarget).closest('form').find('#txtBookmarkName').val() : $(e.currentTarget).closest('form').find('#txtBookmarkName').attr('placeholder');
        var annotation = ($(e.currentTarget).closest('form').find('#txtBookmarkComment').val().length) ? $(e.currentTarget).closest('form').find('#txtBookmarkComment').val() : "";
        App.Utils.RecordBookmark(id, heading, annotation);
        window.history.back();
    } ,   
    
    cancelBookmark: function(e) {
        window.history.back();
    } 
});