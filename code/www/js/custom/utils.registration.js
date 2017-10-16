App.Utils.Registration.isRegistered = function () {
    var isRegistered = false;

    if (!window.cordova) {
        return true;
    } else {
        var apiKey = App.Utils.getStorageList("mdl." + App.Config.packageKey + ".apiKey");

        if (apiKey.length > 0) {
            isRegistered = true;
        }
    }

    return isRegistered;
};

App.Utils.Registration.requestRegistration = function () {
    var defer = $.Deferred();

    if (window.cordova) {
        navigator.notification.confirm(
            'The system has detected that this application has not been installed on this device previously.\n\nWould you like to register  now?\n\n Please note that you cannot open the application until you have successfully registered. \n\nNote: If you have registered previously for this application, please click NO and provide you details on the following screens.',  // message
            function (btnIndex) {       // callback to invoke with index of button pressed
                if (btnIndex === 2) {
                    defer.resolve(true);
                } else {
                    defer.resolve(false);
                }
            },
            'Request for Registration',
            ['No', 'Yes']
        );
    } else {
        defer.resolve(true);
    }

    return defer.promise();
};

App.Utils.Registration.requestPreviousRegistration = function () {
    var defer = $.Deferred();

    navigator.notification.confirm(
        'Have you registered with this application on this or some other device in the past?',
        function (btnIndex) {
            if (btnIndex === 2) {
                defer.resolve(true);
            } else {
                defer.resolve(false);
            }
        },
        'Check for Previous Registration',
        ['No', 'Yes']
    );

    return defer.promise();
};

App.Utils.Registration.confirmPreviousRegistration = function () {
    alert("App.Utils.Registration.confirmPreviousRegistration");
};