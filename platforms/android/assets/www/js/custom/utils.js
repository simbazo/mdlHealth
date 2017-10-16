////****************************************************************************
// Javascript helper functions.
//******************************************************************************

App.Utils.SetApplicationConfiguration = function(filePath) {
    var defer = $.Deferred();
    
    //Add all the views used by the app to a global variable in the App.Utils namespace
    App.Utils.Views = [
        "ShellView",
        "HeaderView",
        //"WebViewView",
        //"WebView",
        //"WebListView",
        //"WebContentView",
        "MenuPanelView",
        "MenuSearchView",
        "NodeView",
        "NodesView",
        "IndexNodeView",
        "IndexView",
        "IntroView",
        "BookmarkView",
        "BookmarksView",
        "BookmarkFormView",
        "ContentView",
        "ContentFileView",
        "ContentsView",
        "SettingsView",
        "BasicRegisterView",
        "Triage1View",
        "Triage2View",
        "Triage3View",
        "Triage4View",
        "TriageOutcomeView",
        "TriagePatientView",
        "TriagePrintView",
        "NewsfeedView",
        "NewsfeedsView",
        "ErrorView",
        "FooterItemView",
        "FooterView",
        "ReferenceItemView",
        "ReferenceView",
        "HeaderRegisterView"
        
    ];
    
    App.Core.DataService.getConfigData(filePath).done(
        function (vars) {
            App.Client.apiKey = vars.client.apiKey;
            App.Config.applicationKey = vars.version.applicationKey;
            App.Config.packageKey = vars.version.packageKey;
            App.Config.requiresRegistration = vars.setup.requiresRegistration;
            App.Config.downloadDomain = vars.setup.downloadDomain;
            App.Config.downloadPath = vars.setup.downloadPath;
            App.Config.localPath = vars.setup.localPath;
            App.Config.localImagePath = vars.setup.localImagePath;
            App.Config.localMediaPath = vars.setup.localMediaPath;
            App.Config.savePath = vars.setup.localPath;
            App.Config.contentLocation = vars.content.location;
            App.Config.contentImageLocation = vars.content.imageLocation;
            App.Config.contentMediaLocation = vars.content.mediaLocation;
            App.Config.menuForceShowToc = vars.menu.forceShowToc;
            App.Config.footerShowFilterBar = vars.footer.showfilterBar;
            App.Config.footerFilterLevel = vars.footer.filterLevel || 1;
            App.Config.appDataDir = vars.setup.appPath;
            App.Config.webDataDir = vars.setup.webPath;
            App.Errors.showErrors = vars.notifications.errors.showErrors;
            App.Errors.showErrorsAs = vars.notifications.errors.showErrorsAs;
            App.Errors.pushErrors = vars.notifications.errors.pushErrors;
            App.Errors.scheduleErrors = vars.notifications.errors.scheduleErrors;

            if (App.Config.contentLocation.toLowerCase() === 'browser') {
                App.Config.localDomain = "";
                App.Config.saveDomain = "";
                App.Config.appDataPath = vars.setup.appPath;;
            } else {
                App.Config.localDomain = cordova.file.applicationDirectory;
                App.Config.saveDomain = cordova.file.dataDirectory;
                //App.Config.appDataPath = cordova.file.dataDirectory + '/' + vars.setup.appPath;
                App.Config.appDataPath = cordova.file.dataDirectory + vars.setup.appPath;
            }
            
            defer.resolve();
        }
    ).fail(
        function(error) {
            defer.reject();
        }
    );
    
    return defer.promise();
};

App.Utils.loadJSONFile = function(file, callback) {
    //loads a json file and passes its string data to the callback function
    $.getJSON(file, function(data) {
        callback(data);
    });
};


App.Utils.filterJSONByLevel = function(data, level) {
    //filters the collection to match IDs that match a parentID
    var filtered = $.grep(data, function( n, i ) {
        return parseInt(n.Level_ID) === parseInt(level);
    });
    
    return filtered;
};  

App.Utils.filterJSONByParent = function(data, pID) {
    //filters the collection to match IDs that match a parentID
    var filtered = $.grep(data, function( n, i ) {
        return parseInt(n.Parent_ID) === parseInt(pID);
    });
    
    return filtered;
}; 

App.Utils.filterJSONByID = function (data, ID) {
    var filtered = $.grep(data, function( n, i ) {
        return parseInt(n.ID) === parseInt(ID);        
    });

    return filtered;
};

