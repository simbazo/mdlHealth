$(function () {
        window.onerror = function (err) {
        if (App.Errors.pushErrors) {
            App.Errors.PushError(err).fail(
                function () {
                    App.Errors.RecordError(err);
                }
            );
        } else {
            App.Errors.RecordError(err);
        }

        if (App.Errors.scheduleErrors) {
            App.Errors.PushScheduledErrors();
        }

        if (App.Errors.showErrors) {
            App.Errors.ShowError(err, App.Errors.showErrorsAs);
        }
    };
}());

//disable jQuery routing in favout of Backbone Marionette routing 
$(document).on("mobileinit", function () {
    //Disable default JQM routing - we use Marionette routing
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    $.mobile.popup.prototype.options.history = true;
    
    //Enable cross-domain ajax using CORS - this is set on the PHP pages already
    //but we include it as a precaution
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
});

//code to initialise and respond to the panzoom plugin
$(document).on('pagebeforeshow', '#panel-responsive-page1', function() {  
    $(document).on("popupafteropen", "#globalImagePopup",function( event, ui ) {
        $('#globalImagePopup .panzoom').panzoom();
    }); 
    
    $(document).on("popupafterclose", "#globalImagePopup",function( event, ui ) {
        event.preventDefault();
    });
    
    //pan and zoom in response to mousewheel / gestures
    $(document).on('mousewheel.focal', '#globalImagePopup .parent', function( e ) {
        e.preventDefault();
        var delta = e.delta || e.originalEvent.wheelDelta;
        var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
        $('#globalImagePopup .panzoom').panzoom('zoom', zoomOut, {
            increment: 0.1,
            animate: false,
            focal: e
        });
    });
    
    //double click / tap to reset popup image
    $(document).on('dblclick', '#globalImage', function() {
        $(this).closest('.panzoom').panzoom("resetZoom", {
            animate: false,
            silent: true
        });
        $(this).closest('.panzoom').panzoom("resetPan", {
            animate: false,
            silent: true
        });
    });
    
    //reset the popup image zoom and pan after popup closes
    $(document).on("popupafterclose", '#globalImagePopup', function( event, ui ) {
        $(this).find('.panzoom').panzoom("resetZoom", {
            animate: false,
            silent: true
        });
        
        $(this).find('.panzoom').panzoom("resetPan", {
            animate: false,
            silent: true
        });
    });
});

$(document).on('pageshow', '#panel-responsive-page1', function () {
    $(document).on("swiperight", '#content-panel', function (event) {
        $("#nav-panel").panel("open");
        $("#reference-panel").panel("close");
    });

    $(document).on("swipeleft", '#content-panel', function (event) {
        $("#nav-panel").panel("close");
        $("#reference-panel").panel("open");
    });
});

