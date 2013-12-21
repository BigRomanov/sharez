var Tagger = (function () {
    var wrapper       = null;
    var container     = null;
    var action_add    = null;
    var editor        = null;

    var tags          = [];


    // TODO: Move everything to templatizer
    var tagger_html = '\
                <div class="tagContainer">\
                  <a class="tagAction addTagAction">\
                    <img src="images/add_button.png" alt="Add tags" class="tagActionImg">\
                  </a>\
                </div>\
                <input class="tagEditor rounded", style="width:160px;display:none" ></input>';

    var Tagger = function () {
    };

    Tagger.prototype = {

      init: function(wrapper) {
        this.wrapper = $(wrapper);
        
        wrapper.append(tagger_html);

        this.container    = this.wrapper.find('.tagContainer');
        this.editor       = this.wrapper.find(".tagEditor")
        this.action_add   = this.wrapper.find(".addTagAction");

        this.registerCallbacks();
      },

      create: function (text) {
        console.log("create: " + text);
        if (text != "") {
          // Using precompiled templates, using templatizer
          var tag_html = templatizer.tagger.tag({'tag_text':text});
          $(this.action_add).before(tag_html);
        }
      },

      render: function(tags) {
        console.log("render tags: " + tags)
        this.tags = tags;
        _.each(this.tags, function(tag) {
          this.create(tag);
        }, this);
      },

      hideEditor: function () {
        this.editor.hide();
      },

      showEditor: function () {
        this.editor.val("");
        this.editor.show();
        this.editor.focus();
      },

      registerCallbacks: function() {
        var self = this;

        self.action_add.click(function() {
          $(this).hide();
          self.showEditor();
        });

        $(document.body).on('click', '.remove_tag' , function() {
          $(this).parent(".tag").remove();
        });

        // Editor events
        self.editor.blur(function() {
          console.log("BLUR");
          self.create($(this).val());
          self.hideEditor();
          self.action_add.show(); // TODO: convert to disabling of all header actions
        });

        // On enter or tab, new tag is created and 
        self.editor.keydown(function(event) {
          if (event.keyCode === 9 /* = Tab */) { 
            event.stopPropagation();
            event.preventDefault();
            self.create($(this).val());
            self.showEditor();
          }
        });
      }
    };

    return Tagger;
})();