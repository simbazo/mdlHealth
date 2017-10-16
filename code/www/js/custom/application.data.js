//Create a core DataService that is responsible for returning async data
App.Core.DataService = new function () {
    var serviceBase = 'data/',

    getTocData = function() {
        return data = $.getJSON(serviceBase + 'toc.json');
    },
            
    getJSONFromFile = function(filePath) {
        var parent = this;
        var defer = $.Deferred();

        switch (App.Config.contentLocation.toLowerCase()) {
            case "browser":
                this.getJSONFromLocalFilePath(filePath).done(
                    function (data) {
                        defer.resolve(data);
                    }
                ).fail(
                    function (error) {
                        defer.reject(error);
                    }
                );
                break;
            case "local":
                this.getJSONFromLocalFilePath(filePath).done(
                    function (data) {
                        defer.resolve(data);
                    }
                ).fail(
                    function (error) {
                        defer.reject(error);
                    }
                );
                break;
            case "cloud":
                this.getJSONFromUrl(filePath).done(
                    function (data) {
                        defer.resolve(data);
                    }
                ).fail(
                    function () {
                        //var e = new Error('Connection error: Cannot proceed until this device has been connected to the internet. Please connect WIFI or enable mobile data and try again.');
                        defer.reject(new Error('Connection error: Cannot proceed until this device has been connected to the internet. Please connect WIFI or enable mobile data and try again.'));
                    }
                );
                break;
            case "mixed":
                this.getJSONFromLocalFilePath('data/' + filePath).done(
                    function (data) {
                        defer.resolve(data);
                    }
                ).fail(
                    function () {
                        parent.getJSONFromUrl(filePath).done(
                            function (data) {
                                defer.resolve(data);
                            }
                        ).fail(
                            function (error) {
                                defer.reject(new Exception('The JSON content "' + filePath + '" could not be found locally or in the cloud.'));
                            }
                        );
                    }
                );
                break;
            default:
                defer.reject(new Exception('The configuration file did not specify a location for the JSON content.'));
        }
        
        return defer.promise();
    },
            
    getJSONFromLocalFilePath = function (filePath) {
        //local file path must try to resolve app path else use local path
        var defer = $.Deferred();
        
        //fix the filename to include its json extension
        filePath = (filePath.indexOf('.json') === -1) ? filePath + '.json' : filePath;

        try {
            //first try to get the data from the cordova application directory
            $.getJSON(App.Config.appDataPath + filePath).done(
                function (data, textStatus, jqXHR) {
                    defer.resolve(data);
                }
            ).fail(
                function () {
                    //next try to get the data from the local file system - www/data
                    $.getJSON(App.Config.webDataDir + filePath).done(
                        function (data, textStatus, jqXHR) {
                            defer.resolve(data);
                        }
                    ).fail(
                        //finally return an error if both previous methods failed
                        function (jqXHR, textStatus, errorThrown) {
                            defer.reject('Failed to retrieve JSON data from path: ' + filePath);
                        }
                        );
                }
            );
        } catch(e) {
            defer.reject('Could not retrieve JSON data from path: ' + filePath);
        } finally {
            return defer.promise();
        }
    },
            
    getJSONFromUrl = function (fileName) {
        var defer = $.Deferred();

        App.Utils.CheckForCloudAcces().done(
            function () {
                var path = App.Config.downloadDomain + App.Config.downloadPath;

                //fix up the URL if needed
                fileName = fileName || 'index';
                fileName = fileName.indexOf('.json') === -1 ? fileName + '.json' : fileName;

                //data object passed to the server
                var data = {
                    apiKey: null,
                    personKey: null,
                    mode: 'getjsonfile',
                    params: {
                        url: path + fileName
                    }
                };

                //do that ajax call now
                try {
                    $.ajax({
                        url: "http://api.appenberg.co.za/content/content.php",
                        method: "POST",
                        dataType: "json",
                        crossDomain: true,
                        data: { data: JSON.stringify(data) },
                        success: function (response) {
                            defer.resolve(response);
                        },
                        error: function (error) {
                            defer.reject(error);
                        }
                    });
                } catch (e) {
                    defer.reject('Could not retrieve JSON data from URL: ' + path + fileName);
                }
            }
        ).fail(
            function () {
               defer.reject();
            }
        );

        return defer.promise();
    },

    sendJSONToUrl = function (url, method, data) {
        var defer = $.Deferred();

        App.Utils.CheckForCloudAcces().done(
            function () {
                try {
                    $.ajax({
                        url: url,
                        method: method,
                        dataType: "json",
                        crossDomain: true,
                        data: { data: JSON.stringify(data) },
                        success: function (response) {
                            defer.resolve();
                        },
                        error: function (error) {
                            defer.reject();
                        }
                    });
                } catch (e) {
                    defer.reject();
                }
            }
        ).fail(
            function () {
                //throw new Error('Connection error: Cannot proceed until this device has been connected to the internet. Please connect WIFI or mobile data and try again.');
                defer.reject();
            }
        );

        return defer.promise();
    },
            
    getIndexData = function() {
        return data = $.getJSON(serviceBase + 'index.json');
    },
            
    getIndexDataByTerm = function(data, name) {
        return data = $.getJSON(serviceBase + 'index.json').done(function(data) {
            var filtered = $.grep(data, function(n, i) {
                return n.header.toString().toLowerCase() === name.toString().toLowerCase();
            });    
            return filtered;
        });
    },

    getConfigData = function (fileName) {
        var defer = $.Deferred();

        fileName = (fileName.indexOf('.json') === -1) ? fileName + '.json' : fileName;
        
        $.getJSON(fileName).done(
            function (data, textStatus, jqXHR) {
                defer.resolve(data);
            }
        ).fail(
            function (jqXHR, textStatus, errorThrown) {
                defer.reject('Failed to retrieve JSON data from path: ' + fileName);
            }
        );
        
        return defer.promise();
    };
 
    return {
        getTocData: getTocData,
        getIndexData: getIndexData,
        getIndexDataByTerm: getIndexDataByTerm,
        getJSONFromFile: getJSONFromFile,
        getJSONFromLocalFilePath: getJSONFromLocalFilePath,
        getJSONFromUrl: getJSONFromUrl,
        sendJSONToUrl: sendJSONToUrl,
        getConfigData: getConfigData
    };
}();


