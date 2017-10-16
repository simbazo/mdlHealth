//Create a core Router that is responsible for:
//  * creating and destroying views - which are dynamic html fragments
//  * marshalling all navigation between application views
App.Core.Router = Backbone.Marionette.AppRouter.extend({
    //appRoutes bind to controller methods - not currently used
    //appRoutes: { 'some/route': 'someMethod' },

    //standard routes bind to this router's internal methods
    routes : {
        "" : "home",
        "home" : "home",
        "menu": "tocmenu",
        "content?:id": "content",
        "contentfile?:id": "contentfile",
        "reference?:id": "reference",
        "pagefooter": "pagefooter",
        "index" : "index",
        "bookmarks" : "bookmarks",
        "bookmarkform?:id" : "bookmarkform",        
        "search?:term" : "search",
        "settings" : "settings",
        "register" : "register",
        "triage1" : "triage1",
        "triage2" : "triage2",
        "triage3" : "triage3",
        "triage4" : "triage4",
        "triageoutcome?:qstring" : "triageoutcome",
        "triagepatient" : "triagepatient",
        "triageprint" : "triageprint",
        "newsfeeds" : "newsfeeds",
        "newsfeed?:index": "newsfeed",
        "error?:err": "error",
		"webview": "webview"
    },
    
    initialize: function () {
    },
    
    home: function () {
        //do registration or start the app
        /*if (!App.Utils.Registration.isRegistered()) {
            App.Utils.Registration.requestRegistration().done(
                function (response) {
                    if (response == true) {
                        App.pressRouter.navigate("register", { trigger: true });
                    } else {
                        App.Utils.Registration.requestPreviousRegistration().done(
                            function (response) {
                                if (response === true) {
                                    alert("check the cloud for previous registration using function App.Utils.Registration.confirmPreviousRegistration()");
                                } else {
                                    navigator.notification.alert(
                                        'The application will now shut down.\n\nYou may attempt registration at any point in the future.',  // message
                                        function () {                           // callback
                                            navigator.app.exitApp();
                                        },
                                        'Exit application',                     // title
                                        'OK'                                    // buttonText
                                    );
                                }
                            }
                        );
                    }
                }
            );
        } else {*/
            //ensure all the regions have been added (they may have been removed during registration
            this.resetRegions();

            //first show the header view
            var headerData = App.Utils.filterJSONByLevel(App.NodeData, 0);
            var headerNode = new App.Models.Node(headerData[0]);

            App.headerView = new App.Views.HeaderView({ model: headerNode });
            App.shellView.headerPanel.show(App.headerView, { changeHash: false });

            //get the home content node now
            var data = App.Utils.filterJSONByName(App.NodeData, 'home');
            var node = new App.Models.Node(data[0]);

            App.Core.DataService.getJSONFromFile(data[0].ID).done(
                function (data) {
                    var node = data;
                    node = new App.Models.Node(node[0]);

                    var contents = new App.Models.Contents(data);
                    App.contentsView = new App.Views.ContentsView({ model: node, collection: contents });

                    //show the content panel
                    App.shellView.contentPanel.show(App.contentsView, { changeHash: false });

                    //show the navigation panel if the filter bar is NOT being used
                    App.pressRouter.navigate("menu", { trigger: true });
                }
            ).fail(
                function (error) {
                    throw new Error('App.Core.DataService.getJSONFromFile failed to fetch the home node data.');
                }
            );
        /*}*/
    },
  
    tocmenu: function () {
        if (!App.shellView.menuPanel.hasView()) {
            App.menuPanelView = new App.Views.MenuPanelView();
        }
        App.shellView.menuPanel.show(App.menuPanelView, { forceShow: true });

        if (!App.menuPanelView.menuSearchPanel.hasView()) {
            App.menuSearchView = new App.Views.MenuSearchView();
        }
        App.menuPanelView.menuSearchPanel.show(App.menuSearchView, { forceShow: true });

        if (!App.menuPanelView.menuContentListPanel.hasView()) {
            var nodes = new App.Models.Nodes(App.Utils.filterJSONByLevel(App.NodeData, 1));
            App.nodesView = new App.Views.NodesView({ collection: nodes });
        }
        App.menuPanelView.menuContentListPanel.show(App.nodesView, { forceShow: true });

        App.Utils.ToggleSearchbox('menu');

        //update the footer panel if required
        if (App.Config.footerShowFilterBar) {
            App.pressRouter.navigate("pagefooter", { trigger: true });
        }
    },

    pagefooter: function () {
        if (!App.shellView.footerPanel.hasView()) {
            var nodes = new App.Models.Nodes(App.Utils.filterJSONByLevel(App.NodeData, App.Config.footerFilterLevel));
            App.footerView = new App.Views.FooterView({ collection: nodes });

            App.shellView.footerPanel.show(App.footerView, { changeHash: false });
        }
    },
    
    content: function (id) {        
        App.Core.DataService.getJSONFromFile(id).done(
            function (data) {
                var node = App.Utils.filterJSONByID(App.NodeData, id);
                node = new App.Models.Node(node[0]);

                var contents = new App.Models.Contents(data);
                App.contentsView = new App.Views.ContentsView({ model: node, collection: contents });

                App.shellView.contentPanel.show(App.contentsView, { changeHash: false });                                
            }
        ).fail(
            function (msg) {
                throw new Error('App.Core.DataService.getJSONFromFile failed to fetch the content node data.');
            }
        );    
    },

    contentfile: function (id) {
        var node = App.Utils.filterJSONByID(App.NodeData, id);
        node = new App.Models.Node(node[0]);

        App.contentFileView = new App.Views.ContentFileView({ model: node });

        App.shellView.contentPanel.show(App.contentFileView, { forceShow: true, changeHash: false });

        //if the toc is open...
        if ($("#nav-panel").hasClass("ui-panel-open") === true) {
            //if settings allow for hidden toc
            if (App.Config.menuForceShowToc === false) {
                //if in portrait view
                if ($(window).width() < $(window).height()) {
                    //portrait view
                    $('#nav-panel').panel('close');
                }
            }
        }

        App.pressRouter.navigate("reference?" + id, { trigger: true });
    },

    reference: function(nodeID) {
        if (!App.shellView.referencePanel.hasView()) {
            App.ReferencePanelView = new App.Views.ReferenceView();
        }

        //now get a collection all the children of this node
        App.Core.DataService.getJSONFromFile(nodeID + '.json').done(
            function (jqXHR, textStatus) {
                var nodes = new App.Models.Nodes(jqXHR);

                //strip out the first pdf - it is a link to itself
                nodes.remove(nodes.getByMediaExt("pdf"));

                //create the reference panel
                App.referenceView = new App.Views.ReferenceView({ collection: nodes });
                App.shellView.referencePanel.show(App.referenceView, { changeHash: false });

                //show the reference panel if it is closed
                if (!$("#reference-panel").hasClass("ui-panel-open")) {
                    $("#reference-panel").panel("open");
                }
            }
        ).fail(
            function (error) {
                throw error;
            }
        );
    },
    
    index: function () {
        if (!App.shellView.menuPanel.hasView()) {
            App.menuPanelView = new App.Views.MenuPanelView();
        }
        App.shellView.menuPanel.show(App.menuPanelView, {forceShow: true});
        
        if(!App.menuPanelView.menuSearchPanel.hasView()) {
            App.menuSearchView = new App.Views.MenuSearchView();
        }
        App.menuPanelView.menuSearchPanel.show(App.menuSearchView, {forceShow: true});
        
        var index = new App.Models.Index();
        App.indexView = new App.Views.IndexView({ collection: index});
        App.menuPanelView.menuIndexListPanel.show(App.indexView, {forceShow: true});
        
        $('#nav-panel').panel('open');
        
        App.Utils.ToggleSearchbox('index');
    },
    
    bookmarkform: function(id) { 
        var data = App.Utils.filterJSONByID(App.NodeData, id);
        var node = new App.Models.Node(data[0]);
        App.bookmarkFormView = new App.Views.BookmarkFormView({ model: node });
        
        //update the content panel
        App.shellView.contentPanel.show(App.bookmarkFormView, {changeHash: false});

        if ($(window).width() < $(window).height() && $(window.width < 701)) {
            $('#nav-panel').panel('close');
        }
    },
    
    bookmarks: function() {
        if (!App.shellView.menuPanel.hasView()) {
            App.menuPanelView = new App.Views.MenuPanelView();
        }
        App.shellView.menuPanel.show(App.menuPanelView, {forceShow: true});
        
        if(!App.menuPanelView.menuSearchPanel.hasView()) {
            App.menuSearchView = new App.Views.MenuSearchView();
        }
        App.menuPanelView.menuSearchPanel.show(App.menuSearchView, {forceShow: true});
        
        var data = $.parseJSON("[" + App.Utils.getStorageList('mdl.content.bookmarks') + "]");
        var bookmarks = new App.Models.Bookmarks(data);
        App.bookmarksView = new App.Views.BookmarksView({ collection: bookmarks });
        App.menuPanelView.menuBookmarkListPanel.show(App.bookmarksView);
        
        $('#nav-panel').panel('open');
        
        App.Utils.ToggleSearchbox('bookmarks');
    },
    
    settings: function() {
        App.settingsView = new App.Views.SettingsView();
        App.shellView.contentPanel.show(App.settingsView);
    },
    
    register: function () {
        //alert("register route");
        //var modal = new ModalRegion();
        //App.registerView = new App.Views.RegisterView( {changeHash: true});
        //modal.show(App.registerView);
        /*
        //change the header
        App.headerRegisterView = new App.Views.HeaderRegisterView();
        App.shellView.headerPanel.show(App.headerRegisterView);
        */
        //show the register form
        //App.registerView = new App.Views.RegisterView();
        //App.press.modalRegion.show(App.registerView);
    },
    
    triage1 : function() {
        App.triage1View = new App.Views.Triage1View();
        App.shellView.contentPanel.show(App.triage1View, {changeHash: true});
        $('#nav-panel').panel('close');
    },
    
    triage2: function() {
        App.triage2View = new App.Views.Triage2View();
        App.shellView.contentPanel.show(App.triage2View, {changeHash: true});
        $('#nav-panel').panel('close');
    },
    
    triage3: function() {
        App.triage3View = new App.Views.Triage3View();
        App.shellView.contentPanel.show(App.triage3View, {changeHash: true});
        $('#nav-panel').panel('close');
    },
    
    triage4: function() {
        App.triage4View = new App.Views.Triage4View();
        App.shellView.contentPanel.show(App.triage4View, {changeHash: true});
        $('#nav-panel').panel('close');
    },
    
    triageoutcome: function(qstring) {
        var params = App.Utils.ParseQueryString(qstring);
        
        var triageModel = App.Utils.GetTriageOutcome(params.outcome, params.score, params.syndrome);
        App.triageOutcomeView = new App.Views.TriageOutcomeView( {model: triageModel} );
        App.shellView.contentPanel.show(App.triageOutcomeView, {changeHash: true});        
        $('#nav-panel').panel('close');
    },
    
    triagepatient: function() {
        App.triagePatientView = new App.Views.TriagePatientView();
        App.shellView.contentPanel.show(App.triagePatientView, {changeHash: true});        
        $('#nav-panel').panel('close');
    },
    
    triageprint: function() {
        App.triagePrintView = new App.Views.TriagePrintView();
        App.shellView.contentPanel.show(App.triagePrintView, {changeHash: true});        
        $('#nav-panel').panel('close');
    },
    
    newsfeeds: function() {
        App.Core.DataService.getJSONFromLocalFile('news').done(function(data) {
            var newsfeeds = new App.Models.Newsfeeds(data);
            
            App.newsfeedsView = new App.Views.NewsfeedsView({ collection: newsfeeds });
            App.shellView.contentPanel.show(App.newsfeedsView);
        });
    },
    
    newsfeed : function(index) {
        App.Core.DataService.getJSONFromLocalFile('news').done(function(data) {
            var newsfeed = new App.Models.Newsfeed(data[index]);
            
            App.newsfeedView = new App.Views.NewsfeedView({ model: newsfeed });
            App.shellView.contentPanel.show(App.newsfeedView, {changeHash: true});
            $('#nav-panel').panel('close');
        });
    },

    error: function (err) {
        var msg;

        if (App.shellView) {
            try {
                App.errorView = new App.Views.ErrorView();
                App.shellView.errorPanel.show(App.errorView);
            } catch (e) {
                msg = err.message || JSON.stringify(err);
                if (window.confirm(msg)) {
                    location.reload();
                } else {
                    navigator.app.exitApp();
                }
            }
        } else {
            msg = err.message || JSON.stringify(err);
            if (window.confirm(msg)) {
                location.reload();
            } else {
                //this only workjs for android
                //ios does not allow auto exit from apps (unless via objective C)
                navigator.app.exitApp();
            }
        }
    },
	
	webview : function() {
        alert("webview reached");
	},

	resetRegions: function () {
        try {
            App.shellView.getRegion("menuPanel")._ensureElement();
        } catch (e) {
            //App.shellView.addRegion({ regionClass: App.Core.MenuRegion });
            App.shellView.addRegions({
                menuPanel: new App.Core.MenuRegion()
            });
        }

        try {
            App.shellView.getRegion("referencePanel")._ensureElement();
        } catch (e) {
            App.shellView.addRegions({
                referencePanel: new App.Core.ReferenceRegion()
            });
        }

        try {
            App.shellView.getRegion("footerPanel")._ensureElement();
        } catch (e) {
            App.shellView.addRegions({
                footerPanel: new App.Core.FooterRegion()
            });
        }
    }
});