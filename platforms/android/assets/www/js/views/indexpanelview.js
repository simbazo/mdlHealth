//******************************************************************************
//The toc panel contains the search and list views
//******************************************************************************
App.Views.IndexPanelView = Backbone.Marionette.LayoutView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    regions: {
        indexSearchPanel: {regionClass: App.Core.IndexSearchRegion},
        indexListPanel: {regionClass: App.Core.IndexListRegion}
    },
    
    onRender: function () {
        //always move to the top of the page
        window.scrollTo(0, 0);
    }
});



