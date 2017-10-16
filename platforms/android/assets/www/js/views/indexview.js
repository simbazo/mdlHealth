//******************************************************************************
//This is the 'master' index view that wraps the models in the collection.
//******************************************************************************
App.Views.IndexView = Backbone.Marionette.CompositeView.extend({
    template: this.template,
    childView: App.Views.IndexNodeView,
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
        $('#menu-bookmarklist-panel').css('display', 'none');
        $('#menu-indexlist-panel').css('display', 'block');
    },
    
    events: {
        'click  div[id=-1]' : 'showAllContent',
        'click  div[id]' : 'showContent'
    },
    
    showAllContent: function(e) {
        var index = new App.Models.Index(App.IndexData);
        App.indexView = new App.Views.IndexView({ collection: index});
        App.menuPanelView.menuIndexListPanel.show(App.indexView, {forceShow: true});
        
        //do this if the default index node does not exist
        if ($('#index-autocomplete').find('#-1').length === 0) {       
            var html = "<li>";
                html += "<div class='menu-item-container' id='-1'>";
                html += "<div class='menu-item-text'>Show all index nodes</div>";
                html += "<p style='padding-left: 0.25em;'>This search may be slow if the index is large</p>";
                html += "<p class='ui-li-aside'></p>"
                html += "</div>";
                html += "</li>";
                
            $('#index-autocomplete').prepend($(html));
            $('#index-autocomplete').find('li.ui-first-child').removeClass('ui-first-child');
            $('#index-autocomplete').find('li:first-child').addClass('ui-first-child').removeClass('ui-screen-hidden');
        } else {
            $('#index-autocomplete').find('li.ui-first-child').removeClass('ui-first-child');
            $('#index-autocomplete').find('#-1').parent().addClass('ui-first-child');
            $('#index-autocomplete li').removeClass('ui-screen-hidden');
        }
        
        $('#index-autocomplete-input').val('').attr("placeholder", "Search the index...");
    },
    
    showContent: function(e){
        //prevent default href behaviour and stop event bubbling up through node views
        e.preventDefault(); 
        e.stopPropagation();
        
        var id = $(e.currentTarget).attr("id");
        
        if (id.indexOf('.json')) {
            id = id.substring(0, id.lastIndexOf('.json'));
        }
        
        this.toggleMenuLink($(e.currentTarget).parent());
        
        if (id > 0) {
           App.pressRouter.navigate("#content?" + id, {trigger: true});
        }
    },
    
    toggleMenuLink: function(element) {        
        //first remove all existing highlights
        $('#menu-indexlist-panel').find('.menu-item-container-hilite').each(function() {
            $(this).removeClass('menu-item-container-hilite');
        });
        
        //now highlight this element
        $(element).find('.menu-item-container').addClass('menu-item-container-hilite');        
    }
});