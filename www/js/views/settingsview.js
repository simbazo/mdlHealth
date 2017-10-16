//******************************************************************************
//Each model view generates a header and content section on the page.
//******************************************************************************
App.Views.SettingsView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
    },

    events: {
        'change #flip-checkbox-3': 'toggleDeviceActive',
        'click #btnRegister' : 'saveSettings'
    },
    
    onRender: function() {
        this.$el.enhanceWithin();
    },

    toggleDeviceActive: function (e) {
    },

    saveSettings: function (e) {
        if ($(e.currentTarget).parent().find("#flip-checkbox-3").prop("checked")) {
            //get the key name
            var apiKey = 'mdl.' + App.Config.packageKey + '.apiKey';

            //get the array
            var apiKeyArray = App.Utils.getStorageList('mdl.' + App.Config.packageKey + '.apiKeys');

            App.Utils.removeStorageList('mdl.' + App.Config.packageKey + '.apiKey', apiKeyArray, 0);
        }
    }
});