App.Utils.filterJSONByName = function(data, name) {
    //filters the collection to match IDs that match a parentID
    var filtered = $.grep(data, function( n, i ) {
        return n.Header.toString().toLowerCase() === name.toString().toLowerCase();
    });
    
    return filtered;
};

App.Utils.filterJSONIndexByName = function(data, name) {
    //filters the collection to match IDs that match a parentID
    var filtered = $.grep(data, function( n, i ) {
        return n.header.toString().toLowerCase() === name.toString().toLowerCase();
        //return (n.header.toString().toLowerCase().indexOf(Name.toString().toLowerCase()) > 0  || n.subheader1.toString().toLowerCase().indexOf(Name.toString().toLowerCase()));
    });    
    return filtered;
};

App.Utils.filterJSONByIDandChildren = function (data, ID) {
    //filters the collection to match IDs
    var filtered = $.grep(data, function (n, i) {
        return n.ID == ID.toString();
    });

    var children = App.Utils.filterJSONByParent(data, filtered[0].ID);

    if (filtered.constructor === Array && children.constructor === Array) {
        filtered = filtered.concat(children);
    }

    return filtered;
};


App.Utils.Menu.showChildNodes = function(data, parentID, link) {
    //if the node has hidden child nodes, then show them
    if ($("#" + parentID).find("ul").length > 0) {
        toggleChildList(parentID);
    } else { 
        //if child data exists, then renders child nodes        
        if (data.length > 0) {
            renderChildNodes(data, parentID);
        } else {
            if (link.length > 0) {
                var node = App.Utils.filterJSONByID(App.NodeData, link);

                switch (node[0].MediaExt.toLowerCase()) {
                    case "pdf":
                        App.pressRouter.navigate("#contentfile?" + link, { trigger: true });
                        break;
                    default:
                        App.pressRouter.navigate('#content?' + link, { trigger: true });
                }
            } else {
                throw new Error("The node ID is invalid.")
            }
        }
    }
};

