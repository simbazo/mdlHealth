//******************************************************************************
//Each source json file is a Content model with blank default values.
//******************************************************************************
App.Models.Content = Backbone.Model.extend({
    //When initialising nodes, blank defaults will be used where no data exists
    defaults: {
        ID: -1,
        Parent_ID: -1, 
        Level_ID: -1,
        Header: 'Unspecified',
        Content: ''
    },
    
    initialize: function () {
        //when a model changes, it will re-render itself
        this.on('change', this.render, this);
    }
});