$(document).ready(function () {
    //register the deviceready event for mobile devices
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
       document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        //for platform compatibility...
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

        onDeviceReady();
    }

    //start plugin to prevent text selection
    //elements in the DOM with the notSelectable class will not have text highlighting
    $('.notSelectable').disableSelection();
    
    //Handle the bookmark banner event  
    $('body').on('click', '.ui-header .ui-icon-star', function() {    
        var bookmarkID = $('#btnBookmarkNode').data('nodeID');
        
        if (bookmarkID && bookmarkID > 0) {
            App.pressRouter.navigate("#bookmarkform?" + bookmarkID, {trigger: true});            
        }
    });
    
    //Handle the previous banner event    
    $('body').on('click', '.ui-header .ui-icon-arrow-l', function() {
        var prevID = $('#btnPrevNode').data('nodeID');
        
        if (prevID && prevID > 0) {
            App.pressRouter.navigate("#content?" + prevID, {trigger: true});
        }
    });
    
    //Handle the next banner event 
    $('body').on('click', '.ui-header .ui-icon-arrow-r', function() {
        var nextID = $('#btnNextNode').data('nodeID');
        
        if (nextID && nextID > 0) {
            App.pressRouter.navigate("#content?" + nextID, {trigger: true});
        }
    });
    
    //Handle the change between the Contents, Index, Bookmarks and Glossary
    $('body').on('click', '#searchOptionsPop li a', function() {
        switch ($(this).text().toLowerCase()) {
            case "contents":
                App.pressRouter.navigate("#menu", {trigger: true});
                $('#index-autocomplete-input').attr({ placeholder: 'Table of Contents', disabled: 'disabled' });
                break;
            case "index":
                App.pressRouter.navigate("#index", {trigger: true});
                $('#index-autocomplete-input').attr( { placeholder:'Find an index topic...'} );
                $('#index-autocomplete-input').removeAttr('disabled');
                break;
            case "bookmarks":
                App.pressRouter.navigate("#bookmarks", {trigger: true});
                $('#index-autocomplete-input').attr({ placeholder: 'Bookmarks', disabled: 'disabled' });
                break;
        }
    });

    //initialize panzoom on media container images
    $("#mediaContainer > img").panzoom({ contain: true  });
    
    $('body').on('swipe', '#content-panel .panzoom table tr td', function(event, data){
        event.stopImmediatePropagation();
    });
    
    //when clicking on a newsfeed link
    $('body').on('click', '#newsfeed a[data-index]', function(e) {
        e.preventDefault();
        
        switch ($(this).data('show-as')) {
            case 'inline' :
                App.Utils.RenderNewsfeedAsInline($(this).data('index'));
                break;
            case 'popup':
                App.Utils.RenderNewsfeedAsPopup($(this).data('index'));
                break;
            default:
                App.Utils.RenderNewsfeedAsView($(this).data('index'));
        }
    });

    /***** Register functions *****/

    //Toggle Register button on Register view 
    $('body').on('click', '#agree', function () {
        if ($(this).is(":checked")) {
            $('#agree_terms').attr('disabled', false);
        } else {
            $('#agree_terms').attr('disabled', true);
        }
    });

    //Submit register form
    $('body').on('click', '#agree_terms', function () {
        if ($("#otp").val().length < 6) {
            var registerData = {
                "first_name": "",
                "last_name": "",
                "email": $('#email').val(),
                "sex": $('#sex').val(),
                "dob": $('#dob').val(),
                "role": $('#role').val(),
                "device_id": App.Config.device,
                "app_id": App.Config.applicationKey
            };

            try {
                $.ajax({
                    url: "http://editor2.appenberg.co.za/api/v1/forms/icg-users",
                    method: "POST",
                    dataType: "json",
                    crossDomain: true,
                    data: registerData,
                    success: function (data) {
                        $("#otp").val(data.pin.pin);
                        App.Utils.StoreUser(data.pin.user_uuid);
                        $("#agree_terms").prop("disabled", "disabled");
                        $("#confirm-container").removeClass('hidden').addClass('show');
                    },
                    error: function (error) {
                        alert("An error occurred. Please confirm\nyour details and resubmit.");
                    }
                });
            } catch (e) {
                alert('An error occurred.\nPlease check that your device is connected to the internet.');
            }
        }
    });

    //Confirm OTP
    $('body').on('keyup', '#confirm_otp', function () {
        var otp = $(this).val();

        if (otp.length === 6) {
            if (otp === $("#otp").val()) {
                //Check the PIN on the server and delete if correct
                $.ajax({
                    url: "http://editor2.appenberg.co.za/api/v1/forms/icg/users/" + otp,
                    method: "GET",
                    dataType: "json",
                    crossDomain: true,
                    success: function (data) {
                        $(this).prop("disabled", "disabled");
                        $("#agree_terms").removeProp("disabled");

                        //Mark app as registered - for next 5 years?!!!
                        var targetDate = new Date();
                        var regCookie = App.Utils.getStorageList('mdl.registration');
                        var newRegCookie = {
                            isReg: true,
                            expiryDate: targetDate.setDate(targetDate.getFullYear() + 5)
                        };
                        App.Utils.addStorageList('mdl.registration', regCookie, newRegCookie, true);

                        //Does a router exist for the application
                        if (!App.pressRouter) {
                            //Instantiate the application router
                            App.pressRouter = new App.Core.Router();
                        }

                        //get the first node            
                        var node = App.Utils.filterJSONByLevel(App.NodeData, 0);
                        node = new App.Models.Node(node[0]);

                        //Instantiate the shell view
                        App.shellView = new App.Views.ShellView({ model: node });

                        //Show the content and prevent if from being destroyed
                        App.press.shellRegion.show(App.shellView);

                        //Transit to the first page
                        $(':mobile-pagecontainer').pagecontainer('change', '#panel-responsive-page1', {
                            allowSamePageTransition: true,
                            changeHash: false
                        });

                        //Navigate to the home route
                        App.pressRouter.navigate("home", { trigger: true });
                    },
                    error: function (error) {
                        alert('Incorrect PIN entered. Please re-try.');
                    }
                });
            }
        }
    });
});

