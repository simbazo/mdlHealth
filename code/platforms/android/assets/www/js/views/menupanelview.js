//******************************************************************************
//The toc panel contains the search and list views
//******************************************************************************
App.Views.MenuPanelView = Backbone.Marionette.LayoutView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    regions: {
        menuSearchPanel: {regionClass: App.Core.MenuSearchRegion},
        menuContentListPanel: {regionClass: App.Core.MenuContentListRegion},
        menuIndexListPanel: {regionClass: App.Core.MenuIndexListRegion},
        menuBookmarkListPanel: {regionClass: App.Core.MenuBookmarkListRegion}
    },
    
    onRender: function () {
        //always move to the top of the page
        window.scrollTo(0, 0);
    }
});



