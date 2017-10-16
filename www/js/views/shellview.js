App.Views.ShellView = Backbone.Marionette.LayoutView.extend({
    template: this.template,
    
    initialize: function() {
    },
    
    regions: {
        headerPanel: { regionClass: App.Core.HeaderRegion },
        contentPanel: {regionClass: App.Core.ContentRegion},
        menuPanel: { regionClass: App.Core.MenuRegion },
        referencePanel: { regionClass: App.Core.ReferenceRegion },
		webviewPanel: { regionClass: App.Core.WebViewRegion },
		errorPanel: { regionClass: App.Core.ErrorRegion },
		footerPanel: { regionClass: App.Core.FooterRegion }
    },

    events: {
    },

    onRender: function () {
    }
});

