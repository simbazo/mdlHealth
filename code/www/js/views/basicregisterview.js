//******************************************************************************
//Each model view generates a header and content section on the page.
//******************************************************************************

App.Views.BasicRegisterView = Backbone.Marionette.ItemView.extend({
    template: this.template,
    
    initialize: function(options) {    	
    },

    events: {
    },

    onRender: function() {
    	this.$el.find('#app_id').val(App.Config.applicationKey);
        this.$el.find('#device_id').val(App.Config.device);    	
    },

    onShow: function() {
    	// Date of birth datepicker
		var date = new Date();
		var picker = new Pikaday({ 
			field: $('#dob')[0],
			format: 'YYYY-MM-DD',
			defaultDate: new Date(date.getFullYear() - 40, date.getMonth(), date.getDate())
		});
    },
});