App.Utils.filterJSONBySearch = function(data, term) {
    //filters the collection to match node headers with the search term
    var filtered = $.grep(data, function( n, i ) {
        return n.Header.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
    
    return filtered;
};

App.Utils.RecordPageImpression = function (topicID) {
    var userCookie = JSON.parse(App.Utils.getStorageList('mdl.user'));
    var impressions = App.Utils.getStorageList('mdl.contentimpressions');
    var userID = null;

    if (userCookie.length > 0) {
        userID = JSON.parse(userCookie[0]).user_uuid;
    }     

    if (impressions.length > 0) {
        impressions = JSON.parse(impressions[0]);
    } else {
        impressions = [];
    }

    var today = new Date();
    today = moment(today).format("YYYY-MM-DD");// HH:mm:ss");

    var impression = {
        date: today,
        user_uuid: userID,
        application_uuid: App.Config.applicationKey,
        device_uuid: App.Config.device,
        node_uuid: topicID
    };

    //add this impression to impressions
    App.Utils.addStorageList('mdl.contentimpressions', impressions, impression, false);

    //refresh the cookie array
    impressions = JSON.parse(App.Utils.getStorageList('mdl.contentimpressions'));

    //if (impressions.length + 1 > App.Client.UsageUploadSchedule) {
    if (impressions.length > 1) {
        App.Utils.BatchUploadUsage(impressions);
    }
};

App.Utils.RecordPageError = function (err) {
    var errors = App.Utils.getStorageList('mdl.contenterrors');
    var error = {
        Date: new Date(),
        Device: 'unknown',
        APIKey: 'unknown',
        Error: err
    };

    //add this impression to impressions
    App.Utils.addStorageList('mdl.contenterrors', errors, error, false);
};

App.Utils.RecordBookmark = function(id, heading, annotation) {
    var bookmarks = App.Utils.getStorageList('mdl.content.bookmarks');
    var bookmark =  {
                        ID: id, //$(e.currentTarget).data("id"), 
                        Heading: heading, //$(e.currentTarget).closest('div.ui-bar').find('h3:first').text(), 
                        Annotation: annotation
                    }; 
    
    //add this impression to impressions
    App.Utils.addStorageList('mdl.content.bookmarks', bookmarks, bookmark, false);
};



App.Utils.toggleSearchBar = function() {
    //called from views to hide/show the search bar (hidden by default)
    if ($(".bar-footer-secondary").is(".hide")) {
        $(".bar-footer-secondary").slideToggle(function() {
            $(this).removeClass("hide");
        });
    } else {
         $(".bar-footer-secondary").slideToggle(function() {
            $(this).addClass("hide");
        });
    }
};

App.Utils.ToggleSearchbox = function(searchType) {
    switch (searchType) {
        case 'index':
            $('#index-autocomplete-input').attr('disabled', false);
            $('#index-autocomplete-input').prop('placeholder', 'Search the index...');
            $('#toggleSearchBtn').addClass('ui-icon-bars').removeClass('ui-icon-search');
            $('#index-autocomplete-input').focus();
            break;
        case 'bookmarks':
            $('#index-autocomplete-input').attr('disabled', true);
            $('#index-autocomplete-input').prop('placeholder', 'Bookmarks list');
            $('#toggleSearchBtn').addClass('ui-icon-bars').removeClass('ui-icon-search');
            break;
        default:
            $('#index-autocomplete-input').attr('disabled', true);
            $('#index-autocomplete-input').prop('placeholder', 'Table of Contents');
            $('#toggleSearchBtn').addClass('ui-icon-search').removeClass('ui-icon-bars');
            break;
    }
};

App.Utils.ToggleWebviewPanel = function () {
    //get app settings
    App.Core.DataService.getJSONFromLocalFilePath('settings').done(function (data) {

        if (data.webview.show) {
            alert('show the webview');
            if (!App.shellView.webviewPanel.hasView()) {
                alert('the webpanel already has a view');
                App.webContentView = new App.Views.WebContentView();
                App.shellView.webviewPanel.show(App.webContentView);
            } else {
                alert('no view exists in the webpanel yet');
                App.webView = new App.Views.WebView();
                App.shellView.headerPanel.show(App.headerView, { changeHash: false });
            }
            //App.webView = new App.Views.WebView();
            //App.shellView.headerPanel.show(App.headerView, { changeHash: false });
        //} else {
           // alert('No webviews have been defined for this publication.');
           // throw new Error('No webviews have been defined for this publication.');
        }
    });

    /*App.Utils.ToggleWebviewPanel = function () {
        if (App.Config.showWebview) {
            if (!App.shellView.webviewPanel.hasView()) {
                App.webviewView = new App.Views.WebviewView();
                App.shellView.webviewPanel.show(App.webviewView);
            };

            if ($("#webview-panel").hasClass("ui-panel-open") === true) {
                $('#webview-panel').panel('close');
            } else {
                $('#webview-panel').panel('open');
            }
        }
    }*/




    /*var tmp = App.Config.showWebview;
    reurn;
    if (App.Config.showWebview) {
        if (!App.shellView.webviewPanel.hasView()) {
            App.webviewView = new App.Views.WebviewView();
            App.shellView.webviewPanel.show(App.webviewView);
        };

        if ($("#webview-panel").hasClass("ui-panel-open") === true) {
            $('#webview-panel').panel('close');
        } else {
            $('#webview-panel').panel('open');
        }
    }*/
}

App.Utils.randomIntFromInterval = function(min,max) {
    return Math.floor(Math.random() * (max-min+1)+min);
};

App.Utils.GetDeviceData = function() {
    var data = {
        "cordovaVersion": "device.cordova",
        "deviceOS": "device.platform",
        "deviceOSVersion": "device.version",
        "deviceModel": "device.model",
        "deviceUUID": "device.uuid"
    };
    
    return data;
};

App.Utils.GetUserData = function() {
    var data = {
        "email":  $("#txtRegEmail").val()
    };
    
    return data;
};

App.Utils.GetContentData = function() {
    var data = null;
    //App.Core.DataService.getSettingsData().done(setContentSettings);
    App.Core.DataService.getSettingsData().done(function(jqXHR, textStatus) {
        data = jqXHR;
    });
    
    return data;
};

App.Utils.IsUserRegistered = function () {
    var defer = $.Deferred();
    var today = new Date();
    var regCookie = App.Utils.getStorageList('mdl.registration');

    if (regCookie.length > 0) {
        regData = JSON.parse(regCookie[0]);

        if (regData.isReg && regData.expiryDate && today < regData.expiryDate) {
            defer.resolve(true);
        } else {
            defer.resolve(false);
        }
    } else {
        defer.resolve(false);
    }

    return defer.promise();
};

App.Utils.RegisterUser = function() {
    ////alert('App.Utils.RegisterUser()');
    
    App.Core.DataService.getSettingsData().done(function(jqXHR, textStatus) {
        //1: collect registration data from local device
        var deviceData = App.Utils.GetDeviceData();
        var userData = App.Utils.GetUserData();
        var contentData = jqXHR; 

        //2: send registration data to server
        $.ajax({
            url: "http://www.appenberg.org/api/registration/register.php",
            dataType: "json",
            crossDomain: true,
            data: {
                mode: "registernewuser",
                apiKey: '3c2c6cbf71f557c7f',
                cordovaVersion: deviceData["cordovaVersion"],
                deviceOS: deviceData["deviceOS"],
                deviceOSVersion: deviceData["deviceOSVersion"],
                deviceModel: deviceData["deviceModel"],
                deviceUUID: deviceData["deviceUUID"],
                email: userData["email"]
            },
            success: function(data){
                var dt = JSON.parse(JSON.stringify(data));
                //1: store the apiKey in local storage for easy access
                recordRegistration(dt[0].UserKey,dt[0].UserDeviceKey);
                
                //2: check if a folder exists for the returned version
                
                //3: if it does not contain the version, then:
                    //a: create the folder
                    //b: download the files
                    
                //4: show progress of download
                
                //5: navigate to app home
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //alert('request failed: ' + textStatus + ' : ' + errorThrown);
                window.atcHierarchy = "";
            }
        });
    });
};

App.Utils.CreateImagePopup = function() {
    var imgPopup = document.createElement('div');
    imgPopup.setAttribute('id','globalImagePopup');
    document.getElementById('panel-responsive-page1').appendChild(imgPopup);
    
    var imgSection = document.createElement('section');
    imgPopup.appendChild(imgSection);
    
    var imgParent = document.createElement('div');
    imgParent.setAttribute('class','parent');
    //imgParent.setAttribute('style','bottom: 20px;');
    imgSection.appendChild(imgParent);
    
    var imgPanzoom = document.createElement('div');
    imgPanzoom.setAttribute('class', 'panzoom');
    imgParent.appendChild(imgPanzoom);
    
    var img = document.createElement('img');
    img.setAttribute('id', 'globalImage');
    img.setAttribute('style', 'width: 100%;');
    imgPanzoom.appendChild(img);
    
    var $popup = $(imgPopup).popup({
        dismissible : false,
        theme : "a",
        overlayTheme : "b",
        transition : "pop",
        positionTo: "window",
        afteropen : function() {
           $(this).panzoom().before("<a href=\"\" data-rel=\"back\" class=\"ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right\" style=\"z-index:10000;\">Close</a>");
        },
        beforeposition: function () {
            $(this).css({
                height: window.innerHeight -(window.innerHeight/10)
            });
        },
        //x: 0,
        //y: 0,
        popupafterclose: function( event, ui ) {
            $(this).remove();
        }
    });
    
    return $popup;
};

App.Utils.PreloadImages = function(sources, callback) {
    if(sources.length) {
        var preloaderDiv = $('<div style="display: none;"></div>').prependTo(document.body);

        $.each(sources, function(i,source) {
            $("<img/>").attr("src", source).appendTo(preloaderDiv);

            if(i == (sources.length-1)) {
                $(preloaderDiv).imagesLoaded(function() {
                    $(this).remove();
                    if(callback) callback();
                });
            }
        });
    } else {
        if(callback) callback();
    }
}

App.Utils.ToggleMenuPanel = function() {
    /*if( $(".ui-panel").hasClass("ui-panel-open") === true ){
        $('#nav-panel').panel('close');
     }else{
        $('#nav-panel').panel('open');
     }*/
}

App.Utils.PanZoomTable = function(table) {
    ////alert('App.Utils.PanZoomTable()');
};

App.Utils.RenderNewsfeed = function($el, length, showAs) {
    length = length || -1;
    //get the newsfeed data
    App.Core.DataService.getJSONFromFile('news').done(function(data) {
        if (length === -1 || length > data.length) {
            length = data.length;
        }
        
        var table = $('<table></table>').attr({ id: "feedTable" });
        var row0 = $('<tr></tr>').appendTo(table);
        $('<td></td>').attr('colspan', '2').html('<h4>Newsfeed</h4>').appendTo(row0); 
        
        for (var i = 0; i < length; i++) {
            var row1 = $('<tr></tr>').appendTo(table);
            var row2 = $('<tr></tr>').appendTo(table);
            
            $('<td></td>').text(data[i].Date).appendTo(row1); 
            $('<td></td>').text(data[i].Header).appendTo(row1);

            var content = data[i].Summary + ' .... <a href="#" data-index="' + i + '" data-show-as="' + showAs + '">read more</a>';

            $('<td></td>').attr('colspan', '2').html(content).appendTo(row2);
        };
        table.appendTo($el.find('#newsfeed'));
    });
},
        
App.Utils.RenderNewsfeedAsInline = function(index) {
    App.Core.DataService.getJSONFromLocalFile('news').done(function(data) {
        $('#feedTable a[data-index=' + index + ']').closest('td').html(data[index].Content);
    });
},
        
App.Utils.RenderNewsfeedAsPopup = function(index) {
    App.Core.DataService.getJSONFromLocalFile('news').done(function(data) {
        //create a div for the popup
        var $popUp = $("<div id='newsfeedPopup'/>").popup({
            dismissible : true,
            theme : "a",
            overlayTheme : "b",
            transition : "pop"
        }).bind("popupafterclose", function() {
            //remove the popup when closing
            $(this).remove();
        });
        //create a title for the popup
        $("<h4/>", {
            text : data[index].Header
        }).appendTo($popUp);

        //create a message for the popup
        $("<p/>", {
            html : data[index].Content
        }).appendTo($popUp);
        $popUp.popup("open", {positionTo: "window"}).trigger("create");
    });
},
        
App.Utils.RenderNewsfeedAsView = function(index) {
    App.pressRouter.navigate("#newsfeed?" + index, {trigger: true});
},

App.Utils.HasLocalAppData = function () {
    var defer = $.Deferred();

    window.resolveLocalFileSystemURI(App.Config.appDataPath,
        function(fileEntry) {
            defer.resolve(true);
        },
        function(evt) {
            defer.reject(false);
        }
    );

    return defer.promise();
},

App.Utils.CopyLocalDataFiles = function () {
    var defer = $.Deferred();

    //get the setup cookie
    var setupCookie = App.Utils.getStorageList('mdl.setup');
    var newSetupCookie = {
        isSetup: true,
        setupDate: new Date()
    };

    if (App.Config.contentLocation.toLowerCase() === 'browser') {
        App.Utils.addStorageList('mdl.setup', setupCookie, newSetupCookie, true);
        defer.resolve();
    } else {
        if (!setupCookie || !setupCookie.isSetup) {
            App.Utils.copyLocalDataToAppData().done(
                function () {
                    //copy images to local if set to local
                    /*if (App.Config.contentImageLocation === "local") {
                        App.Utils.CopyLocalImagesToAppData().done(
                            function () {
                                if (App.Config.contentMediaLocation === "local") {
                                    App.Utils.CopyLocalMediaToAppData().done(
                                        function () {
                                            //
                                        }
                                    );
                                }
                            }
                        );
                    }*/

                    //now update the cookie
                    App.Utils.addStorageList('mdl.setup', setupCookie, newSetupCookie, true);

                    defer.resolve();
                }
            ).fail(
                function () {
                    defer.reject();
                }
            );
        } else {
            defer.resolve();
        }
    };

    return defer.promise();
},

App.Utils.copyLocalDataToAppData = function () {
    //copies www/data contents to the device app data storage
    var defer = $.Deferred();
    var localPath = App.Config.localDomain + App.Config.localPath;

    getEntriesInDirectory(localPath).done(
        function(entries) {
            if (entries.length === 0) {
                defer.resolve();
            } else {
                copyEntriesToDataDirectory(entries).done(
                    function () {
                        defer.resolve();
                    }                    
                ).fail(
                    function(error) {
                        defer.reject();
                    }
                );
            }
        }
    ).fail(
        function () {
            defer.reject();
        }
    );

    return defer.promise();
},

App.Utils.CopyLocalImagesToAppData = function () {
    //copies www/data contents to the device app data storage
    var defer = $.Deferred();
    var localPath = App.Config.localDomain + App.Config.localImagePath;

    getEntriesInDirectory(localPath).done(
        function (entries) {
            if (entries.length === 0) {
                defer.resolve();
            } else {
                copyEntriesToDirectory(entries, 'img').done(
                    function () {
                        defer.resolve();
                    }
                ).fail(
                    function (error) {
                        defer.reject();
                    }
                );
            }
        }
    ).fail(
        function () {
            defer.reject();
        }
    );

    return defer.promise();
},

App.Utils.CopyLocalMediaToAppData = function () {
    //copies www/data contents to the device app data storage
    var defer = $.Deferred();
    var localPath = App.Config.localDomain + App.Config.localMediaPath;

    getEntriesInDirectory(localPath).done(
        function (entries) {
            if (entries.length === 0) {
                defer.resolve();
            } else {
                copyEntriesToDirectory(entries, 'files').done(
                    function () {
                        defer.resolve();
                    }
                ).fail(
                    function (error) {

                        defer.reject();
                    }
                );
            }
        }
    ).fail(
        function () {
            defer.reject();
        }
    );

    return defer.promise();
},

App.Utils.CopyCloudMediaToAppData = function () {
    //copies www/data contents to the device app data storage
    var defer = $.Deferred();
    var cloudPath = App.Config.downloadDomain + App.Config.downloadPath + 'files/';
    var savePath = App.Config.appDataPath + 'files/';

    App.Utils.getDownloadFileList(cloudPath).done(
        function (data) {
            App.Utils.downloadDataFiles(data, cloudPath, savePath).done(
                function() {
                    alert("all files downloaded");
                }                
            ).fail(
                function (err) {
                    alert("Failed to download all files");
                }
            )
        }
    ).fail(
        function (err) {
            alert("Failed to establish which files to download");
        }
    );
},




    /*getEntriesInDirectory(cloudPath).done(
        function (entries) {
            if (entries.length === 0) {
                defer.resolve();
            } else {
                copyEntriesToDirectory(entries, 'files').done(
                    function () {
                        defer.resolve();
                    }
                ).fail(
                    function (error) {
                        defer.reject();
                    }
                );
            }
        }
    ).fail(
        function (e) {
            defer.reject();
        }
    );

    return defer.promise();
},*/

App.Utils.CheckForCloudAcces = function () {
    var defer = $.Deferred();

    try {
        switch (navigator.connection.type) {
            case Connection.NONE:
                defer.reject();
                break;
            case Connection.CELL:
                var msg = "WIFI is currently unavailable. Would you like to continue using mobile data? \nWarning: download content may be large."
                navigator.notification.confirm('PhoneGap Alert',
                    function (index) {
                        if (index < 2) {
                            defer.resolve();
                        } else {
                            defer.reject();
                        }
                    }
                )
                break;
            default:
                defer.resolve();
        };
    } catch(e) {
        defer.resolve();
    }

    return defer.promise();

},

App.Utils.StartupTasks = function () {
    if (App.Errors.scheduleErrors) {
        //App.Errors.PushScheduledErrors();
    }

},

App.Utils.FixContentFormat = function decode(str) {
    //called from the template to convert base64 and fix the paths of images
    var content = decodeURIComponent(escape(window.atob(str)));

    content = App.Utils.fixImagePaths(content);
    content = App.Utils.FixTableScrolling(content);

    return content;
};

App.Utils.fixImagePaths = function (content) {
    var path = "";

    switch (App.Config.contentImageLocation.toLowerCase()) {
        case "browser":
            path = "data/img/";
            break;
        case "local":
            path = App.Config.localDomain + App.Config.localPath + "img/";
            break;
        case "cloud":
            path = App.Config.downloadDomain + App.Config.downloadPath + "img/";
            break;
        case "mixed":
            //get from cloud now
            //but need to fix by checking if img exists locally
            path = App.Config.downloadDomain + App.Config.downloadPath + "img/";
            break;
    }

    content = content.replace(/\/uploaded_images\/[0-9]+\/images\//g, path);

    return content;
};

App.Utils.FixTableScrolling = function (content) {
    $(content).find('table').each(function () {
        var table = this;
        if ($(this).find('tr').length > 9) {
            alert('found a large table - apply plugin');
            $(document).ready(function () {
                $(table).tableHeadFixer({
                    "head": true,
                    "foot": false,
                    "left": 1
                });
            });
        };
    })

    return content;
}

App.Utils.getMimeType = function (file) {
    var suffix = file.split('.').pop();
    var mimeType = null;

    switch (suffix) {
        case "pdf":
            mimeType = 'application/pdf'

    }
    //return MIME_TYPES[suffix];
    return mimeType;
},

App.Utils.renderPDF = function(url, canvasContainer, options) {
    var options = options || { scale: 1 };

    function renderPage(page) {
        var viewport = page.getViewport(options.scale);
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvasContainer.appendChild(canvas);

        page.render(renderContext);
    }

    function renderPages(pdfDoc) {
        for (var num = 1; num <= pdfDoc.numPages; num++) {
            pdfDoc.getPage(num).then(renderPage);
        }
    }
    PDFJS.disableWorker = true;
    PDFJS.getDocument(url).then(renderPages);
},

App.Utils.getStorageList = function (key) {
    var arr = localStorage.getItem(key);

    if (arr === null) {
        arr = [];
    }

    return jQuery.makeArray(arr);
},

App.Utils.addStorageList = function (key, array, item, replace) {
    if (replace) {        
        array = [];
    }

    array.push(JSON.stringify(item));

    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(array));
},

App.Utils.removeStorageList = function (key, array, index) {
    //use understore for this job
    array = _(array).filter(function (x) { return !(x.date === item.date && x.node_uuid === item.node_uuid); });

    //update local storage
    localStorage.removeItem(key);
    localStorage.setItem(key, array);

    //array.splice(index, 1);
    //localStorage.removeItem(key);
},

App.Utils.Offline = function () {
    App.Network.connectionType = Connection.UNKNOWN;
},

App.Utils.Online = function () {
    App.Network.connectionType = navigator.connection.type;
},

App.Utils.StoreUser = function (userID) {
    var userCookie = App.Utils.getStorageList('mdl.user');
    var newUserCookie = {
        user_uuid: userID
    };

    App.Utils.addStorageList('mdl.user', userCookie, newUserCookie, true);
},

App.Utils.BatchUploadUsage = function (impressions) {
    //Loop through impressions and upload
    for (var i = 0; i < impressions.length; i++) {
        var impression = {
            "date": impressions[i].date,
            "user_uuid": impressions[i].user_uuid,
            "application_uuid": impressions[i].application_uuid,
            "device_uuid": impressions[i].device_uuid,
            "node_uuid": impressions[i].node_uuid
        };

        try {
            $.ajax({
                url: "http://editor2.appenberg.co.za/api/v1/forms/pageimpressions",
                method: "POST",
                dataType: "json",
                crossDomain: true,
                data: impression,
                success: function (data) {
                    //strip the impression from local storage
                    removeStorageList("mdl.contentimpressions", impressions, impression);
                }
            });
        } catch (e) {
            alert("Error: Failed to post page impression data to the server");
            //App.Utils.RecordPageImpression(nodeID);
        }
    }
};

function setContentSettings(jqXHR, textStatus) {
    App.NodeData = jqXHR;
}

function recordRegistration(UserKey, UserDeviceKey) {    
    var settings = App.Utils.getStorageList('mdl.settings');
    settings.UserKey = UserKey;
    settings.UserDeviceKey = UserDeviceKey;
    
    localStorage.setItem("mdl.settings", JSON.stringify(settings));
};

function getParentHeader(parentID, Header) {
    //called from templates to show the header of the node's parent
    var nodeHeader = $('#' + parentID).find('a').first().text();
    
    if (!nodeHeader) {
        nodeHeader = Header;
    }
    
    return nodeHeader;
};



function toggleChildList(e) { 
    if ($('#' + e).find("ul").is(".hide")) {
        $('#' + e).find("ul").slideToggle(function() {
            $(this).find('.menu-item-container-hilite').each(function() {
                $(this).removeClass('menu-item-container-hilite');
            });
            
            $(this).find('li ul').each(function() {
                //$(this).addClass("hide");
                $(this).css('display', 'none');
            });
            
            $(this).removeClass("hide");
        });
    } else {
        $('#' + e).find("ul").slideToggle(function() {
            $(this).find('.menu-item-container-hilite').each(function() {
                $(this).removeClass('menu-item-container-hilite');
            });
            
            $(this).find('li ul').each(function() {
                $(this).css('display', 'none');
            });
            
            $(this).addClass("hide");
        });
    }
};

function renderChildNodes(data, parentID) {    
    //get the nodes to be rendered
    var nodes = new App.Models.Nodes(data);
    var view = new App.Views.NodesView({ collection: nodes, pColor: $("#" + parentID).css("background-color")});
    var rendered = view.render().$childViewContainer;
    rendered.listview();
    
    //collapseSiblingLists(parentID);
    
    //show this sublist as highlighted
    //console.log(data[0].Level_ID);
    $('#' + parentID).closest('li').append(rendered).hide().slideDown();
    highlightSubmenu($('#' + parentID).closest('li').find('ul li a'), data[0].Level_ID);
    //$('#' + parentID).closest('li').find('ul li a').toggleClass('tocHighlight');
};

function collapseSiblingLists(parentID) {
    //look at this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    $('#' + parentID).closest('li').siblings().each(function() {
        $(this).find('ul').each(function() {
            $(this).slideToggle(function() {
                //$(this).find('li a').removeClass('tocHighlight');
                $(this).addClass("hide");
            });
        });
    });
};

