//******************************************************************************
//This is the 'master' view that wraps the segment models in the collection.
//******************************************************************************

App.Views.BookmarksView = Backbone.Marionette.CompositeView.extend({
    template: this.template,
    childView: App.Views.BookmarkView,
    childViewContainer: 'ul',
    
    onRender: function () {
        //Need to get rid of the wrapper <div> for JQM 
        this.$el = this.$el.children();
        
        //Unwrap the element to prevent infinitely nesting elements during re-render.
        this.$el.unwrap();        
        
        this.setElement(this.$el);
        
        //needed by jquery mobile:
        this.$el.listview();
        
        //show the bookmarks list
        $('#menu-contentlist-panel').css('display', 'none');
        $('#menu-indexlist-panel').css('display', 'none');
        $('#menu-bookmarklist-panel').css('display', 'block');
    },
    
    events: {
        'click li h2[id]': 'showContent'
    },
    
    showContent: function(e){
        //prevent default href behaviour and stop event bubbling up through node views
        e.preventDefault(); 
        e.stopPropagation();
        
        var id = $(e.currentTarget).attr("id");
        
        this.toggleMenuLink($(e.currentTarget).parent());
        
        if (id > 0) {
            App.pressRouter.navigate("#content?" + id, {trigger: true});
        } else {
            //else navigate to the menu screen
            //alert("there is no content for this index item");
        }
    },
    
    toggleMenuLink: function(element) {        
        //first remove all existing highlights
        $('#menu-bookmarklist-panel').each(function() {
            $(this).find('h2').removeClass('menu-item-container-hilite');
        });
        
        //now highlight this element
        $(element).find('h2').addClass('menu-item-container-hilite');        
    }
});

