//******************************************************************************
//Provides search functionality for the toc list
//******************************************************************************
App.Views.MenuSearchView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
        //$('#index-autocomplete-input').attr( { placeholder:'Table of Contents', disabled: 'disabled'} )
    },
    
    events: {
        //'click #searchOptionsPop ul li' : 'showType'
        'click #toggleSearchBtn' : 'toggleSearch'
    },
    
    onRender: function() {
        this.$el.collapsibleset();
        this.$el.enhanceWithin();
        
        this.$el.find('#index-autocomplete-input').attr( { placeholder:'Table of Contents', disabled: 'disabled'} );
    },
    
    showType: function(e) {  
        //prevent default href behaviour and stop event bubbling up through node views
        e.preventDefault(); 
        e.stopPropagation();
        
        switch($(e.currentTarget).val()) {
            case 'toc':
                App.pressRouter.navigate("#menu", {trigger: true});
                break;
            case 'index':
                App.pressRouter.navigate("#index", {trigger: true});
                break
            case 'bookmarks':
                App.pressRouter.navigate("#bookmarks", {trigger: true});
                break;
            default:
                //alert('nothing selected');
        }
    },
    
    toggleSearch: function(e) { 
        if ($(e.currentTarget).hasClass('ui-icon-search')) {
            App.pressRouter.navigate("#index", {trigger: true});
        } else {
            App.pressRouter.navigate("#menu", { trigger: true });
        }
    } 
});



