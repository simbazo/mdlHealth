App.Views.ReferenceView = Backbone.Marionette.CompositeView.extend({
    template: this.template,
    childView: App.Views.ReferenceItemView,
    childViewContainer: 'ul',

    initialize: function (options) {
    },

    events: {
        'click li': 'showReference'
        //'click li:not([data-role="list-divider"]': 'showReference'
    },

    onRender: function () {
        this.$el.listview();
        this.$el.enhanceWithin();
    },

    showReference: function (e) {
        var nodeID = $(e.currentTarget).find("span").data("id");
        var ext = '';
        var link = '';

        this.collection.each(function (node) {
            if (node.attributes.ID == nodeID) {
                ext = node.attributes.MediaExt;
                link = node.attributes.MediaDetail;
                return false;
            }
        });

        if (ext == "int") {
            App.pressRouter.navigate("#contentfile?" + link, { trigger: true });
        } else {
            if (window.cordova) {
                cordova.InAppBrowser.open(link, '_blank', 'location=no');
            } else {
                refWindow = window.open(link, "reference-window", "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
            }
        }

        $('#reference-panel').panel('close');
    }
});