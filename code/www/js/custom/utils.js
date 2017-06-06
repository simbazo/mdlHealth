////****************************************************************************
// Javascript helper functions.
//******************************************************************************

App.Utils.SetApplicationConfiguration = function(filePath) {
    var defer = $.Deferred();
    
    //Add all the views used by the app to a global variable in the App.Utils namespace
    App.Utils.Views = [
        "ShellLayoutView",
        "HeaderView",
        //"WebViewView",
		//WebListView"",
        //"WebContentView",
        "MenuPanelView",
        "MenuSearchView",
        "NodeView", 
        "NodesView",
        "IndexNodeView",
        "IndexView",
        "ContentsLayoutView",
        "ContentView",
        "ContentFileView",
        "ContentsView",


        "IntroView",
        "BookmarkView",
        "BookmarksView",
        "BookmarkFormView",
        
        "SettingsView",
        "RegisterView",
        "Triage1View",
        "Triage2View",
        "Triage3View",
        "Triage4View",
        "TriageOutcomeView",
        "TriagePatientView",
        "TriagePrintView",
        "NewsfeedView",
        "NewsfeedsView",
        "ErrorView"
        
    ];
    
    App.Core.DataService.getConfigData(filePath).done(
        function (vars) {
            App.Client.apiKey = vars.client.apiKey;
            App.Config.downloadDomain = vars.setup.downloadDomain;
            App.Config.downloadPath = vars.setup.downloadPath;
            App.Config.localPath = vars.setup.localPath;
            App.Config.savePath = vars.setup.localPath;
            App.Config.contentLocation = vars.content.location;
            App.Config.contentImageLocation = vars.content.imageLocation;
            App.Config.appDataDir = vars.setup.appPath;
            App.Config.webDataDir = vars.setup.webPath;
            App.Config.requiresRegistration = vars.setup.requiresRegistration;
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
        return n.Parent_ID === pID.toString();
    });
    
    return filtered;
}; 

App.Utils.filterJSONByID = function(data, ID) {
    var defer = $.Deferred();
    
    //filters the collection to match IDs that match a parentID
    //var filtered = $.grep(data, function( n, i ) {
        //return n.ID == ID.toString();        
    //});
    
    defer.resolve($.grep(data, function( n, i ) {
        return n.ID == ID.toString();        
        })
    );
    
    return defer.promise();
};

