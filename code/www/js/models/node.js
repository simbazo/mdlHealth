//******************************************************************************
//Each index item from the json file is a IndexNode model with default values.
//******************************************************************************

App.Models.Node = Backbone.Model.extend({
    //When initialising nodes, defaults will be used where no data exists
    defaults: {
        ID: '',
        Parent_ID: '',
        Header: 'Unspecified',
        Level_ID: '',
        Prev: -1,
        Next: -1,
        Indexing: null,
        SubHeader: null
    },
    initialize: function () {
        this.on('change', this.render, this);
    }
});