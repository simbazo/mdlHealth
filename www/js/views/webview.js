App.Views.WebView = Backbone.Marionette.LayoutView.extend({
    template: this.template,

    initialize: function () {
    },

    regions: {
        weblistPanel: { regionClass: App.Core.WebListRegion },
        webcontentPanel: { regionClass: App.Core.WebContentRegion }
    },

    events: {

    },
});