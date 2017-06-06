//Create a core Region for the Application. The region will be attached to the
//application instance and will be used to bind a site-wide template to the body 
//element (el) of the page.
App.Core.MainRegion = Marionette.Region.extend({
    el: 'body',

    attachHtml: function (view) {
        view.$el.children().clone(true, true).appendTo(this.$el.empty());
    }
});

App.Core.ShellRegion = Marionette.Region.extend({
    el: 'body',
    
    attachHtml: function(view) {
        view.$el.children().clone(true, true).appendTo(this.$el.empty());
    }
});

App.Core.MenuRegion = Marionette.Region.extend({
    el: '#nav-panel',
    
    initialize: function(view) {
    }
});

App.Core.MenuSearchRegion = Marionette.Region.extend({
    el: '#menu-search-panel',
    
    initialize: function(view) {
    }
});

App.Core.MenuContentListRegion = Marionette.Region.extend({
    el: '#menu-contentlist-panel',
    
    initialize: function(view) {
    }
});

App.Core.MenuIndexListRegion = Marionette.Region.extend({
    el: '#menu-indexlist-panel',
    
    initialize: function(view) {
    }
});

App.Core.MenuBookmarkListRegion = Marionette.Region.extend({
    el: '#menu-bookmarklist-panel',
    
    initialize: function(view) {
    }
});

/*App.Core.MenuListRegion = Marionette.Region.extend({
    el: '#menu-list-panel',
    
    initialize: function(view) {
    }
});*/

App.Core.ContentRegion = Marionette.Region.extend({
    el: '#content-panel',

    initialize: function (view) {
    }
});

App.Core.ContentLayoutRegion = Marionette.Region.extend({
    el: '#contentlayout-panel',

    initialize: function (view) {
    }
});

App.Core.ContentRegion = Marionette.Region.extend({
    el: '#content-panel',
    
    initialize: function(view) {
    }
});

App.Core.HeaderRegion = Marionette.Region.extend({
    el: '#header-panel',

    initialize: function (view) {
    }
});

App.Core.MessageRegion = Marionette.Region.extend({
    el: '#message-panel',
    
    initialize: function(view) {
    }
});

App.Core.ErrorRegion = Marionette.Region.extend({
    el: '#error-panel',

    initialize: function (view) {
    }
});

App.Core.RegisterRegion = Marionette.Region.extend({
    el: '#register-panel',
    
    initialize: function(view) {
    }
});

App.Core.WebViewRegion = Marionette.Region.extend({
    el: '#webview-panel',

    initialize: function (view) {
    }
});

App.Core.WebListRegion = Marionette.Region.extend({
    el: '#weblist-panel',
    
    initialize: function(view) {
    }
});

App.Core.WebContentRegion = Marionette.Region.extend({
    el: '#webcontent-panel',
    
    initialize: function(view) {
    }
});

App.Core.SettingsRegion = Marionette.Region.extend({
    el: '#settings-panel',
    
    initialize: function(view) {
    }
});

var ModalRegion = Marionette.Region.extend({
    constructor: function() {
        Marionette.Region.prototype.constructor.apply(this, arguments);
 
        this._ensureElement();
        this.$el.on('hidden', {region:this}, function(event) {
            event.data.region.close();
        });
    },
 
    onShow: function() {
        this.$el.enhanceWithin();
        this.$el.popup('open');
        this.$el.popup("reposition", {positionTo: 'origin'});
    },
 
    onClose: function() {
        this.$el.popup('close');
    }
});