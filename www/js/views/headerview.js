App.Views.HeaderView = Backbone.Marionette.ItemView.extend({
    template: this.template,

    initialize: function (options) {
    },

    events: {
        'click #tocMenu': 'toggleMenuPanel',
        'click  #btnSettings': 'showSettings'
    },

    onRender: function () {
    },

    openWebview: function (e) {
        //prevent default href behaviour and stop event bubbling up through node views
        e.preventDefault();
        e.stopPropagation();

        App.Utils.Webview.OpenWebviewPanel();
    },

    toggleMenuPanel: function (e) {
        //prevent default href behaviour and stop event bubbling up through node views
        e.preventDefault();
        e.stopPropagation();

        if( $("#nav-panel").hasClass("ui-panel-open") === true ){
            $('#nav-panel').panel('close');
        }else{
            $('#nav-panel').panel('open');
        }
    },

    showSettings: function (e) {
        App.pressRouter.navigate("settings", { trigger: true });
    }
});