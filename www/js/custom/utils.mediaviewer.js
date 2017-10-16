App.Utils.Media.ShowPDF = function (model) {
    App.Utils.Media.getLocalUrl(model).done(            
        function (path) {                
            var mimeType = App.Utils.getMimeType(path);

            try {
                cordova.plugins.SitewaertsDocumentViewer.canViewDocument(
                    path,
                    mimeType,
                    {},
                    function () {
                        //onPossible
                        App.Utils.Media.showDocument(path, mimeType, {});
                    },
                    function (appId, installer) {
                        if (confirm("Do you want to install the free PDF Viewer App " + appId + " for your device?")) {
                            installer();
                            App.Utils.Media.showDocument(path, mimeType, {});
                        } else {
                            alert("Your document cannot be displayed until the PDF Viewer App has been installed on your device.");
                        }
                        //parent.installHelperPlugin();
                    },
                    function () {
                        alert('The media type of this document cannot be shown.');
                    },
                    function (error) {
                        alert("An error has occurred whilst trying to read the document and it cannot be shown.");
                    }
                );
            } catch (e) {
                alert('Cannot create an instance of SitewaertsDocumentViewer plugin');
            }
        }
    ).fail(
        function (err) {
            alert('The requested file could not be downloaded to your device.');
        }
    );
},

App.Utils.Media.getLocalUrl = function (model) {
    var parent = this;
    var defer = $.Deferred();
    var node = new App.Models.Node(JSON.parse(model));
    var path = App.Config.appDataPath + 'files/' + node.attributes.ID + '.' + node.attributes.MediaExt;

    //if the file doesn't exist locally, download it now
    window.resolveLocalFileSystemURL(path,
        function () {
            //file exists
            defer.resolve(path);
        },
        function () {
            //file doesn't exist so download it
            var downloadPath = App.Config.downloadDomain + App.Config.downloadPath + 'files/' + node.attributes.ID + '.' + node.attributes.MediaExt;
            var fileTransfer = new FileTransfer();

            fileTransfer.download(downloadPath, path,
                function (entry) {
                    defer.resolve(path);
                },
                function (err) {
                    defer.reject(err);
                }
            );
        }
    );

    return defer.promise();
},

App.Utils.Media.showDocument = function (path, mimeType, options) {
    var parent = this;

    try {
        SitewaertsDocumentViewer.viewDocument(
            path,
            mimeType,
            options,
            function () {
            },
            function () {
                App.Utils.Media.deleteDocument(path);
            },
            function () {
                alert('Failed to install the 3rd party PDF Viewer software required by the application. Please open a PDF listed within the application and follow the prompts to download the cleverdox software.');
            },
            function () {
                alert('An eror occurred whilst attempting to read the PDF file.');
            }
        );
    } catch (e) {
        alert('Cannot read the document with the SitewaertsDocumentViewer plugin.');
    }
},

App.Utils.Media.installHelperPlugin =  function() {
    if (confirm("Do you want to install the free PDF Viewer App " + appId + " for your device?")) {
        installer();
        App.Utils.Media.showDocument(path, mimeType, {});
    } else {
        alert("Your document cannot be displayed until the PDF Viewer App has been installed on your device.");
    }
},

App.Utils.Media.deleteDocument =  function (path) {
    var defer = $.Deferred();

    if (App.Config.contentLocation.toLowerCase() === "cloud") {
        var filepath = "file:///storage/emulated/0";
        var filepath = path.substring(0, path.lastIndexOf("/"));
        var filename = path.substring(path.lastIndexOf("/") + 1);

        window.resolveLocalFileSystemURL(path, function (dir) {
            dir.getFile(filename, { create: false }, function (fileEntry) {
                fileEntry.remove(function () {
                    // The file has been removed succesfully
                    defer.resolve();
                }, function (error) {
                    // Error deleting the file
                    defer.reject(error);
                }, function () {
                    // The file doesn't exist
                    defer.resolve();
                });
            });
        });
    } else {
        defer.resolve();
    }
        
    return defer.promise()
}