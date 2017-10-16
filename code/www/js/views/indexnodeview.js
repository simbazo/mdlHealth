//******************************************************************************
//Each model view wraps a <a> with <li> from the #indexNodeTemplate on the page.
//******************************************************************************
App.Views.IndexNodeView = Backbone.Marionette.ItemView.extend({
    tagName: "li",
    template: this.template
});

