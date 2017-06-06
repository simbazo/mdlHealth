//******************************************************************************
//Each model view generates a header and content section on the page.
//******************************************************************************
App.Views.BookmarkPanelView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    onRender: function() {
        this.$el.enhanceWithin();
        
        //only show if a topic is currently being displayed
        //if (!$('h2').attr('data-nodeid').length) {
            //$("#settings-panel").popup( "close" );
        //}
    },
    
    events: {
        'click #btnBookmarkCreate': 'saveBookmark'
    },
    
    saveBookmark: function(e) {
        /*var id = $('h2:first').data('nodeid');
        var heading = ($(e.currentTarget).closest('form').find('#txtBookmarkName').val().length) ? $(e.currentTarget).closest('form').find('#txtBookmarkName').val() : $(e.currentTarget).closest('form').find('#txtBookmarkName').attr('placeholder');
        var annotation = ($(e.currentTarget).closest('form').find('#txtBookmarkComment').val().length) ? $(e.currentTarget).closest('form').find('#txtBookmarkComment').val() : "";
        App.Utils.RecordBookmark(id, heading, annotation);
        $("#bookmark-panel").popup("close");*/
    }    
});

