App.Views.HeaderView = Backbone.Marionette.ItemView.extend({
    template: this.template,

    initialize: function (options) {
    },

    events: {
        'click  #btnWebview': 'openWebview'
    },

    onRender: function () {
    },

    openWebview: function (e) {
        //prevent default href behaviour and stop event bubbling up through node views
        e.preventDefault();
        e.stopPropagation();

        App.Utils.Webview.OpenWebviewPanel();
    }
});