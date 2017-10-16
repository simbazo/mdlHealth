//******************************************************************************
//The toc panel contains the search and list views
//******************************************************************************
App.Views.TocPanelView = Backbone.Marionette.LayoutView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    regions: {
        tocSearchPanel: {regionClass: App.Core.TocSearchRegion},
        tocListPanel: {regionClass: App.Core.TocListRegion}
    },
    
    onRender: function () {
        //always move to the top of the page
        window.scrollTo(0, 0);
    }
});



