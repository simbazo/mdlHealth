App.Views.Triage4View = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {
        //console.log('testing triage home page');
    },
    
    events: {
        "click a": "showPopup",
        "click button": "showNext"
    },
    
    onRender: function () {
        this.$el.enhanceWithin();
        
        //always move to the top of the page
        window.scrollTo(0, 0);
    },
    
    showPopup: function(e) {
        e.preventDefault();
        
        //change the h1 of the popup to the label of the radio button
        $('#globalPopup').find('h1').text($(e.currentTarget).closest('fieldset').find('legend').text());
        
        //center the popup relative to the device's viwport
        $('#globaPopup').popup( "option", "data-position-to", "window" );
        
        //open the popup
        $('#globalPopup').popup("open");
    },
    
    showNext: function(e) {
        e.preventDefault();
        
        var score = 0;
        score += parseInt($("input:radio[name='radio-mobility-h-2']:checked").val());
        score += parseInt($("input:radio[name='radio-rr-h-2']:checked").val());
        score += parseInt($("input:radio[name='radio-hr-h-2']:checked").val());
        score += parseInt($("input:radio[name='radio-sbp-h-2']:checked").val());
        score += parseInt($("input:radio[name='radio-tmp-h-2']:checked").val());
        score += parseInt($("input:radio[name='radio-avpu-h-2']:checked").val());
        score += parseInt($("input:radio[name='radio-avpu-h-2']:checked").val());
        score += parseInt($("input:radio[name='radio-trauma-h-2']:checked").val());
        
        if (score < 3) { 
            App.pressRouter.navigate("#triageoutcome?outcome=green&score="+score+"&syndrome=", {trigger: true});
            return;
            //App.defaultRouter.navigate("triageoutcome/green", {trigger: true}); 
        }
        if (score < 5) { 
            App.pressRouter.navigate("#triageoutcome?outcome=yellow&score="+score+"&syndrome=", {trigger: true});
            return;
            //App.defaultRouter.navigate("triageoutcome/yellow", {trigger: true}); 
        }
        if (score < 7) { 
            App.pressRouter.navigate("#triageoutcome?outcome=orange&score="+score+"&syndrome=", {trigger: true});
            //App.defaultRouter.navigate("triageoutcome/orange"}, {trigger: true}); 
        } else {
            App.pressRouter.navigate("#triageoutcome?outcome=red&score="+score+"&syndrome=", {trigger: true});
        }
    }
});

