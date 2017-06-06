//Creat a global namespace to manage the MV* architecture
var App = {
    Config: {},
    Core: {},
    Client: {},
    Utils: {},
    Errors: {},
    Models: {},
    Views: {},
    Templates: {},
    Routers: {}
};

//Extend the core Marionette application to:
//  * attach a core router to marshall all navigation
//  * allow for global settings to be passed into the application
App.Core.Application = Marionette.Application.extend({
    initialize: function(options) {
        
    },
    onBeforeStart: function(options) {
    },

    onStart: function(options) {
        /*if (!App.imagePopup) {
            App.imagePopup = App.Utils.CreateImagePopup();
        } else {
            $(App.imagePopup).empty();
        };*/
        
        //App.pressRouter = new App.Core.Router();

        //App.Utils.StartupTasks();
    }
});


