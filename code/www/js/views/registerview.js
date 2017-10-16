//******************************************************************************
//Each model view generates a header and content section on the page.
//******************************************************************************

App.Views.RegisterView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function (options) {
    },

    events: {
        'change #chkRegTerms': 'enableRegistration',
        'click #btnRegister': 'registerUser'
    },
    
    onRender: function () {
        this.$el.enhanceWithin();
    },

    enableRegistration: function (e) {
        if ($(e.currentTarget).prop("checked")) {
            this.$el.find("#btnRegister").removeAttr('disabled');
        } else {
            this.$el.find("#btnRegister").attr('disabled', 'disabled');
        }
    },

    registerUser: function (e) {
        //get the key name
        var apiKey = 'mdl.' + App.Config.packageKey + '.apiKey';

        //get the array
        var apiKeyArray = App.Utils.getStorageList('mdl.' + App.Config.packageKey + '.apiKeys');

        //replace any existing key or add if none exists
        App.Utils.addStorageList(apiKey, apiKeyArray, '3d87099f-d7bc-11e5-8938-000c29ccfea5', true);

        //navigate to home route route
        App.pressRouter.navigate("home", { trigger: true });
    }
});

