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
        };
    };
}());

//disable jQuery routing in favout of Backbone Marionette routing 
$(document).on("mobileinit", function () {
    //Disable default JQM routing - we Marionette routing
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    
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

$(document).on('pageshow', '#panel-responsive-page1', function() {
    $(document).on("swipe", function(event) {
        App.Utils.ToggleMenuPanel(); 
    });
    $(document).on('click', '#tocMenu', function() {
       App.Utils.ToggleMenuPanel(); 
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
                $('#index-autocomplete-input').attr( { placeholder:'Table of Contents', disabled: 'disabled'} )
                break;
            case "index":
                App.pressRouter.navigate("#index", {trigger: true});
                $('#index-autocomplete-input').attr( { placeholder:'Find an index topic...'} );
                $('#index-autocomplete-input').removeAttr('disabled');
                break;
            case "bookmarks":
                App.pressRouter.navigate("#bookmarks", {trigger: true});
                $('#index-autocomplete-input').attr( { placeholder:'Bookmarks', disabled: 'disabled'} )
                break;
        }
    });
    
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
        };
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
                html += "<p class='ui-li-aside'></p>"
                html += "</div>";
                html += "</li>";
                
                $.each(data, function(i, val) {
                    html += "<li>";
                    html += "<div class='menu-item-container' id='"+val.file+"'>";
                    html += "<div class='menu-item-text'>"+val.header+"</div>";
                    html += "<p style='padding-left: 0.25em;'>"+val.subheader1+"</p>";
                    html += "<p class='ui-li-aside'>" + val.type+"</p>"
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
    document.addEventListener("backbutton", onBackKeyDown, false);

    App.Utils.SetApplicationConfiguration('settings').done(
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
            mainRegion: new App.Core.MainRegion(),
            shellRegion: new App.Core.ShellRegion()
        });

        alert("requires registration: " + App.Config.requiresRegistration);
        if (App.Config.requiresRegistration) {
            App.Utils.IsUserRegistered().done(function (result) {
                if (result) {
                    //Add an initialiser to populate the shellRegion on startup
                    App.press.addInitializer(function (options) {
                        //get the first node            
                        var node = App.Utils.filterJSONByLevel(App.NodeData, 0);
                        node = new App.Models.Node(node[0]);

                        //Instantiate the shell view
                        App.shellLayoutView = new App.Views.ShellLayoutView({ model: node });

                        //Show the content and prevent if from being destroyed
                        App.press.shellRegion.show(App.shellLayoutView);

                        //Transit to the first page
                        $(':mobile-pagecontainer').pagecontainer('change', '#panel-responsive-page1', {
                            allowSamePageTransition: true,
                            changeHash: false
                        });

                        App.pressRouter = new App.Core.Router();
                    });
                } else {
                    alert("user not registered - proceed to registration screens");
                    //Add an initialiser to populate the shellRegion on startup
                    App.press.addInitializer(function (options) {
                        //Transit to the first page of registration
                        $(':mobile-pagecontainer').pagecontainer('change', '#panel-responsive-page1', {
                            allowSamePageTransition: true,
                            changeHash: false
                        });

                        App.pressRouter = new App.Core.RegisterRouter();
                    });
                }
            });
        }

        //Start the application instance to trigger the router's default route
        App.press.start();
        Backbone.history.start();
    });
};