App.Utils.filterJSONByName = function(data, name) {
    //filters the collection to match IDs that match a parentID
    var filtered = $.grep(data, function( n, i ) {
        return n.Header.toString().toLowerCase() == name.toString().toLowerCase();
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

App.Utils.showChildNodes = function(data, parentID, link) {
    //if the node has hidden child nodes, then show them
    if ($("#" + parentID).find("ul").length > 0) {
        toggleChildList(parentID);
    } else { 
        //if child data exists, then renders child nodes        
        if (data.length > 0) {
            renderChildNodes(data, parentID);
        } else {
            //if the node has a link, navigate to it
            if (link.length > 0) {
                App.pressRouter.navigate('#content?' + link, {trigger: true});
            } else {
                //else navigate to the menu screen
                App.pressRouter.navigate("", {trigger: true});
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

App.Utils.RecordPageImpression = function(topicID) {
    var impressions = getStorageList('atoz.contentimpressions');
    var impression = {
        Date: new Date(),
        TopicID: topicID,
        Device: 'unknown',
        APIKey: 'unknown'
    };
    
    //add this impression to impressions
    addStorageList('atoz.contentimpressions', impressions, impression, false);
};

App.Utils.RecordBookmark = function(id, heading, annotation) {
     var bookmarks = getStorageList('appenberg.content.bookmarks');
    var bookmark =  {
                        ID: id, //$(e.currentTarget).data("id"), 
                        Heading: heading, //$(e.currentTarget).closest('div.ui-bar').find('h3:first').text(), 
                        Annotation: annotation
                    }; 
    
    //add this impression to impressions
    addStorageList('appenberg.content.bookmarks', bookmarks, bookmark, false);
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
            //trigger click
            //var e = jQuery.Event("keydown");
            //e.which = 50; // # Some key code value
            //$('#toggleSearchBtn').trigger(e);
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
            if (!App.shellLayoutView.webviewPanel.hasView()) {
                alert('the webpanel already has a view');
                App.webContentView = new App.Views.WebContentView();
                App.shellLayoutView.webviewPanel.show(App.webContentView);
            } else {
                alert('no view exists in the webpanel yet');
                App.webView = new App.Views.WebView();
                App.shellLayoutView.headerPanel.show(App.headerView, { changeHash: false });
            }
            //App.webView = new App.Views.WebView();
            //App.shellLayoutView.headerPanel.show(App.headerView, { changeHash: false });
        //} else {
           // alert('No webviews have been defined for this publication.');
           // throw new Error('No webviews have been defined for this publication.');
        }
    });

    /*App.Utils.ToggleWebviewPanel = function () {
        if (App.Config.showWebview) {
            if (!App.shellLayoutView.webviewPanel.hasView()) {
                App.webviewView = new App.Views.WebviewView();
                App.shellLayoutView.webviewPanel.show(App.webviewView);
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
        if (!App.shellLayoutView.webviewPanel.hasView()) {
            App.webviewView = new App.Views.WebviewView();
            App.shellLayoutView.webviewPanel.show(App.webviewView);
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

App.Utils.IsRegistered = function() {
    var key = localStorage.getItem('appenberg.apiKey');
    if (!key) {
        return false;
    } else {
        if (!key.persondeviceKey) {
            return false;
        } else {
            if (!key.expiryDate) {
                return false;
            } else {
                var expiryDate = new Date(key.expiryDate);
                var currentDate = new Date();
                var diff = expiryDate - currentDate;
                
                if (expiryDate - currentDate < 0) {
                    return false;
                }
            }
        }
    }
    
    return true;
}

App.Utils.IsUserRegistered = function () {
    var defer = $.Deferred();

    var regCookie = getStorageList('atoz.registration');

    if (!regCookie || !regCookie.regDate || (dateDayDiff(dateParseDMY(regCookie.expDate), dateParseDMY(dateCurrent())) < 1)) {
        defer.resolve(false);
    } else {
        defer.resolve(true);
    }

    return defer.promise();
}

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
                
//                contentData: contentData,
                email: userData["email"]
            },
            success: function(data){
                ////alert('register.php returned...');
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

App.Utils.ToggleMenuPanel = function () {
    if( $(".ui-panel").hasClass("ui-panel-open") === true ){
        $('#nav-panel').panel('close');
     }else{
        $('#nav-panel').panel('open');
     }
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
    var setupCookie = getStorageList('appenberg.setup');
    var newSetupCookie = {
        isSetup: true,
        setupDate: new Date()
    };

    if (App.Config.contentLocation.toLowerCase() === 'browser') {
        addStorageList('appenberg.setup', setupCookie, newSetupCookie, true);
        defer.resolve();
    } else {
        if (!setupCookie || !setupCookie.isSetup) {
            App.Utils.copyLocalDataToAppData().done(
                function () {
                    //first update the cookie
                    addStorageList('appenberg.setup', setupCookie, newSetupCookie, true);

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

App.Utils.CheckForCloudAcces = function () {
    var defer = $.Deferred();

    try {
        switch (navigator.connection.type) {
            case Connection.NONE:
                defer.reject();
                break;
            case Connection.CELL:
                var msg = "WIFI is currently unavailable. Would you like to continue using mobile data? \nWarning: download content may be large."
                navigator.notification.confirm('Cordova Alert',
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

App.Utils.FixContentFormat = function (str) {
    //called from the template to convert base64 and fix the paths of images
    var content = decodeURIComponent(escape(window.atob(str)));

    content = App.Utils.fixImagePaths(content);
    content = App.Utils.SetTableScrollingCSS(content);
    //content = App.Utils.FixTableScrolling(content);

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
}

App.Utils.FixTableScrolling = function (content) {
    content = App.Utils.SetTableScrollingCSS(content);

    $(content).find('table.js-scrollabletable').each(function () {
        var table = this;
        if ($(table).find('tr').length > 9) {
            $(table).tableHeadFixer({ "left": 1 });
        };
    });

    return content;
}

App.Utils.SetTableScrollingCSS = function (content) {
    $(content).find('table.js-scrollabletable').parent().each(function () {

        var table = $(this).wrap('<p/>');
        var findText = $(table).parent().html();        

        if ($(table).find('table.js-scrollabletable tr').length > 9) {
            $(table).find('table.js-scrollabletable').css({
                "width": "1800px",
                "border-collapse": "separate"
            });

            $(table).find('table.js-scrollabletable').parent().css("height", screen.availHeight);
            content = $(table).parent().html();            
        }
    });

    return content;
}

function setContentSettings(jqXHR, textStatus) {
    App.NodeData = jqXHR;
}

function recordRegistration(UserKey, UserDeviceKey) {    
    var settings = getStorageList('appenberg.settings');
    settings.UserKey = UserKey;
    settings.UserDeviceKey = UserDeviceKey;
    
    localStorage.setItem("appenberg.settings", JSON.stringify(settings));
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
            //collapseSiblingLists( $('#' + e).attr('id'));
            //$(this).find('li a').toggleClass('tocHighlight');
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
                //$(this).addClass("hide");
                $(this).css('display', 'none');
            });
            
            $(this).addClass("hide");
        });
    }
};

function renderChildNodes(data, parentID) {    
    //get the nodes to be rendered
    var nodes = new App.Models.Nodes(data);
    var view = new App.Views.NodesView({ collection: nodes});
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

function getStorageList(key) {
    var arr = localStorage.getItem(key);
    
    if (arr === null)
    {
        arr = [];
    }
    
    return jQuery.makeArray(arr);
}

function addStorageList(key, array, item, replace) { 
    array.push(JSON.stringify(item));

    if (replace) {
        localStorage.removeItem(key);
    }
    
    localStorage.setItem(key,array);
}

function removeStorageList(key, array, index) {
    array.splice(index, 1);

    localStorage.setItem(key, array);
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

function dateParseDMY(str) {
    var dmy = str.split('/');
    return new Date(dmy[2], dmy[1] - 1, dmy[0]);
}

function dateDayDiff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function dateCurrent() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    return dd + '/' + mm + '/' + yyyy;

}