//Create the default 'Show all index nodes' index item
$(document).on("pagecreate", "#panel-responsive-page1", function () {
    App.Errors.CreateErrorPopup();
    $("body").on("filterablebeforefilter", "#index-autocomplete", function (e, data) {
        var $ul = $(this),
            $input = $(data.input),
            value = $input.val(),
            html = "";
        $ul.html("");
        
        if (value && value.length > 2) {
            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
            $ul.listview("refresh");
            
            App.Core.DataService.getIndexDataByTerm(App.IndexData, value).done(function(data) {
                html += "<li>";
                html += "<div class='menu-item-container' id='-1'>";
                html += "<div class='menu-item-text'>Show all index nodes</div>";
                html += "<p style='padding-left: 0.25em;'>This search may be slow if the index is large</p>";
                html += "<p class='ui-li-aside'></p>";
                html += "</div>";
                html += "</li>";
                
                $.each(data, function(i, val) {
                    html += "<li>";
                    html += "<div class='menu-item-container' id='"+val.file+"'>";
                    html += "<div class='menu-item-text'>"+val.header+"</div>";
                    html += "<p style='padding-left: 0.25em;'>"+val.subheader1+"</p>";
                    html += "<p class='ui-li-aside'>" + val.type + "</p>";
                    html += "</div>";
                    html += "</li>";
                });
                
                $ul.html(html);
                $ul.listview("refresh");
                
                //remove the existing first-child and make the 'All' node first
               $ul.find('li.ui-first-child').removeClass('ui-first-child');
               $ul.find('li:first-child').addClass('ui-first-child').removeClass('ui-screen-hidden');
                
                $ul.trigger("updatelayout");
            });
        }
    });
});

function onDeviceReady() {
    alert('onDeviceReady()');
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("offline", App.Utils.Offline, false);
    document.addEventListener("online", App.Utils.Online, false);

    App.Config.device = (device.serial === "unknown") ? device.uuid : device.serial;

    App.Utils.SetApplicationConfiguration('settings.json').done(
        function (response) {
           App.Utils.CopyLocalDataFiles().always(
                function () {
                    App.Core.DataService.getJSONFromFile('toc').done(
                        function (jqXHR, textStatus) {
                            App.NodeData = jqXHR;
                        }
                    ).fail(
                        function (error) {
                            App.NodeData = {};
                            throw error;
                        }
                    ).always(
                        function () {
                            App.Core.DataService.getJSONFromFile('index').done(
                                function (jqXHR, textStatus) {
                                    App.IndexData = jqXHR || {};
                                }
                            ).fail(
                                function (message) {
                                    App.IndexData = {};
                                }
                            ).always(
                                function () {
                                    startApplication();
                                }
                            );
                        }
                    );
                }
            );
        }
    ).fail(
        function (response) {
            throw new Error('Failed to set application configutation with return message: ' + response);
        }
    );
}

function onBackKeyDown(e) {
  e.preventDefault();
}

function setTocNodes(jqXHR, textStatus) {
    App.NodeData = jqXHR;
}

function setIndexNodes(jqXHR, textStatus) {
    App.IndexData = jqXHR;
}

function startApplication() {
    //Load the template for each view
    App.Core.Templates.load(App.Utils.Views, function() {
        //Now create an appliation instance
        App.press = new App.Core.Application();

        //Add the shell region to the application instance
        App.press.addRegions({
            shellRegion: new App.Core.ShellRegion(),
            mainRegion: new App.Core.MainRegion()
        });

        //Add an initialiser to populate the shellRegion on startup
        App.press.addInitializer(function (options) {
            //We may need the register view if required by the application
            var showRegisterView = false;

            if (App.Config.requiresRegistration) {
                App.Utils.IsUserRegistered().done(function (result) {
                    if (!result) {
                        showRegisterView = true;
                    }
                });
            }

            if (showRegisterView) {
                // Show the Register view
                App.basicRegisterView = new App.Views.BasicRegisterView();
                App.press.mainRegion.show(App.basicRegisterView);
            } else {
                //Does a router exist for the application
                if (!App.pressRouter) {
                    //Instantiate the application router
                    App.pressRouter = new App.Core.Router();
                }

                //get the first node            
                var node = App.Utils.filterJSONByLevel(App.NodeData, 0);
                node = new App.Models.Node(node[0]);

                //Instantiate the shell view
                App.shellView = new App.Views.ShellView({ model: node });

                //Show the content and prevent if from being destroyed
                App.press.shellRegion.show(App.shellView);

                //Transit to the first page
                $(':mobile-pagecontainer').pagecontainer('change', '#panel-responsive-page1', {
                    allowSamePageTransition: true,
                    changeHash: false
                });

                //Navigate to the home route
                App.pressRouter.navigate("home", { trigger: true });
            }




            //get the first node            
            //var node = App.Utils.filterJSONByLevel(App.NodeData, 0);
            //node = new App.Models.Node(node[0]);

            //Instantiate the shell view
            //App.shellView = new App.Views.ShellView({ model: node });

            //Show the content and prevent if from being destroyed
            //App.press.shellRegion.show(App.shellView);

            //Transit to the first page
            //$(':mobile-pagecontainer').pagecontainer('change', '#panel-responsive-page1', {
                //allowSamePageTransition: true,
                //changeHash: false
            //});
        });    

        //Start the application instance to trigger the router's default route
        App.press.start();
        Backbone.history.start();
    });
}


