//Creat a global namespace to manage the MV* architecture
var App = {
    Config: {},
    Core: {},
    Client: {},
    Utils: {
        Registration: {},
        Menu: {},
        Media: {}
    },
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

    onStart: function (options) {
        //App.pressRouter = new App.Core.Router();
        //App.Utils.StartupTasks();
    }
});


