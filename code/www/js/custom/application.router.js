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
        "menu" : "tocmenu",
        "index" : "index",
        "bookmarks" : "bookmarks",
        "bookmarkform?:id" : "bookmarkform",
        "content?:id": "content",
        "contentfile?:model": "contentfile",
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
        "error?:err": "error"
    },
    
    initialize: function () {
    },
    
    home: function () {
        alert("home view");
        //first show the header view
        var headerData = App.Utils.filterJSONByLevel(App.NodeData, 0);        
        var headerNode = new App.Models.Node(headerData[0]);

        App.headerView = new App.Views.HeaderView({ model: headerNode });
        App.shellLayoutView.headerPanel.show(App.headerView, { changeHash: false });

        //show the home content node now
        var data = App.Utils.filterJSONByName(App.NodeData, 'home');
        var node = new App.Models.Node(data[0]);

        App.Core.DataService.getJSONFromFile(data[0].ID).done(
            function (data) {
                var node = data;
                node = new App.Models.Node(node[0]);

                var contents = new App.Models.Contents(data);
                App.contentsView = new App.Views.ContentsView({ model: node, collection: contents });

                //update the content panel
                App.shellLayoutView.contentPanel.show(App.contentsView, { changeHash: false });

                App.pressRouter.navigate("menu", { trigger: true });
            }
        ).fail(
            function (error) {
                throw new Error('App.Core.DataService.getJSONFromFile failed to fetch the home node data.');
            }
        );
        
    },
  
    tocmenu : function() {
        if (!App.shellLayoutView.menuPanel.hasView()) {
            App.menuPanelView = new App.Views.MenuPanelView();
        }
        App.shellLayoutView.menuPanel.show(App.menuPanelView, {forceShow: true});
        
        if(!App.menuPanelView.menuSearchPanel.hasView()) {
            App.menuSearchView = new App.Views.MenuSearchView();
        }
        App.menuPanelView.menuSearchPanel.show(App.menuSearchView, {forceShow: true});
        
        if (!App.menuPanelView.menuContentListPanel.hasView()) {
            var nodes = new App.Models.Nodes(App.Utils.filterJSONByLevel(App.NodeData, 1));
            App.nodesView = new App.Views.NodesView({ collection: nodes});
        }
        App.menuPanelView.menuContentListPanel.show(App.nodesView, {forceShow: true});
        
        App.Utils.ToggleSearchbox('menu');
    },
    
    content: function (id) {
        if (id == '9758') {
            App.pressRouter.navigate("#triage1", {trigger: true});
        } else {        
            App.Core.DataService.getJSONFromFile(id).done(
                function(data) {
                    //just check if we have an active contentview in the background
                    if (!App.shellLayoutView.contentLayoutPanel.hasView()) {
                        var node = App.Utils.filterJSONByID(App.NodeData, id);
                        node = new App.Models.Node(node[0]);

                        var contents = new App.Models.Contents(data);
                        App.contentsView = new App.Views.ContentsView({ model: node, collection: contents });
                    }

                    // App.shellLayoutView.contentPanel.show(App.contentsView, {changeHash: false});
                   // App.shellLayoutView.contentLayoutPanel.show(App.contentsView, { changeHash: false });
                    //App.contentsView.contentLayout.show(App.contentsView, { changeHash: false });

                    if ($(window).width() > $(window).height() && $(window).width() < 701) {
                        $('#nav-panel').panel('close');
                    } else {
                        if ($(window).width() < $(window).height()) {
                            $('#nav-panel').panel('close');
                        }
                    }
                }
            ).fail(
                function(msg) {
                    throw new Error('App.Core.DataService.getJSONFromFile failed to fetch the content node data.');
                }
            );
        }
    },

    contentfile: function (model) {
        var node = new App.Models.Node(JSON.parse(model));

        if (!App.shellLayoutView.contentPanel.hasView()) {
            App.contentFileView = new App.Views.ContentFileView({ model: node });
        }
        return

        App.contentFileView = new App.Views.ContentFileView({ model: node });
        App.shellLayoutView.contentPanel.show(App.contentFileView, { changeHash: false });

        $('#nav-panel').panel('close');
    },
    
    index: function () {
        if (!App.shellLayoutView.menuPanel.hasView()) {
            App.menuPanelView = new App.Views.MenuPanelView();
        }
        App.shellLayoutView.menuPanel.show(App.menuPanelView, {forceShow: true});
        
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
        App.shellLayoutView.contentPanel.show(App.bookmarkFormView, {changeHash: false});

        if ($(window).width() < $(window).height() && $(window.width < 701)) {
            $('#nav-panel').panel('close');
        }
    },
    
    bookmarks: function() {
        if (!App.shellLayoutView.menuPanel.hasView()) {
            App.menuPanelView = new App.Views.MenuPanelView();
        }
        App.shellLayoutView.menuPanel.show(App.menuPanelView, {forceShow: true});
        
        if(!App.menuPanelView.menuSearchPanel.hasView()) {
            App.menuSearchView = new App.Views.MenuSearchView();
        }
        App.menuPanelView.menuSearchPanel.show(App.menuSearchView, {forceShow: true});
        
        var data = $.parseJSON("[" + getStorageList('appenberg.content.bookmarks') + "]");
        var bookmarks = new App.Models.Bookmarks(data);
        App.bookmarksView = new App.Views.BookmarksView({ collection: bookmarks });
        App.menuPanelView.menuBookmarkListPanel.show(App.bookmarksView);
        
        $('#nav-panel').panel('open');
        
        App.Utils.ToggleSearchbox('bookmarks');
    },
    
    settings: function() {
        var modal = new ModalRegion({el:'#settings-panel'});
        App.settingsView = new App.Views.SettingsView();
        modal.show(App.settingsView);
    },
    
    register: function() {        
        //Transit to the register page
        $.mobile.changePage('#panel-responsive-page2', {
            allowSamePageTransition: true,
            changeHash: false
        });
    },
    
    triage1 : function() {
        App.triage1View = new App.Views.Triage1View();
        App.shellLayoutView.contentPanel.show(App.triage1View, {changeHash: true});
        $('#nav-panel').panel('close');
    },
    
    triage2: function() {
        App.triage2View = new App.Views.Triage2View();
        App.shellLayoutView.contentPanel.show(App.triage2View, {changeHash: true});
        $('#nav-panel').panel('close');
    },
    
    triage3: function() {
        App.triage3View = new App.Views.Triage3View();
        App.shellLayoutView.contentPanel.show(App.triage3View, {changeHash: true});
        $('#nav-panel').panel('close');
    },
    
    triage4: function() {
        App.triage4View = new App.Views.Triage4View();
        App.shellLayoutView.contentPanel.show(App.triage4View, {changeHash: true});
        $('#nav-panel').panel('close');
    },
    
    triageoutcome: function(qstring) {
        var params = App.Utils.ParseQueryString(qstring);
        
        var triageModel = App.Utils.GetTriageOutcome(params.outcome, params.score, params.syndrome);
        App.triageOutcomeView = new App.Views.TriageOutcomeView( {model: triageModel} );
        App.shellLayoutView.contentPanel.show(App.triageOutcomeView, {changeHash: true});        
        $('#nav-panel').panel('close');
    },
    
    triagepatient: function() {
        App.triagePatientView = new App.Views.TriagePatientView();
        App.shellLayoutView.contentPanel.show(App.triagePatientView, {changeHash: true});        
        $('#nav-panel').panel('close');
    },
    
    triageprint: function() {
        App.triagePrintView = new App.Views.TriagePrintView();
        App.shellLayoutView.contentPanel.show(App.triagePrintView, {changeHash: true});        
        $('#nav-panel').panel('close');
    },
    
    newsfeeds: function() {
        App.Core.DataService.getJSONFromLocalFile('news').done(function(data) {
            var newsfeeds = new App.Models.Newsfeeds(data);
            
            App.newsfeedsView = new App.Views.NewsfeedsView({ collection: newsfeeds });
            App.shellLayoutView.contentPanel.show(App.newsfeedsView);
        });
    },
    
    newsfeed : function(index) {
        App.Core.DataService.getJSONFromLocalFile('news').done(function(data) {
            var newsfeed = new App.Models.Newsfeed(data[index]);
            
            App.newsfeedView = new App.Views.NewsfeedView({ model: newsfeed });
            App.shellLayoutView.contentPanel.show(App.newsfeedView, {changeHash: true});
            $('#nav-panel').panel('close');
        });
    },

    error: function (err) {
        if (App.shellLayoutView) {
            try {
                App.errorView = new App.Views.ErrorView();
                App.shellLayoutView.errorPanel.show(App.errorView);
            } catch (e) {
                var msg = err.message || JSON.stringify(err);
                if (window.confirm(msg)) {
                    location.reload();
                } else {
                    navigator.app.exitApp();
                }
            }
        } else {
            var msg = err.message || JSON.stringify(err);
            if (window.confirm(msg)) {
                location.reload();
            } else {
                //this only workjs for android
                //ios does not allow auto exit from apps (unless via objective C)
                navigator.app.exitApp();
            }
        };
    }
});

App.Core.RegisterRouter = Backbone.Marionette.AppRouter.extend({
    //standard routes bind to this router's internal methods
    routes: {
        "": "register",
        "home": "home",
        "menu": "tocmenu",
        "index": "index",
        "bookmarks": "bookmarks",
        "bookmarkform?:id": "bookmarkform",
        "content?:id": "content",
        "contentfile?:model": "contentfile",
        "search?:term": "search",
        "settings": "settings",
        "register": "register",
        "triage1": "triage1",
        "triage2": "triage2",
        "triage3": "triage3",
        "triage4": "triage4",
        "triageoutcome?:qstring": "triageoutcome",
        "triagepatient": "triagepatient",
        "triageprint": "triageprint",
        "newsfeeds": "newsfeeds",
        "newsfeed?:index": "newsfeed",
        "error?:err": "error"
    },

    initialize: function () {
    },

    register: function () {
        //Instantiate the register view
        App.registerView = new App.Views.RegisterView();

        //Show the register view
        App.press.mainRegion.show(App.registerView);
    }
});