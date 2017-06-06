//******************************************************************************
//Each model view generates a header and content section on the page.
//******************************************************************************

App.Views.ContentView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
        //App.Utils.RecordPageImpression(this.model.attributes.ID);
        this.parentModel = options.model;

        if (this.parentModel.attributes.MediaExt && this.parentModel.attributes.MediaExt != "json") {
            App.pressRouter.navigate("#contentfile?" + JSON.stringify(this.parentModel), { trigger: true });
        }
    },
    
    events: {
        "click img": "showPopupImage",
        "click a[href]": "openLinkInBrowser"	
    },
	
	onDomRefresh: function() {
        this.$el.find('table.js-scrollabletable').each(function () {
            var table = this;
            if ($(table).find('tr').length > 9) {
                $(table).tableHeadFixer({
                    'head': true,
                    'foot': false,
                    'left': 0
                });
            };
        });
    },
    
    onRender: function() { 
        this.$el.collapsibleset();
        this.$el.enhanceWithin();
        
        //show the newsfeed if necessary
        this.showNewsfeed();
    },    
    
    showNewsfeed: function() {
        var parent = this;
        //check if page has capacity to show a newsfeed
        if (this.$el.find('#newsfeed').length) {
            //get newsfeed settings
            App.Core.DataService.getJSONFromLocalFilePath('settings').done(function(data) {                    
                var newsfeed = data.notifications.newsfeed;
                
                if (newsfeed.hasNewsfeed && newsfeed.showNewsfeed) {
                    App.Utils.RenderNewsfeed(parent.$el, newsfeed.numberNewsfeeds, newsfeed.showAs);
                }
            });
        }
    },
    
    showPopupImage: function(e) {
        //change the source of the popup image to the clicked image
        $('#globalImage').attr({'src': $(e.currentTarget).attr('src')});
        
        //center the popup relative to the device's viwport
        $('#globalImagePopup').popup( "option", "data-position-to", "window" );
        
        //open the popup
        $('#globalImagePopup').popup("open");
    },
    
    buildTableContainer: function() {
        /*var struct = $("<div>").addClass("parent").append(
                        $("<div>").addClass("panzoom"));       
        
        this.$el.find('table').each(function(i) {
            //console.log($(this).html());
            //wrap with the required divs
            $(this).attr('data-elem', 'pinchzoomer');
            $(this).wrap(struct);
        });*/
    },
    
    openLinkInBrowser: function(e) {       
        e.preventDefault();
        
        var href = $(e.currentTarget).attr('href');
        
        if (href.charAt(0) !== "#") {
            try {
                cordova.InAppBrowser.open(href, '_system', 'location=yes');
            } catch(e) {
                window.open(href);
            }
        } else {
            App.pressRouter.navigate(href, {trigger: true});
        };
    }
});