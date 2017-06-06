App.Errors.PushError = function (err) {
    var defer = $.Deferred();

    //data object to be passed to the server
    var url = "http://api.appenberg.co.za/errors/error.php";
    var method = "POST";
    var data = {
        apiKey: App.Client.apiKey || null,
        personKey: null,
        mode: 'recorderror',
        params: {
            error: JSON.stringify(err)
        }
    };

    App.Core.DataService.sendJSONToUrl(url, method, data).done(
        function () {
            defer.resolve();
        }
    ).fail(
        function () {
            defer.reject();
        }
    );

    return defer.promise();
};

App.Errors.RecordError = function (err) {
    var errors = getStorageList('appenberg.contenterrors');
    var error = {
        Date: new Date(),
        APIKey: App.Client.apiKey || null,
        Error: JSON.stringify(err)
    };

    //add this error to the errors collection
    addStorageList('appenberg.contenterrors', errors, error, false);
};

App.Errors.ShowError = function (err) {
    if (App.pressRouter) {
        App.pressRouter.navigate("#error?" + err, { trigger: true });
    } else {
        var msg = err.message || JSON.stringify(err);
        if (window.confirm(msg)) {
            location.reload();
        } else {
            navigator.app.exitApp();
        }
    }
};

App.Errors.CreateErrorPopup = function (context) {
    var errPopup = document.createElement('div');
    errPopup.setAttribute('id', 'globalErrorPopup');
    errPopup.setAttribute('style', 'width: 90%; height: 90%;');
    document.getElementById('panel-responsive-page1').appendChild(errPopup);

    var imgSection = document.createElement('div');
    imgSection.setAttribute('class', 'error-image');
    //imgSection.innerHTML = "";
    errPopup.appendChild(imgSection);

    var msgSection = document.createElement('div');
    imgSection.setAttribute('class', 'error-msg');
    //imgSection.innerHTML = "";
    errPopup.appendChild(msgSection);

    var img = document.createElement('img');
    img.setAttribute('href', 'images/error-icon-7.png');
    img.setAttribute('style', 'width: 100%;');
    imgSection.appendChild(img);

    var $popup = $(errPopup).popup({
        dismissible: false,
        theme: "a",
        overlayTheme: "b",
        transition: "pop",
        positionTo: "window",
        afteropen: function () {
            $(this).panzoom().before("<a href=\"\" data-rel=\"back\" class=\"ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right\" style=\"z-index:10000;\">Close</a>");
        },
        beforeposition: function () {
            $(this).css({
                height: window.innerHeight - (window.innerHeight / 10)
            });
        },
        popupafterclose: function (event, ui) {
            $(this).remove();
        }
    });

    return $popup;
};

App.Errors.PushScheduledErrors = function () {
    var key = "appenberg.contenterrors";

    var errors = getStorageList(key);
    for (var i = 0; i < errors.length; i++) {
        App.Errors.PushError(errors[i].Error).done(
            function() {
                removeStorageList(key, errors, i)
            }            
        );
    }
}