App.Views.FooterItemView = Backbone.Marionette.ItemView.extend({
    tagName: "li",
    template: this.template,    

    initialize: function (options) {
        //App.Utils.RecordPageImpression(this.model.attributes.ID);
    },

    onRender: function () {
        //this.$el.collapsibleset();
        //this.$el.enhanceWithin();
    }
});

