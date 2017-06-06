App.Utils.ParseQueryString = function(queryString){
    var params = {};
    if(queryString){
        _.each(
            _.map(decodeURI(queryString).split(/&/g),function(el,i){
                var aux = el.split('='), o = {};
                if(aux.length >= 1){
                    var val = undefined;
                    if(aux.length == 2)
                        val = aux[1];
                    o[aux[0]] = val;
                }
                return o;
            }),
            function(o){
                _.extend(params,o);
            }
        );
    }
    return params;
}

App.Utils.HtmlEncode = function(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
};

App.Utils.HtmlDecode = function(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').html(value).text();
};

App.Utils.GetTriageOutcome = function(outcome, score, syndrome) {
    App.triageModel = new App.Models.Triage({
        Color : outcome,
        Score : score,
        Syndrome : syndrome
    });
    
    if (score > 0) {
        App.triageModel.set( {
            Mobility : $("input:radio[name='radio-mobility-h-2']:checked").parent().find('label:first').text(),
            RR: $("input:radio[name='radio-rr-h-2']:checked").parent().find('label:first').text() + ' / min',
            HR: $("input:radio[name='radio-hr-h-2']:checked").parent().find('label:first').text() + ' / min',
            SBP: $("input:radio[name='radio-sbp-h-2']:checked").parent().find('label:first').text() + ' mmHg',
            Temp: $("input:radio[name='radio-tmp-h-2']:checked").parent().find('label:first').text() + '&deg; C',
            AVPU: $("input:radio[name='radio-avpu-h-2']:checked").parent().find('label:first').text(),
            Trauma : $("input:radio[name='radio-trauma-h-2']:checked").parent().find('label:first').text()
        });
    }
    
    switch (outcome) {
        case 'red':
            App.triageModel.set({ Outcome : 'emergency' });
            App.triageModel.set({ Time : 'immediately' });
            break;
        case 'orange':
            App.triageModel.set({ Outcome : 'very urgent' });
            App.triageModel.set({ Time : 'within 10 minutes' });
            break;
        case 'yellow':
            App.triageModel.set({ Outcome : 'urgent' });
            App.triageModel.set({ Time : 'treat within 60 minutes' });
            break;
        case 'green':
            App.triageModel.set({ Outcome : 'all other patients' });
            App.triageModel.set({ Time : 'within 240 minutes' });
            break;
    }
    
    return App.triageModel;
};