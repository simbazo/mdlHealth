//Create a core Region for the Application. The region will be attached to the
//application instance and will be used to bind a site-wide template to the body 
//element (el) of the page.
App.Core.ShellRegion = Marionette.Region.extend({
    el: 'body',
    
    attachHtml: function(view) {
        view.$el.children().clone(true, true).appendTo(this.$el.empty());
    }
});

App.Core.MainRegion = Marionette.Region.extend({
    el: 'body',

    attachHtml: function (view) {
        view.$el.children().clone(true, true).appendTo(this.$el.empty());
    }
});

App.Core.ModalRegion = Marionette.Region.extend({
    el: "#modal-panel",

    constructor: function () {
        _.bindAll(this, "getEl", "showModal", "hideModal");
        Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
        this.on("show", this.showModal, this);
    },

    getEl: function (selector) {
        var $el = $(selector);
        $el.on("hidden", this.close);
        return $el;
    },

    showModal: function (view) {
        var parent = this;
        view.on("close", this.hideModal, this);
        var popup = setInterval(function () {
            parent.$el.popup({
                beforeposition: function (event, ui) {
                    var popupWidth = parseInt(window.innerWidth - (window.innerWidth / 10));
                    var popupHeight = parseInt(window.innerHeight - (window.innerHeight /10));
                    parent.$el.css({ "height": popupHeight, "width": popupWidth });
                }
            });
            parent.$el.popup("open");
            clearInterval(popup);
        }, 1);        
    },

    hideModal: function () {
        this.$el.popup('close');
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
    
    initialize: function(view) {
    }
});

App.Core.HeaderRegion = Marionette.Region.extend({
    el: '#header-panel',

    initialize: function (view) {
    }
});

App.Core.FooterRegion = Marionette.Region.extend({
    el: '#footer-panel',

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

App.Core.ReferenceRegion = Marionette.Region.extend({
    el: '#reference-panel',

    initialize: function (view) {
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