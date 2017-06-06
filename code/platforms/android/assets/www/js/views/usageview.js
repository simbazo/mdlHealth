App.Views.UsageView = Backbone.Marionette.LayoutView.extend({
    template: this.template,
    
    initialize: function() {        
    },
    
    onRender: function() {
        this.$el.collapsibleset();
        this.$el.enhanceWithin();
    },
    
    onShow: function() {
        // Set a callback to run when the Google Visualization API is loaded.
        google.setOnLoadCallback(this.drawChart());
    },
    
    drawChart: function () {
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Status');
        data.addColumn('number', 'Total');
        data.addRows([
          ['Opened', 23],
          ['Unopened', 78]
        ]);

        // Set chart options
        var options = {'title':'Number of topics browsed',
                       'legend':'right',
                       'is3D': true,
                       'width': 400,
                       'height': 300,
                       'colors': ['#FF6600', '#336699'],};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart'));
        chart.draw(data, options);
    }
});
