//******************************************************************************
//Each model view wraps a <a> with <li> from the #nodeTemplate on the page.
//******************************************************************************
App.Views.TocView = Backbone.Marionette.ItemView.extend({
    tagName: "li",
    template: this.template
});

