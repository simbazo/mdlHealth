//******************************************************************************
//Each model view wraps a <a> with <li> from the #nodeTemplate on the page.
//******************************************************************************
App.Views.NodeView = Backbone.Marionette.ItemView.extend({
    tagName: "li",
    template: this.template,
    
    onRender: function() {
        this.$el.closest('li').attr('id', this.model.attributes.ID)
                              .attr('href', this.model.attributes.ID)
                              .attr('pid', this.model.attributes.Parent_ID)
                              .attr('class', 'menu-block-' + this.model.attributes.Level_ID)
                              .attr('levelID', this.model.attributes.Level_ID);
                      
        //this.$el.closest('ul').attr('class', 'menu-area-' + this.model.attributes.ID)
    }
});

