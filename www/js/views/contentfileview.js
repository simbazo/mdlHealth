App.Views.ContentFileView = Backbone.Marionette.ItemView.extend({
    template: this.template,

    initialize: function (options) {
    },

    events: {
        "dblclick img": "showPopupImage"
    },

    onRender: function () {
        //record page usage
        App.Utils.RecordPageImpression(this.model.attributes.ID);
    },

    onShow: function () {
        $(this.el).find("img").panzoom({ contain: true, minScale: 1 });
    },

    showMediaFile: function (e) {
        if (cordova.plugins.SitewaertsDocumentViewer) {
            App.Utils.Media.ShowPDF(JSON.stringify(this.model));
        }        
    },

    showPopupImage: function (e) {
        //change the source of the popup image to the clicked image
        $('#globalImage').attr({ 'src': $(e.currentTarget).attr('src') });

        //center the popup relative to the device's viwport
        $('#globalImagePopup').popup("option", { "data-position-to": "window", "minScale": 1 });

        //open the popup
        $('#globalImagePopup').popup("open");
    }
});