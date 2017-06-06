//******************************************************************************
//Each index item from the json file is a Node model with default values.
//******************************************************************************

App.Models.IndexNode = Backbone.Model.extend({
    //When initialising nodes, defaults will be used where no data exists
    defaults: {
        file: '',
        header: 'Unspecified',
        subheader1: 'Unspecified',
        type: '??'
    },
    initialize: function () {
        //when a model changes, it will re-render itself
        this.on('change', this.render, this);
    }
});