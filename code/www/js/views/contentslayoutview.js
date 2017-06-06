App.Views.ContentsLayoutView = Backbone.Marionette.LayoutView.extend({
    template: this.template,

    regions: {
        menuSearchPanel: {regionClass: App.Core.MenuSearchRegion},
        menuContentListPanel: {regionClass: App.Core.MenuContentListRegion},
        menuIndexListPanel: {regionClass: App.Core.MenuIndexListRegion},
        menuBookmarkListPanel: {regionClass: App.Core.MenuBookmarkListRegion}
    },
    
    onRender: function () {
        //always move to the top of the page
        window.scrollTo(0, 0);
    },

    regions: {
        //jsonPanel: { regionClass: App.CoreJsonContentRegion },
        //pdfPanel: { regionClass: App.Core.PdfContentRegion }
        //mediaPanel: { regionClass: App.Core.MediaContentRegion }
    },

    events: {

    },
});