function rgbToArray(color) {
    //when in rgb(x,y,z) format, drop extraneous text
    color = color.replace("rgb", "").replace("(", "").replace(")", "").split(",");
    return color.toString().split(',');
    //return "#" + componentToHex(color[0].replace(/^\s+|\s+$/g, '')) + componentToHex(color[1].replace(/^\s+|\s+$/g, '')) + componentToHex(color[2].replace(/^\s+|\s+$/g, ''));
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function highlightSubmenu(elem, level) {
    switch (level) {
        case '1':
            $(elem).toggleClass('tocDarkHighlight');
            break;
        case '2':
            $(elem).toggleClass('tocDarkHighlight');
            break;
        case '3':
            $(elem).toggleClass('tocSilverHighlight');
            break;
        case '4':
            $(elem).toggleClass('tocSilverHighlight');
            break;
        case '5':
            $(elem).toggleClass('tocWhiteHighlight');
            break;
        case '6':
            $(elem).toggleClass('tocWhiteHighlight');
            break;
    }
}

function getEntriesInDirectory(path) {
    //returns all file entries in the path
    var defer = jQuery.Deferred();

    window.resolveLocalFileSystemURL(path,
        function (entry) {
            var reader = entry.createReader();

            reader.readEntries(
                function (entries) {
                    defer.resolve(entries);
                },
                function (err) {
                    defer.reject(err);
                }
            );
        },
        function (err) {
            defer.reject();
        }
    );

    return defer.promise();
}

function copyEntriesToDataDirectory(entries) {
    var defer = jQuery.Deferred();
    var saveDir = App.Config.appDataDir;

    //open the data directory
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
        function (dirEntry) {
            //open or create the appenberg directory 
            dirEntry.getDirectory(saveDir, {create: true, exclusive: false},
                function (dirEntry) {  
                    copyEntries(entries, dirEntry).done(
                        function() {
                            defer.resolve();
                        }
                    ).fail(
                        function() {
                            defer.reject();
                        }
                    );
                }, function (error) {
                    defer.reject();
                }
            );
        },
        function (error) {
            alert('couldnt resolve the cordova data directory');
            defer.reject();
        }
    );

    return defer.promise();
}

