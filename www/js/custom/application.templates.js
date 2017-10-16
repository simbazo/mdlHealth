App.Core.Templates = (function() {
    var load = function(views, callback) {
        var deferreds = [];

        $.each(views, function(index, view) {
            if (App.Views[view]) {
                var n = view.lastIndexOf('View');
                var template = view.slice(0, n) + view.slice(n).replace('View', 'Template');
                
                deferreds.push($.get('templates/' + template + '.html', function(data) {
                    App.Views[view].prototype.template = _.template(data);
                    //console.log(App.Views[view].prototype.template);
                }, 'html'));
            } else {
                //alert("The view '" + view + "' does not exist. Ensure the name is correct and the view has been included in the project.");
            }
        });
        
        $.when.apply(null, deferreds).done(callback);
    }

    //the public API
    return {
        load: load
    };
}());
