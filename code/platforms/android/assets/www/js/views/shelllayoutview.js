App.Views.ShellLayoutView = Backbone.Marionette.LayoutView.extend({
    template: this.template,
    
    initialize: function() {
    },
    
    regions: {
        headerPanel: { regionClass: App.Core.HeaderRegion },
        contentPanel: { regionClass: App.Core.ContentRegion },
        contentLayoutPanel: { regionClass: App.Core.ContentLayoutRegion },
        menuPanel: { regionClass: App.Core.MenuRegion },        
		webviewPanel: { regionClass: App.Core.WebViewRegion },
		errorPanel: { regionClass: App.Core.ErrorRegion }
    },

    onRender: function () {
    }
});

