App.Views.Triage1View = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
    },
    
    events: {
        "click a": "showPopup",
        "click button": "showNext"
    },
    
    onBeforeRender: function () {
        $(document).find('#content-panel').css('background-color', '#fff')
        this.$el.find('.ui-body').css('background-color', '#fff')
    },
    
    onRender: function() {
        this.$el.enhanceWithin();
        
        //always move to the top of the page
        window.scrollTo(0, 0);
    },
    
    showPopup: function(e) {
        e.preventDefault();
        
        //change the h1 of the popup to the label of the radio button
        $('#globalPopup').find('h1').text($(e.currentTarget).parent().find('label:first').text());
        
        //center the popup relative to the device's viwport
        $('#globaPopup').popup( "option", "data-position-to", "window" );
        
        //open the popup
        $('#globalPopup').popup("open");
    },
    
    showNext: function(e) {
        e.preventDefault();
        
        if ($("input:radio[name='radio-choice-1']:checked").val() < 10) {
            App.pressRouter.navigate("#triage2", {trigger: true});
        } else {
            App.pressRouter.navigate("#triageoutcome?outcome=red&score=-1&syndrome=" + $("input:radio[name='radio-choice-1']:checked").parent().find('label:first').text(), {trigger: true});
        }
    }
});

