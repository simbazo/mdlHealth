//******************************************************************************
//Each model view is wrapped in the collection's view
//******************************************************************************

App.Views.BookmarkView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    onRender: function() {
        //Need to get rid of the wrapper <div> for JQM 
        this.$el = this.$el.children();
        
        //Unwrap the element to prevent infinitely nesting elements during re-render.
        this.$el.unwrap();        
        
        this.setElement(this.$el);
        
        //needed by jquery mobile:
        this.$el.listview();
        this.$el.enhanceWithin();
        
        //only show if a topic is currently being displayed
        //if (!$('h2').data('nodeid').length) {
            //$("#settings-panel").popup( "close" );
        //}
    },
    
    events: {
        'click #btnBookmarkCreate': 'saveBookmark'
    },
    
    saveBookmark: function(e) {
        //alert('saveBookmark()');
        var id = $('h2:first').data('nodeid');
        var heading = ($(e.currentTarget).closest('form').find('#txtBookmarkName').val().length) ? $(e.currentTarget).closest('form').find('#txtBookmarkName').val() : $(e.currentTarget).closest('form').find('#txtBookmarkName').attr('placeholder');
        var annotation = ($(e.currentTarget).closest('form').find('#txtBookmarkComment').val().length) ? $(e.currentTarget).closest('form').find('#txtBookmarkComment').val() : "";
        App.Utils.RecordBookmark(id, heading, annotation);
        window.history.back();
    }    
});