App.Models.ContentFile = Backbone.Model.extend({
    //When initialising nodes, blank defaults will be used where no data exists
    defaults: {
        NodeID: -1,
    },

    initialize: function () {
        //when a model changes, it will re-render itself
        this.on('change', this.render, this);
    }
});