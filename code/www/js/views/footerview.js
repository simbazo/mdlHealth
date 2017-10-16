App.Views.FooterView = Backbone.Marionette.CompositeView.extend({
    template: this.template,
    childView: App.Views.FooterItemView,
    childViewContainer: "ul",

    initialize: function (options) {
    },

    events: {
        'click li': 'showSubMenu'
    },
    
    onRender: function () {
        //this.$el.enhanceWithin();

        //Need to get rid of the wrapper <div> for JQM 
        this.$el = this.$el.children();

        //Unwrap the element to prevent infinitely nesting elements during re-render.
        this.$el.unwrap();

        this.setElement(this.$el);
    },

    showSubMenu: function (e) {
        var id = $(e.currentTarget).find('a').data("id");
        var color = $(e.currentTarget).css('background-color');

        //remove any active state on siblings
        $(e.currentTarget).siblings().removeAttr("style");

        //add active state to the clicked element
        $(e.currentTarget).css('background-color', '#3388cc');

        App.pressRouter.navigate("#menu", { trigger: true });

        //open the nav panel
        if ($(".ui-panel").hasClass("ui-panel-closed") === true) {
            $('#nav-panel').panel('open');
        }
    }

});