function copyEntriesToDirectory(entries, dir) {
    var defer = jQuery.Deferred();
    var saveDir = App.Config.appDataDir + dir + '/';

    //open the data directory
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
        function (dirEntry) {
            //open or create the appenberg directory 
            dirEntry.getDirectory(saveDir, { create: true, exclusive: false },
                function (dirEntry) {
                    copyEntries(entries, dirEntry).done(
                        function () {
                            defer.resolve();
                        }
                    ).fail(
                        function () {
                            defer.reject();
                        }
                    );
                }, function (error) {
                    defer.reject();
                }
            );
        },
        function (error) {
            alert('couldnt resolve the cordova data directory');
            defer.reject();
        }
    );

    return defer.promise();
}

function copyEntries(entries, directory) {
    var counter = 0;
    var defer = new $.Deferred();
    var promises = [];

    $.each(entries, function (key, value) {
        var def = new $.Deferred();
        value.copyTo(directory, value.name,
                function () {
                    promises.push(def);
                }
        );
            
        $.when.apply($, promises).then(function() { 
            defer.resolve(); 
        });
    });

    return defer.promise();
}

App.Utils.getDownloadFileList = function (filePath) {
    var defer = jQuery.Deferred();

    App.Core.DataService.getJSONFromUrl(filePath).done(
        function (data) {
            defer.resolve(data.files);
        }
    ).fail(
        function (error) {
            defer.reject(error);
        }
    );

    return defer.promise();
}

App.Utils.downloadDataFiles = function (fileList, downloadURL, savePath) {
    //first need to do confirmation process above
    var defer = $.Deferred();
    var promises = [];

    //shared filetransfer object
    var fileTransfer = new FileTransfer();
        
    for (var i = 0; i < fileList.length; i++) {
        var def = $.Deferred();
        var url = downloadURL + '/' + fileList[i];
        var path = savePath + '/' + fileList[i];
            
        fileTransfer.download(encodeURI(url), path,
            function (entry) {
                promises.push(def);
            }
        );
            
        $.when.apply($, promises).then(function() { 
            defer.resolve(); 
        });
    };

    return defer.promise();
}