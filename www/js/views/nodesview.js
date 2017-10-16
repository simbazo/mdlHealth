//******************************************************************************
//This is the 'master' view that wraps the models in the collection.
//******************************************************************************
////** is recent changes to accomodate coenrats new deferred templates way of doing things
App.Views.NodesView = Backbone.Marionette.CompositeView.extend({
    template: this.template,
    childView: App.Views.NodeView,
    childViewContainer: 'ul',

    initialize: function (options) {
        this.menuColor = options.pColor;
    },
    
    events: {
        'click li': 'showDependents',
        'click li[levelid="1"]': 'showStandardSections'
    },
    
    onRender: function () {
        //Need to get rid of the wrapper <div> for JQM 
        this.$el = this.$el.children();
        
        //Unwrap the element to prevent infinitely nesting elements during re-render.
        this.$el.unwrap();        
        
        this.setElement(this.$el);

        this.$el.find("li").each(function (index) {
            //alert("found an <li>");
        });
        
        //needed by jquery mobile:
        this.$el.listview();
        
        //format this node's containing ul
        this.$el.addClass('menu-area-' + this.collection.models[0].attributes.Level_ID);
        
        //show the bookmarks list
        $('#menu-indexlist-panel').css('display', 'none');
        $('#menu-bookmarklist-panel').css('display', 'none');
        $('#menu-contentlist-panel').css('display', 'block');

        //reformat the color of the level 1 heading when a color has been passed into the view
        if (this.menuColor) {
            this.$el.find('.menu-block-1').css('background-color', this.menuColor);
            this.$el.find('.menu-block-2').css({'background-color': this.menuColor, opacity: 0.7});
            this.$el.find('.menu-block-3').css({'background-color': this.menuColor, opacity: 0.4});
        }
    },
    
    showDependents: function(e) {
        //prevent default href behaviour and stop event bubbling up through node views
        e.preventDefault(); 
        e.stopPropagation();

        if ($(e.currentTarget).find(".menu-item-text").text().toLowerCase().trim() == "download") {
            this.downloadMediaFiles();
        } else {
            var id = $(e.currentTarget).attr("id");
            var link = $(e.currentTarget).attr("href");

            filtered = App.Utils.filterJSONByParent(App.NodeData, id);
            App.Utils.Menu.showChildNodes(filtered, id, link);

            this.toggleMenuLink($(e.currentTarget));
        }
    },
    
    showStandardSections: function(e) {
        //prevent default href behaviour and stop event bubbling up through node views
        e.preventDefault(); 
        e.stopPropagation();
        
        switch ($(e.currentTarget).find('.menu-item-text').text().toLowerCase()) {
            case "glossary":
                break;
            case "index":
                App.pressRouter.navigate("#index", {trigger: true});
                break;
            case "bookmarks":
                App.pressRouter.navigate("#bookmarks", {trigger: true});
                break;
            case "newsfeeds":
                App.pressRouter.navigate("#newsfeeds", {trigger: true});
                break;
            case "notes":
                break;
            case "settings":
                break;
        }
    },
    
    toggleMenuLink: function(element) {  
        //first remove all existing highlights
        $('#menu-contentlist-panel').find('.menu-item-container-hilite').each(function() {
            $(this).removeClass('menu-item-container-hilite');
        });
        
        //now highlight this element
        $(element).addClass('menu-item-container-hilite');
    },

    downloadMediaFiles: function () {
        navigator.notification.confirm(
            'Would you like to download all available media files to your device?',  // message
                function (btnIndex) {  // callback to invoke with index of button pressed
                    if (btnIndex === 2) {
                        App.Utils.CopyCloudMediaToAppData().done(
                            function () {
                                alert('Files copied successfully.');
                            }
                    );
                    }
                },             
            'Download content',     // title
            ['No', 'Yes']           // buttonLabels
        );
    }
});