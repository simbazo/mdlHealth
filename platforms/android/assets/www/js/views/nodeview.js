//******************************************************************************
//Each model view wraps a <a> with <li> from the #nodeTemplate on the page.
//******************************************************************************
App.Views.NodeView = Backbone.Marionette.ItemView.extend({
    tagName: "li",
    template: this.template,
    
    onRender: function() {
        this.$el.closest('li').attr('id', this.model.attributes.ID)
                              .attr('href', this.model.attributes.ID)
                              .attr('pid', this.model.attributes.Parent_ID)
                              .attr('class', 'menu-block-' + this.model.attributes.Level_ID)
                              .attr('levelID', this.model.attributes.Level_ID);
                      
        if (this.model.attributes.Level_ID == 1) {
            switch (this.model.attributes.Header.toLowerCase()) {
                case "home":
                    this.$el.closest('li').attr("phaseid", "1");
                    this.$el.closest('li').addClass('phase-1');
                    break;
                case "foreword":
                    this.$el.closest('li').attr("phaseid", "2");
                    this.$el.closest('li').addClass('phase-2');
                    break;
                case "symptoms":
                    this.$el.closest('li').attr("phaseid", "3");
                    this.$el.closest('li').addClass('phase-3');
                    break;
                case "tb":
                    this.$el.closest('li').attr("phaseid", "4");
                    this.$el.closest('li').addClass('phase-4');
                    break;
                case "hiv":
                    this.$el.closest('li').attr("phaseid", "5");
                    this.$el.closest('li').addClass('phase-5');
                    break;
                case "chronic respiratory disease":
                    this.$el.closest('li').attr("phaseid", "6");
                    this.$el.closest('li').addClass('phase-6');
                    break;
                case "chronic diseases of lifestyle":
                    this.$el.closest('li').attr("phaseid", "7");
                    this.$el.closest('li').addClass('phase-7');
                    break;
                case "mental health":
                    this.$el.closest('li').attr("phaseid", "8");
                    this.$el.closest('li').addClass('phase-8');
                    break;
                case "epilepsy":
                    this.$el.closest('li').attr("phaseid", "9");
                    this.$el.closest('li').addClass('phase-9');
                    break;
                case "musculoskeletal disorders":
                    this.$el.closest('li').attr("phaseid", "10");
                    this.$el.closest('li').addClass('phase-10');
                    break;
                case "womens health":
                    this.$el.closest('li').attr("phaseid", "11");
                    this.$el.closest('li').addClass('phase-11');
                    break;
            };
        } else {
            if (this.model.attributes.Level_ID > 1) {
                //alert(this.$el.closest('li').css("background-color"));
            }
        }
    }
});

