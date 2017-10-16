//******************************************************************************
//This is the 'master' view that wraps the content models in the collection.
//******************************************************************************

App.Views.ContentsView = Backbone.Marionette.CompositeView.extend({
    template: this.template,
    childViewOptions: {
        parentModel: this.model
    },
    childView: App.Views.ContentView,
    childViewContainer: 'p',    
    
    initialize: function(options) {
    },
    
    onRender: function () {
        //always move content to the top of the page
        window.scrollTo(0, 0);
        
        //open the first collapsible
        var group = '<div class="ui-corner-all custom-corners">';
        group += '<div class="ui-bar ui-bar-b">';
        group += '<h3>' + this.collection.first().attributes.Header + '</h3>';
        group += '</div>';
        group += '<div class="ui-body ui-body-a">';
        group += '<p>' + App.Utils.FixContentFormat(this.collection.first().attributes.Content) + '</p>';
        group += '</div>';
        group += '</div>';        
        this.$el.find('.ui-collapsible').eq(0).replaceWith(group);
        
        //adds opacity to callapsible sections which changes it's colour to differentiate it from the main heading on top 
        this.$el.find('h4.ui-collapsible-heading').each(function() {
            $(this).css({
                'opacity': '0.5', 
                'background-color': '#373737'
            });
        });
        
        this.buildTableContainer(function() {
            $('content-panel .panzoom').each(function(i) {
                $(this).panzoom();
            });
        });
        
        //inject the hometopic class to allow client.css to target home node for rich formatting
        if (this.collection.models[0].attributes.Header.toLowerCase() === 'home') {
            this.$el.find('.ui-body:eq(0)').addClass('hometopic');
        }
    },

    events: {
        "click #nextButton": "nextContent",
        "click #prevButton": "prevContent",
        "click #bookmarkButton": "bookmarkContent",
        "click .content": "preventCollapse"
    },
    
    nextContent: function(e) {
        var nextID = $('#txtNextNodeID').val();
        App.pressRouter.navigate("#content?" + nextID, {trigger: true});
    },
    
    prevContent: function(e) {
        var prevID = $(e.currentTarget).data('prev');
        App.pressRouter.navigate("#content?" + prevID, {trigger: true});
    },
    
    bookmarkContent: function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        App.Utils.RecordBookmark();
    },
    
    preventCollapse: function(e) {
        //alert("dont' collapse!");
    },
    
    buildTableContainer: function() {
        var struct = $("<div>").addClass("parent").append(
                        $("<div>").addClass("panzoom"));       
        
        this.$el.find('table').each(function(i) {
            $(this).attr('data-elem', 'pinchzoomer');
            $(this).wrap(struct);
        });
    },
    
    buildTableZoomer: function() {
        
    },
    
    postpone: function(call) {
        window.setTimeout(call, 0);
    }
});

