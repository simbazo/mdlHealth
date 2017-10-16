//******************************************************************************
//Each model view generates a header and content section on the page.
//******************************************************************************

App.Views.ContentView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function (options) {
        //App.Utils.RecordPageImpression(this.model.attributes.ID);
        this.parentModel = options.model;
    },
    
    events: {
        "click img": "showPopupImage",
        "click a[href]": "openLinkInBrowser"
    },
    
    onRender: function () {
        //record page usage
        App.Utils.RecordPageImpression(this.model.attributes.ID);

        if (this.parentModel.attributes.MediaExt && this.parentModel.attributes.MediaExt !== "json") {
            App.pressRouter.navigate("#contentfile?" + JSON.stringify(this.parentModel), { trigger: true });
            this.showHomePage();
        } else {
            this.$el.collapsibleset();
            this.$el.enhanceWithin();

            //show the newsfeed if necessary
            this.showNewsfeed();
        }
    },    

    showHomePage: function() {
        //show the home content node now
        var data = App.Utils.filterJSONByName(App.NodeData, 'home');
        var node = new App.Models.Node(data[0]);

        App.Core.DataService.getJSONFromFile(data[0].ID).done(
            function (data) {
                var node = data;
                node = new App.Models.Node(node[0]);

                var contents = new App.Models.Contents(data);
                App.contentsView = new App.Views.ContentsView({ model: node, collection: contents });

                //update the content panel
                App.shellView.contentPanel.show(App.contentsView, { changeHash: false });

                //open the nav panel
                if ($(".ui-panel").hasClass("ui-panel-closed") === true) {
                    $('#nav-panel').panel('open');
                }
            }
        ).fail(
            function (error) {
                throw new Error('App.Core.DataService.getJSONFromFile failed to fetch the home node data.');
            }
        );
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

    
    
    showPopupImage: function (e) {
        alert("showPopupImage()");
        //change the source of the popup image to the clicked image
        $('#globalImage').attr({ 'src': $(e.currentTarget).attr('src') });

        //center the popup relative to the device's viwport
        $('#globalImagePopup').popup("option", { "data-position-to": "window", "minScale": 1 });

        //open the popup
        $('#globalImagePopup').popup("open");
    },
    
    buildTableContainer: function() {
        var struct = $("<div>").addClass("parent").append(
                        $("<div>").addClass("panzoom"));       
        
        this.$el.find('table').each(function(i) {
            //wrap with the required divs
            $(this).attr('data-elem', 'pinchzoomer');
            $(this).wrap(struct);
        });
    },
    
    openLinkInBrowser: function(e) {       
        e.preventDefault();
        
        var href = $(e.currentTarget).attr('href');
        
        if (href.charAt(0) !== "#") {
            try {
                if (window.cordova) {
                    cordova.InAppBrowser.open(href, '_system', 'location=yes');
                } else {
                    refWindow = window.open(href, "reference-window", "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
                }
            } catch (e) {
                window.open(href);
            }
        } else {
            App.pressRouter.navigate(href, { trigger: true });
        }
    }
});