App.Views.ContentFileView = Backbone.Marionette.ItemView.extend({
    template: this.template,

    initialize: function (options) {
    },

    onRender: function () {
        //this.$el.collapsibleset();
        //this.$el.enhanceWithin();

        var url = App.Config.appDataPath + 'files/' + this.model.attributes.ID + '.' + this.model.attributes.MediaExt;
        var mimeType = App.Utils.getMimeType(url);
        
        try {
            cordova.plugins.SitewaertsDocumentViewer.canViewDocument(
                url,
                mimeType,
                {},
                function () {
                    //onPossible
                    alert('document can be shown');
                },
                function(appId, installer)
                {
                    //onMissingApp
                    if(confirm("Do you want to install the free PDF Viewer App "
                            + appId + " for Android?"))
                    {
                        installer();
                    }
                },
                function () {
                    //onImpossible
                    alert('document cannot be shown');
                },
                function (error) {
                    alert(error);
                    alert("Sorry! Cannot show document.");
                }
            );
        } catch(e) {
            alert('Cannot create an instance of SitewaertsDocumentViewer');
        }
    }
});